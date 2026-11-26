"use client";

import { useCallback, useEffect, useState } from "react";
import { useEstado } from "@/lib/interacciones";
import { ZONA, type Cifras, type Ingreso } from "@/lib/panel";
import { supabase } from "@/lib/supabase";

interface Resumen {
  periodo: string;
  fechaDesde: string;
  fechaHasta: string;
  dias: ({ dia: string } & Cifras)[];
  tiendas: ({ tienda: string } & Cifras)[];
  total: Cifras;
  chollos: { slug: string; titulo: string | null; tienda: string | null; clics: number }[];
  ingresos: Ingreso[];
  resumenes: Ingreso[];
  ultimos: Record<string, string>;
}

const eur = (c: number) => (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const fechaCorta = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: ZONA });
const th = "px-2 py-1 text-right font-medium first:text-left";
const td = "px-2 py-1 text-right tabular-nums first:text-left";

/** Cifra de la tienda: «—» si no hay dato; «≥» si la tienda ocultó parte del periodo. */
function dato(c: Cifras, campo: "pedidos" | "ventas" | "comision"): string {
  const p = c.programa;
  if (!p || (p.incompleto && !p[campo])) return "—";
  const valor = campo === "pedidos" ? String(p.pedidos) : eur(p[campo]);
  return p.incompleto ? `≥ ${valor}` : valor;
}

/** Tabla común: una fila por día o por tienda, y el total del periodo. «—» = la tienda aún no ha dado el dato. */
function Tabla({ primera, filas, total }: { primera: string; filas: ({ clave: string; nombre: string } & Cifras)[]; total: Cifras }) {
  const celdas = (c: Cifras) => (
    <>
      <td className={`${td} font-semibold`}>{c.clics}</td>
      <td className={`${td} border-l border-borde`}>{c.programa ? c.programa.clics : "—"}</td>
      <td className={td}>{dato(c, "pedidos")}</td>
      <td className={td}>{dato(c, "ventas")}</td>
      <td className={td}>{dato(c, "comision")}</td>
    </>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-texto-suave">
            <th className={th} />
            <th className={th}>Nuestra web</th>
            <th className="border-l border-borde px-2 py-1 text-center font-medium" colSpan={4}>
              Según la tienda
            </th>
          </tr>
          <tr>
            <th className={th}>{primera}</th>
            <th className={th}>Clics</th>
            <th className={`${th} border-l border-borde`}>Clics</th>
            <th className={th}>Artículos pedidos</th>
            <th className={th}>Ventas</th>
            <th className={th}>Comisión</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.clave} className="border-t border-borde">
              <td className={td}>{f.nombre}</td>
              {celdas(f)}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-borde font-semibold">
            <td className={td}>TOTAL</td>
            {celdas(total)}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/** Panel único de afiliados: clics en «Ir al chollo» y resultados (clics, pedidos, ventas, comisión) de todos los programas. */
export function PanelAfiliados() {
  const { sesion, listo } = useEstado();
  const [periodo, setPeriodo] = useState("hoy");
  const [datos, setDatos] = useState<Resumen | null>(null);
  const [error, setError] = useState("");
  const [actualizado, setActualizado] = useState("");
  const [cargando, setCargando] = useState(false);

  const token = async () => (await supabase()?.auth.getSession())?.data.session?.access_token ?? "";
  const cargar = useCallback(async () => {
    setCargando(true);
    const r = await fetch(`/api/admin/afiliados?periodo=${periodo}`, { headers: { Authorization: `Bearer ${await token()}` } });
    const j = (await r.json().catch(() => ({}))) as Resumen & { error?: string };
    if (!r.ok) {
      setError(j.error ?? "Error");
      setDatos(null);
    } else {
      setError("");
      setDatos(j);
      setActualizado(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
    setCargando(false);
  }, [periodo]);

  useEffect(() => {
    if (sesion) void cargar();
  }, [sesion, cargar]);

  const guardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const cuerpo = Object.fromEntries(new FormData(f));
    const r = await fetch("/api/admin/afiliados", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
      body: JSON.stringify(cuerpo),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    if (r.ok) f.reset();
    setError(r.ok ? "" : (j.error ?? "Error"));
    await cargar();
  };
  const borrar = async (id: number) => {
    if (!confirm("¿Borrar este registro?")) return;
    await fetch(`/api/admin/afiliados?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${await token()}` } });
    await cargar();
  };

  if (listo && !sesion) return <p className="text-texto-suave">Entra con tu cuenta de administrador.</p>;
  if (!datos || datos.periodo !== periodo) return <p className="text-texto-suave">{error || "Cargando…"}</p>;

  const unDia = datos.fechaDesde === datos.fechaHasta;
  const rotulo = unDia ? `solo el ${fechaCorta(datos.fechaDesde)}` : `del ${fechaCorta(datos.fechaDesde)} al ${fechaCorta(datos.fechaHasta)}, ambos incluidos`;
  const caja = "rounded-xl border border-borde bg-superficie p-3";
  const campo = "rounded border border-borde bg-fondo px-2 py-1 text-sm";

  return (
    <div className="flex flex-col gap-8">
      {error && <p className="rounded-lg bg-verde-claro px-3 py-2 text-verde">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          Periodo{" "}
          <select className={campo} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            {[7, 30, 90, 365].map((d) => (
              <option key={d} value={String(d)}>
                últimos {d} días
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => void cargar()} disabled={cargando} className="rounded-lg bg-verde-boton px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60">
          {cargando ? "Actualizando…" : "🔄 Actualizar"}
        </button>
        {actualizado && <span className="text-xs text-texto-suave">Actualizado a las {actualizado}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg">
          Mostrando <b>{rotulo}</b> (hora de Madrid).
        </p>
        <div className="flex flex-wrap gap-3">
          <p className={caja}>
            <b>{datos.total.clics}</b> clics en la web
          </p>
          <p className={caja}>
            <b>{dato(datos.total, "pedidos")}</b> artículos pedidos
          </p>
          <p className={caja}>
            <b>{dato(datos.total, "comision")}</b> de comisión
          </p>
        </div>
        <ul className="list-disc pl-5 text-sm text-texto-suave">
          <li>«Nuestra web» cuenta los botones «Ir al chollo» de chollesla.es. Los clics desde Telegram, Facebook o Instagram van directos a la tienda y no salen ahí.</li>
          <li>«Según la tienda» es lo que informa cada programa e incluye todos los canales. «—» significa que no hay dato cargado, no que sea cero. «≥» significa que la tienda ocultó parte: Amazon no enseña los pedidos ni la comisión de muchos días con poco tráfico (el total real está abajo, en «Totales de varios días»).</li>
          <li>
            Último día cargado por tienda:{" "}
            {Object.keys(datos.ultimos).length ? Object.entries(datos.ultimos).map(([t, d]) => `${t} ${fechaCorta(d)}`).join(" · ") : "ninguno todavía"}.
          </li>
        </ul>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Por tienda</h2>
        {datos.tiendas.length === 0 ? (
          <p className="text-texto-suave">Sin clics ni datos de tiendas en este periodo.</p>
        ) : (
          <Tabla primera="Tienda" filas={datos.tiendas.map((f) => ({ ...f, clave: f.tienda, nombre: f.tienda }))} total={datos.total} />
        )}
      </section>

      {!unDia && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Día a día</h2>
          <Tabla primera="Día" filas={datos.dias.map((f) => ({ ...f, clave: f.dia, nombre: fechaCorta(f.dia) }))} total={datos.total} />
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Chollos más pulsados en la web</h2>
        {datos.chollos.length === 0 && <p className="text-texto-suave">Aún no hay clics en este periodo.</p>}
        <ol className="flex flex-col gap-1 text-sm">
          {datos.chollos.map((c) => (
            <li key={c.slug} className="flex justify-between gap-3 border-t border-borde py-1">
              <a href={`/chollo/${c.slug}`} className="hover:underline">
                {c.titulo ?? c.slug} <span className="text-texto-suave">({c.tienda ?? "—"})</span>
              </a>
              <b>{c.clics}</b>
            </li>
          ))}
        </ol>
      </section>

      {datos.resumenes.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Totales de varios días (aparte, no se suman arriba)</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {datos.resumenes.map((i) => (
              <li key={i.id} className="border-t border-borde py-1">
                {i.tienda}: {i.clics_tienda} clics · {i.pedidos} pedidos · ventas {eur(i.ventas_cents)} · comisión <b>{eur(i.comision_cents)}</b>
                <span className="text-texto-suave"> — {i.notas}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Resultados de los programas (a mano)</h2>
        <form onSubmit={guardar} className="flex flex-wrap items-end gap-2">
          <input name="fecha" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={campo} />
          <input name="tienda" required placeholder="tienda (amazon, aliexpress…)" className={campo} />
          <input name="clics_tienda" type="number" min="0" placeholder="clics" className={`${campo} w-20`} />
          <input name="pedidos" type="number" min="0" placeholder="pedidos" className={`${campo} w-24`} />
          <input name="ventas" type="number" step="0.01" min="0" placeholder="ventas €" className={`${campo} w-28`} />
          <input name="comision" type="number" step="0.01" min="0" placeholder="comisión €" className={`${campo} w-28`} />
          <select name="estado" className={campo}>
            {["pendiente", "aprobada", "pagada", "rechazada"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input name="notas" placeholder="notas" className={campo} />
          <button className="rounded-full border border-borde bg-superficie px-3 py-1 text-sm hover:border-verde/40">Guardar</button>
        </form>
        <ul className="flex flex-col gap-1 text-sm">
          {datos.ingresos.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-borde py-1">
              <span>
                {i.fecha} · {i.tienda} · {i.pedidos} pedidos · ventas {eur(i.ventas_cents)} · comisión <b>{eur(i.comision_cents)}</b> · {i.estado}
                {i.notas ? ` · ${i.notas}` : ""}
              </span>
              <button onClick={() => borrar(i.id)} className="text-texto-suave hover:underline">
                borrar
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
