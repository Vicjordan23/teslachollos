"use client";

import { useCallback, useEffect, useState } from "react";
import { useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";
import type { DatosCanal } from "@/lib/telegram-datos";

interface Metrica {
  id: number;
  fecha: string;
  red: string;
  seguidores: number | null;
  vistas: number | null;
  interacciones: number | null;
  notas: string | null;
}

interface Datos {
  telegram: DatosCanal[];
  metricas: Metrica[];
  aviso: string | null;
}

const REDES = ["tiktok", "youtube", "instagram", "facebook", "pinterest"];
const CAMPOS = ["seguidores", "vistas", "interacciones"] as const;
const th = "px-2 py-1 text-right font-medium capitalize first:text-left";
const td = "px-2 py-1 text-right tabular-nums first:text-left";
const caja = "rounded border border-borde bg-superficie px-2 py-1";
const n = (v: number | null | undefined) => (typeof v === "number" ? v.toLocaleString("es-ES") : "—");
const token = async () => (await supabase()?.auth.getSession())?.data.session?.access_token ?? "";

/** Seguidores, vistas e interacciones: Telegram en directo y las demás redes según el último dato guardado. */
export function PanelRedes() {
  const { sesion, listo } = useEstado();
  const [datos, setDatos] = useState<Datos | null>(null);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    const r = await fetch("/api/admin/redes", { headers: { Authorization: `Bearer ${await token()}` } });
    const j = (await r.json().catch(() => ({}))) as Datos & { error?: string };
    if (!r.ok) return setError(j.error ?? "Error");
    setError("");
    setDatos(j);
  }, []);

  useEffect(() => {
    if (sesion) void cargar();
  }, [sesion, cargar]);

  const guardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const r = await fetch("/api/admin/redes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
      body: JSON.stringify(Object.fromEntries(new FormData(f))),
    });
    if (!r.ok) return setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "No se pudo guardar.");
    f.reset();
    await cargar();
  };

  if (listo && !sesion) return <p className="text-texto-suave">Entra con tu cuenta de administrador.</p>;
  if (error && !datos) return <p role="alert">{error}</p>;
  if (!datos) return <p className="text-texto-suave">Cargando…</p>;

  // Las métricas llegan de la más nueva a la más antigua.
  const filas = REDES.map((red) => {
    const [ultima, anterior] = datos.metricas.filter((m) => m.red === red);
    return { red, ultima, anterior };
  });
  const cambio = (a: number | null | undefined, b: number | null | undefined) =>
    typeof a === "number" && typeof b === "number" && a !== b ? ` (${a > b ? "+" : ""}${(a - b).toLocaleString("es-ES")})` : "";

  return (
    <div className="flex flex-col gap-8">
      <button type="button" onClick={() => void cargar()} className={`w-fit ${caja}`}>
        🔄 Actualizar
      </button>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Redes sociales</h2>
        {datos.aviso && <p role="alert">{datos.aviso}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Red</th>
                {CAMPOS.map((c) => (
                  <th key={c} className={th}>
                    {c}
                  </th>
                ))}
                <th className={th}>Dato del</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(({ red, ultima, anterior }) => (
                <tr key={red} className="border-t border-borde">
                  <td className={`${td} capitalize`}>{red}</td>
                  {CAMPOS.map((c) => (
                    <td key={c} className={td}>
                      {n(ultima?.[c])}
                      <span className="text-texto-suave">{cambio(ultima?.[c], anterior?.[c])}</span>
                    </td>
                  ))}
                  <td className={td}>{ultima?.fecha ?? "sin datos"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Telegram (en directo)</h2>
        <p className="text-sm text-texto-suave">Suscriptores sin contarte a ti ni al bot. Las vistas son las de los últimos posts públicos de cada canal.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Canal</th>
                <th className={th}>Suscriptores</th>
                <th className={th}>Vistas</th>
                <th className={th}>Posts</th>
                <th className={th}>Vistas por post</th>
              </tr>
            </thead>
            <tbody>
              {datos.telegram.map((c) => (
                <tr key={c.id} className="border-t border-borde">
                  <td className={td}>
                    <a href={`https://t.me/${c.usuario}`} target="_blank" rel="noopener" className="hover:underline">
                      @{c.usuario}
                    </a>
                  </td>
                  <td className={td}>{n(c.suscriptores)}</td>
                  <td className={td}>{n(c.vistas)}</td>
                  <td className={td}>{c.posts || "—"}</td>
                  <td className={td}>{c.posts && c.vistas !== null ? n(Math.round(c.vistas / c.posts)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Anotar cifras</h2>
        <form onSubmit={guardar} className="flex flex-wrap items-end gap-2 text-sm">
          <label className="flex flex-col">
            Red
            <select name="red" required className={caja}>
              {REDES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Fecha
            <input name="fecha" type="date" required className={caja} />
          </label>
          {CAMPOS.map((c) => (
            <label key={c} className="flex flex-col capitalize">
              {c}
              <input name={c} type="number" min={0} className={`w-32 ${caja}`} />
            </label>
          ))}
          <label className="flex flex-col">
            Notas
            <input name="notas" maxLength={300} className={caja} />
          </label>
          <button type="submit" className="rounded bg-verde-boton px-4 py-1.5 font-medium text-white">
            Guardar
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
      </section>
    </div>
  );
}
