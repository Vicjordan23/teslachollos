"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/**
 * Estado compartido de cuenta, temperatura, votos y guardados. Las fichas se pintan en el servidor (estáticas);
 * cada ficha registra su slug y aquí se piden todos juntos a Supabase en una sola consulta.
 */
export interface EstadoChollo {
  id: number;
  temperatura: number;
  voto: -1 | 0 | 1;
  guardado: boolean;
}

interface Estado {
  sesion: Session | null;
  /** undefined: cargando; null: aún no ha elegido alias. */
  alias: string | null | undefined;
  /** true cuando ya se sabe si hay sesión. */
  listo: boolean;
  chollos: Record<string, EstadoChollo>;
}

let estado: Estado = { sesion: null, alias: null, listo: false, chollos: {} };
const oyentes = new Set<() => void>();
const pendientes = new Set<string>();
let temporizador: ReturnType<typeof setTimeout> | null = null;
let iniciado = false;

function cambiar(parcial: Partial<Estado>) {
  estado = { ...estado, ...parcial };
  oyentes.forEach((o) => o());
}

function cambiarChollo(slug: string, parcial: Partial<EstadoChollo>) {
  const actual = estado.chollos[slug];
  if (!actual) return;
  cambiar({ chollos: { ...estado.chollos, [slug]: { ...actual, ...parcial } } });
}

async function cargarAlias(sesion: Session | null) {
  const sb = supabase();
  if (!sb || !sesion) return cambiar({ alias: null });
  cambiar({ alias: undefined });
  const { data } = await sb.from("perfiles").select("alias").eq("id", sesion.user.id).maybeSingle();
  cambiar({ alias: data?.alias ?? null });
}

function iniciar() {
  if (iniciado) return;
  iniciado = true;
  const sb = supabase();
  if (!sb) return cambiar({ listo: true });
  // Temperatura en directo: cuando alguien vota un chollo que está en pantalla, se vuelve a pedir su temperatura.
  sb.channel("votos")
    .on("postgres_changes", { event: "*", schema: "public", table: "votos" }, (cambio) => {
      const id = ((cambio.new as { chollo_id?: number })?.chollo_id ?? (cambio.old as { chollo_id?: number })?.chollo_id) as number | undefined;
      const slug = Object.keys(estado.chollos).find((s) => estado.chollos[s]!.id === id);
      if (slug) refrescarTemperatura(slug);
    })
    .subscribe();
  sb.auth.onAuthStateChange((evento, sesion) => {
    const cambioUsuario = sesion?.user.id !== estado.sesion?.user.id;
    cambiar({ sesion, listo: true });
    if (cambioUsuario || evento === "SIGNED_IN") {
      void cargarAlias(sesion);
      // Recarga votos y guardados de todo lo que hay en pantalla con el nuevo usuario.
      Object.keys(estado.chollos).forEach((s) => pendientes.add(s));
      programar();
    }
  });
}

const refrescos = new Set<string>();
let temporizadorRefresco: ReturnType<typeof setTimeout> | null = null;

function refrescarTemperatura(slug: string) {
  refrescos.add(slug);
  if (temporizadorRefresco) return;
  temporizadorRefresco = setTimeout(async () => {
    temporizadorRefresco = null;
    const slugs = [...refrescos];
    refrescos.clear();
    const { data } = (await supabase()?.from("chollos_publicos").select("slug, temperatura").in("slug", slugs)) ?? {};
    for (const f of data ?? []) cambiarChollo(f.slug as string, { temperatura: f.temperatura as number });
  }, 500);
}

function programar() {
  if (temporizador) return;
  temporizador = setTimeout(() => {
    temporizador = null;
    void cargar([...pendientes]);
    pendientes.clear();
  }, 30);
}

async function cargar(slugs: string[]) {
  const sb = supabase();
  if (!sb || slugs.length === 0) return;
  for (let i = 0; i < slugs.length; i += 100) {
    const tanda = slugs.slice(i, i + 100);
    const { data: filas } = await sb.from("chollos_publicos").select("id, slug, temperatura").in("slug", tanda);
    if (!filas?.length) continue;
    const ids = filas.map((f) => f.id as number);
    const usuario = estado.sesion?.user.id;
    const [votos, guardados] = usuario
      ? await Promise.all([
          sb.from("votos").select("chollo_id, valor").eq("usuario_id", usuario).in("chollo_id", ids),
          sb.from("guardados").select("chollo_id").eq("usuario_id", usuario).in("chollo_id", ids),
        ])
      : [{ data: [] }, { data: [] }];
    const voto = new Map((votos.data ?? []).map((v) => [v.chollo_id as number, v.valor as -1 | 1]));
    const guardado = new Set((guardados.data ?? []).map((g) => g.chollo_id as number));
    const nuevos = { ...estado.chollos };
    for (const f of filas) {
      nuevos[f.slug as string] = {
        id: f.id as number,
        temperatura: f.temperatura as number,
        voto: voto.get(f.id as number) ?? 0,
        guardado: guardado.has(f.id as number),
      };
    }
    cambiar({ chollos: nuevos });
  }
}

function suscribir(o: () => void) {
  oyentes.add(o);
  return () => oyentes.delete(o);
}

const SERVIDOR: Estado = { sesion: null, alias: null, listo: false, chollos: {} };

/** Estado global (cuenta y chollos). */
export function useEstado(): Estado {
  useEffect(iniciar, []);
  return useSyncExternalStore(suscribir, () => estado, () => SERVIDOR);
}

/** Estado de un chollo; lo pide a Supabase la primera vez. */
export function useChollo(slug: string): EstadoChollo | undefined {
  const e = useEstado();
  useEffect(() => {
    if (!supabase() || estado.chollos[slug]) return;
    pendientes.add(slug);
    programar();
  }, [slug]);
  return e.chollos[slug];
}

/** Vota (+1 / -1); repetir el mismo voto lo quita. Devuelve false si hay que iniciar sesión. */
export async function votar(slug: string, valor: 1 | -1): Promise<boolean> {
  const sb = supabase();
  const c = estado.chollos[slug];
  const usuario = estado.sesion?.user.id;
  if (!sb || !usuario || !estado.alias) return false;
  if (!c) return true;
  const nuevo = c.voto === valor ? 0 : valor;
  const anterior = { voto: c.voto, temperatura: c.temperatura };
  cambiarChollo(slug, { voto: nuevo, temperatura: c.temperatura - c.voto + nuevo });
  const { error } =
    nuevo === 0
      ? await sb.from("votos").delete().eq("chollo_id", c.id).eq("usuario_id", usuario)
      : await sb.from("votos").upsert({ chollo_id: c.id, usuario_id: usuario, valor: nuevo });
  if (error) cambiarChollo(slug, anterior);
  return true;
}

/** Guarda o quita de guardados. Devuelve false si hay que iniciar sesión. */
export async function alternarGuardado(slug: string): Promise<boolean> {
  const sb = supabase();
  const c = estado.chollos[slug];
  const usuario = estado.sesion?.user.id;
  if (!sb || !usuario || !estado.alias) return false;
  if (!c) return true;
  cambiarChollo(slug, { guardado: !c.guardado });
  const { error } = c.guardado
    ? await sb.from("guardados").delete().eq("chollo_id", c.id).eq("usuario_id", usuario)
    : await sb.from("guardados").insert({ chollo_id: c.id, usuario_id: usuario });
  if (error) cambiarChollo(slug, { guardado: c.guardado });
  return true;
}

/** Tras crear el alias en /cuenta. */
export function aliasCreado(alias: string) {
  cambiar({ alias });
}
