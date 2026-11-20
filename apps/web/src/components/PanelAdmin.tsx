"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatoEuros } from "@chollesla/core";
import { useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";

interface Pendiente {
  id: number;
  slug: string;
  titulo: string;
  enlace: string;
  precio_final: number;
  creado: string;
  perfiles: { alias: string } | null;
}
interface Reporte {
  id: number;
  motivo: string;
  detalle: string | null;
  creado: string;
  chollo_id: number;
  chollos: { slug: string; titulo: string; tipo: string; estado: string } | null;
}

/** Panel de moderación: chollos pendientes y reportes abiertos. Solo lo pueden usar los admin (lo comprueba el servidor). */
export function PanelAdmin() {
  const { sesion, listo } = useEstado();
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [version, setVersion] = useState(0);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const sb = supabase();
    if (!sb || !sesion) return;
    void (async () => {
      const { data: p } = await sb.from("perfiles").select("rol").eq("id", sesion.user.id).maybeSingle();
      setEsAdmin(p?.rol === "admin");
      if (p?.rol !== "admin") return;
      const [a, b] = await Promise.all([
        sb.from("chollos").select("id, slug, titulo, enlace, precio_final, creado, perfiles(alias)").eq("estado", "pendiente").order("creado"),
        sb.from("reportes").select("id, motivo, detalle, creado, chollo_id, chollos(slug, titulo, tipo, estado)").eq("estado", "abierto").order("creado"),
      ]);
      setPendientes((a.data as unknown as Pendiente[]) ?? []);
      setReportes((b.data as unknown as Reporte[]) ?? []);
    })();
  }, [sesion, version]);

  const moderar = async (cuerpo: object, pedirMotivo: boolean) => {
    const motivo = pedirMotivo ? prompt("Motivo (lo verá el autor):")?.trim() : "";
    if (pedirMotivo && !motivo) return;
    const token = (await supabase()?.auth.getSession())?.data.session?.access_token;
    const r = await fetch("/api/moderar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...cuerpo, motivo }),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setAviso(r.ok ? "Hecho." : (j.error ?? "Error"));
    setVersion((v) => v + 1);
  };

  if (listo && !sesion) return <p className="text-texto-suave">Entra con tu cuenta de administrador.</p>;
  if (esAdmin === null) return <p className="text-texto-suave">Cargando…</p>;
  if (!esAdmin) return <p className="text-texto-suave">Esta página es solo para administradores.</p>;

  const boton = "rounded-full border border-borde bg-superficie px-3 py-1 text-sm hover:border-verde/40";
  const ruta = (slug: string, tipo = "comunidad") => (tipo === "oficial" ? `/chollo/${slug}` : `/c/${slug}`);
  return (
    <div className="flex flex-col gap-8">
      {aviso && <p className="rounded-lg bg-verde-claro px-3 py-2 text-verde">{aviso}</p>}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Pendientes de revisión ({pendientes.length})</h2>
        {pendientes.length === 0 && <p className="text-texto-suave">Nada pendiente.</p>}
        {pendientes.map((c) => (
          <article key={c.id} className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-3">
            <p className="font-medium">{c.titulo}</p>
            <p className="text-sm text-texto-suave">
              @{c.perfiles?.alias} · {formatoEuros(c.precio_final)} · {new Date(c.creado).toLocaleString("es-ES")}
            </p>
            <a href={c.enlace} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-sm text-verde underline">
              {c.enlace}
            </a>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={boton} onClick={() => moderar({ accion: "publicar", chollo_id: c.id }, false)}>
                Publicar
              </button>
              <button type="button" className={boton} onClick={() => moderar({ accion: "retirar", chollo_id: c.id }, true)}>
                Rechazar
              </button>
              <button type="button" className={boton} onClick={() => moderar({ accion: "suspender", chollo_id: c.id }, true)}>
                Rechazar y suspender cuenta
              </button>
            </div>
          </article>
        ))}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Reportes abiertos ({reportes.length})</h2>
        {reportes.length === 0 && <p className="text-texto-suave">No hay reportes.</p>}
        {reportes.map((r) => (
          <article key={r.id} className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-3">
            <p>
              <strong>{r.motivo}</strong> ·{" "}
              {r.chollos && (
                <Link href={ruta(r.chollos.slug, r.chollos.tipo)} className="text-verde underline">
                  {r.chollos.titulo}
                </Link>
              )}{" "}
              <span className="text-sm text-texto-suave">({r.chollos?.tipo}, {r.chollos?.estado})</span>
            </p>
            {r.detalle && <p className="whitespace-pre-line text-sm">{r.detalle}</p>}
            <div className="flex flex-wrap gap-2">
              <button type="button" className={boton} onClick={() => moderar({ accion: "rechazar_reporte", chollo_id: r.chollo_id, reporte_id: r.id }, false)}>
                Descartar
              </button>
              <button type="button" className={boton} onClick={() => moderar({ accion: "caducar", chollo_id: r.chollo_id, reporte_id: r.id }, true)}>
                Marcar caducado
              </button>
              <button type="button" className={boton} onClick={() => moderar({ accion: "retirar", chollo_id: r.chollo_id, reporte_id: r.id }, true)}>
                Retirar
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
