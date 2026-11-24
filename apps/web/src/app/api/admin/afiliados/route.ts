import { comprobarAdmin } from "@/lib/admin";
import { servicio } from "@/lib/supabase-servidor";

const respuesta = (cuerpo: object, status = 200) => Response.json(cuerpo, { status, headers: { "Cache-Control": "no-store" } });

interface Clic {
  creado: string;
  slug: string;
  tienda: string | null;
  titulo: string | null;
}

const ZONA = "Europe/Madrid";

/** Fecha aaaa-mm-dd en Madrid de un instante. */
const diaMadrid = (t: number) => new Date(t).toLocaleDateString("sv-SE", { timeZone: ZONA });

/** Instante (ms) en que empieza el día `dia` (aaaa-mm-dd) en Madrid: se prueba con UTC+1 y UTC+2 (horario de invierno y de verano). */
function inicioDiaMadrid(dia: string): number {
  const [y, m, d] = dia.split("-").map(Number);
  for (const h of [1, 2]) {
    const t = Date.UTC(y!, m! - 1, d!, 0) - h * 3600_000;
    if (diaMadrid(t) === dia && diaMadrid(t - 1) !== dia) return t;
  }
  return Date.UTC(y!, m! - 1, d!, 0) - 3600_000;
}

/** Periodo pedido: «hoy», «ayer» o los últimos N días (por defecto 30). Devuelve desde (incluido) y hasta (excluido) en ISO y las fechas para ingresos. */
function periodo(url: URL) {
  const p = url.searchParams.get("periodo") ?? "";
  const hoy = diaMadrid(Date.now());
  if (p === "hoy" || p === "ayer") {
    const dia = p === "hoy" ? hoy : diaMadrid(inicioDiaMadrid(hoy) - 3600_000);
    const desde = inicioDiaMadrid(dia);
    return { etiqueta: p, dias: 1, desde: new Date(desde).toISOString(), hasta: new Date(desde + 24 * 3600_000).toISOString(), fechaDesde: dia, fechaHasta: dia };
  }
  const dias = Math.min(365, Math.max(1, Number(p) || Number(url.searchParams.get("dias")) || 30));
  const desde = new Date(Date.now() - dias * 864e5).toISOString();
  return { etiqueta: String(dias), dias, desde, hasta: new Date(Date.now() + 864e5).toISOString(), fechaDesde: desde.slice(0, 10), fechaHasta: "9999-12-31" };
}

/** Resumen para el panel: clics en «Ir al chollo» (por chollo, tienda y día) e ingresos de afiliados. Solo administradores. */
export async function GET(req: Request) {
  const a = await comprobarAdmin(req);
  if ("error" in a) return respuesta({ error: a.error }, a.status);
  const per = periodo(new URL(req.url));
  const dias = per.dias;
  const [rc, ri] = await Promise.all([
    servicio(`clics_ir?select=creado,slug,tienda,titulo&creado=gte.${per.desde}&creado=lt.${per.hasta}&order=creado.desc&limit=50000`),
    servicio(`ingresos_afiliados?select=*&fecha=gte.${per.fechaDesde}&fecha=lte.${per.fechaHasta}&order=fecha.desc&limit=2000`),
  ]);
  if (!rc?.ok || !ri?.ok) return respuesta({ error: "Falta crear las tablas (migración 20261123000000)." }, 503);
  const clics = (await rc.json()) as Clic[];
  const ingresos = await ri.json();

  const porChollo = new Map<string, { slug: string; titulo: string | null; tienda: string | null; clics: number; ultimo: string }>();
  const porTienda = new Map<string, number>();
  const porDia = new Map<string, number>();
  for (const c of clics) {
    const f = porChollo.get(c.slug) ?? { slug: c.slug, titulo: c.titulo, tienda: c.tienda, clics: 0, ultimo: c.creado };
    f.clics++;
    porChollo.set(c.slug, f);
    const t = c.tienda ?? "sin tienda";
    porTienda.set(t, (porTienda.get(t) ?? 0) + 1);
    const d = c.creado.slice(0, 10);
    porDia.set(d, (porDia.get(d) ?? 0) + 1);
  }
  return respuesta({
    dias,
    periodo: per.etiqueta,
    totalClics: clics.length,
    chollos: [...porChollo.values()].sort((x, y) => y.clics - x.clics).slice(0, 100),
    tiendas: [...porTienda].map(([tienda, n]) => ({ tienda, clics: n })).sort((x, y) => y.clics - x.clics),
    dia: [...porDia].map(([dia, n]) => ({ dia, clics: n })).sort((x, y) => (x.dia < y.dia ? 1 : -1)),
    ingresos,
  });
}

/** Alta manual (o actualización del mismo día/tienda) de un resultado de afiliado. */
export async function POST(req: Request) {
  const a = await comprobarAdmin(req);
  if ("error" in a) return respuesta({ error: a.error }, a.status);
  const j = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const euros = (v: unknown) => Math.round(Number(v) * 100) || 0;
  const entero = (v: unknown) => Math.max(0, Math.trunc(Number(v)) || 0);
  const tienda = String(j.tienda ?? "").trim().toLowerCase().slice(0, 40);
  const fecha = String(j.fecha ?? "");
  if (!tienda || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return respuesta({ error: "Indica tienda y fecha." }, 400);
  const estado = ["pendiente", "aprobada", "pagada", "rechazada"].includes(String(j.estado)) ? String(j.estado) : "pendiente";
  const r = await servicio("ingresos_afiliados?on_conflict=fecha,tienda,origen", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      fecha,
      tienda,
      clics_tienda: entero(j.clics_tienda),
      pedidos: entero(j.pedidos),
      ventas_cents: euros(j.ventas),
      comision_cents: euros(j.comision),
      estado,
      origen: "manual",
      notas: String(j.notas ?? "").slice(0, 300) || null,
    }),
  });
  return r?.ok ? respuesta({ ok: true }) : respuesta({ error: "No se pudo guardar." }, 500);
}

export async function DELETE(req: Request) {
  const a = await comprobarAdmin(req);
  if ("error" in a) return respuesta({ error: a.error }, a.status);
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return respuesta({ error: "Id no válido." }, 400);
  const r = await servicio(`ingresos_afiliados?id=eq.${id}`, { method: "DELETE" });
  return r?.ok ? respuesta({ ok: true }) : respuesta({ error: "No se pudo borrar." }, 500);
}
