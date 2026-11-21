"use client";

import { useCallback, useEffect, useState } from "react";
import { useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";

interface Resumen {
  dias: number;
  totalClics: number;
  chollos: { slug: string; titulo: string | null; tienda: string | null; clics: number; ultimo: string }[];
  tiendas: { tienda: string; clics: number }[];
  dia: { dia: string; clics: number }[];
  ingresos: { id: number; fecha: string; tienda: string; clics_tienda: number; pedidos: number; ventas_cents: number; comision_cents: number; estado: string; origen: string; notas: string | null }[];
}

const eur = (c: number) => (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });

/** Panel único de afiliados: clics en «Ir al chollo» y resultados (clics, pedidos, ventas, comisión) de todos los programas. */
export function PanelAfiliados() {
  const { sesion, listo } = useEstado();
  const [dias, setDias] = useState(30);
  const [datos, setDatos] = useState<Resumen | null>(null);
  const [error, setError] = useState("");

  const token = async () => (await supabase()?.auth.getSession())?.data.session?.access_token ?? "";
  const cargar = useCallback(async () => {
    const r = await fetch(`/api/admin/afiliados?dias=${dias}`, { headers: { Authorization: `Bearer ${await token()}` } });
    const j = (await r.json().catch(() => ({}))) as Resumen & { error?: string };
    if (!r.ok) {
      setError(j.error ?? "Error");
      setDatos(null);
    } else {
      setError("");
      setDatos(j);
    }
  }, [dias]);

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
  if (!datos) return <p className="text-texto-suave">{error || "Cargando…"}</p>;

  // Resumen por tienda: clics propios + resultados de los programas.
  const tiendas = new Map<string, { clics: number; clicsTienda: number; pedidos: number; ventas: number; comision: number }>();
  const fila = (t: string) => tiendas.get(t) ?? { clics: 0, clicsTienda: 0, pedidos: 0, ventas: 0, comision: 0 };
  for (const t of datos.tiendas) tiendas.set(t.tienda, { ...fila(t.tienda), clics: t.clics });
  for (const i of datos.ingresos) {
    const f = fila(i.tienda);
    tiendas.set(i.tienda, { ...f, clicsTienda: f.clicsTienda + i.clics_tienda, pedidos: f.pedidos + i.pedidos, ventas: f.ventas + i.ventas_cents, comision: f.comision + i.comision_cents });
  }
  const totalCom = [...tiendas.values()].reduce((s, t) => s + t.comision, 0);
  const caja = "rounded-xl border border-borde bg-superficie p-3";
  const campo = "rounded border border-borde bg-fondo px-2 py-1 text-sm";
  const th = "px-2 py-1 text-left font-medium";
  const td = "px-2 py-1";

  return (
    <div className="flex flex-col gap-8">
      {error && <p className="rounded-lg bg-verde-claro px-3 py-2 text-verde">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          Periodo{" "}
          <select className={campo} value={dias} onChange={(e) => setDias(Number(e.target.value))}>
            {[7, 30, 90, 365].map((d) => (
              <option key={d} value={d}>
                últimos {d} días
              </option>
            ))}
          </select>
        </label>
        <p className={caja}>
          <b>{datos.totalClics}</b> clics en «Ir al chollo»
        </p>
        <p className={caja}>
          <b>{eur(totalCom)}</b> de comisión registrada
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Por tienda / programa</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Tienda</th>
                <th className={th}>Clics Chollesla</th>
                <th className={th}>Clics en tienda</th>
                <th className={th}>Pedidos</th>
                <th className={th}>Ventas</th>
                <th className={th}>Comisión</th>
                <th className={th}>€/clic</th>
              </tr>
            </thead>
            <tbody>
              {[...tiendas]
                .sort((a, b) => b[1].clics - a[1].clics)
                .map(([t, v]) => (
                  <tr key={t} className="border-t border-borde">
                    <td className={td}>{t}</td>
                    <td className={td}>{v.clics}</td>
                    <td className={td}>{v.clicsTienda || "—"}</td>
                    <td className={td}>{v.pedidos}</td>
                    <td className={td}>{eur(v.ventas)}</td>
                    <td className={td}>{eur(v.comision)}</td>
                    <td className={td}>{v.clics ? eur(v.comision / v.clics) : "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Chollos más pulsados</h2>
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

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Clics por día</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {datos.dia.map((d) => (
            <li key={d.dia} className={caja}>
              {d.dia}: <b>{d.clics}</b>
            </li>
          ))}
        </ul>
      </section>

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
