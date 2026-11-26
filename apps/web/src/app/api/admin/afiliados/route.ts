import { comprobarAdmin } from "@/lib/admin";
import { esResumen, periodo, tablas, type Clic, type Ingreso } from "@/lib/panel";
import { servicio } from "@/lib/supabase-servidor";

interface ClicChollo extends Clic {
  slug: string;
  titulo: string | null;
}

const respuesta = (cuerpo: object, status = 200) => Response.json(cuerpo, { status, headers: { "Cache-Control": "no-store" } });

/** Resumen para el panel: clics en «Ir al chollo» e ingresos de afiliados del periodo, por día, tienda y chollo. Solo administradores. */
export async function GET(req: Request) {
  const a = await comprobarAdmin(req);
  if ("error" in a) return respuesta({ error: a.error }, a.status);
  const per = periodo(new URL(req.url).searchParams.get("periodo") ?? "");
  const [rc, ri] = await Promise.all([
    servicio(`clics_ir?select=creado,slug,tienda,titulo&creado=gte.${per.desde}&creado=lt.${per.hasta}&order=creado.desc&limit=50000`),
    // Todos los ingresos: además de los del periodo hacen falta los resúmenes y la última fecha cargada de cada tienda.
    servicio("ingresos_afiliados?select=*&order=fecha.desc&limit=5000"),
  ]);
  if (!rc?.ok || !ri?.ok) return respuesta({ error: "Falta crear las tablas (migración 20261123000000)." }, 503);
  const clics = (await rc.json()) as ClicChollo[];
  const todos = (await ri.json()) as Ingreso[];

  const porChollo = new Map<string, { slug: string; titulo: string | null; tienda: string | null; clics: number }>();
  for (const c of clics) {
    const f = porChollo.get(c.slug) ?? { slug: c.slug, titulo: c.titulo, tienda: c.tienda, clics: 0 };
    f.clics++;
    porChollo.set(c.slug, f);
  }
  const ultimos: Record<string, string> = {};
  for (const i of todos) if (!esResumen(i) && (ultimos[i.tienda] ?? "") < i.fecha) ultimos[i.tienda] = i.fecha;

  return respuesta({
    periodo: per.etiqueta,
    fechaDesde: per.fechaDesde,
    fechaHasta: per.fechaHasta,
    ...tablas(clics, todos, per.fechaDesde, per.fechaHasta),
    chollos: [...porChollo.values()].sort((x, y) => y.clics - x.clics).slice(0, 100),
    ingresos: todos.filter((i) => !esResumen(i) && i.fecha >= per.fechaDesde && i.fecha <= per.fechaHasta),
    resumenes: todos.filter(esResumen),
    ultimos,
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
