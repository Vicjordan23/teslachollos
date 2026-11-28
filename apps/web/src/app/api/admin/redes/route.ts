import { comprobarAdmin } from "@/lib/admin";
import { servicio } from "@/lib/supabase-servidor";
import { datosCanales } from "@/lib/telegram-datos";

const REDES = ["tiktok", "youtube", "instagram", "facebook", "pinterest"];

const respuesta = (cuerpo: object, status = 200) => Response.json(cuerpo, { status, headers: { "Cache-Control": "no-store" } });

/** Telegram en directo y el histórico de las demás redes. Solo administradores. */
export async function GET(req: Request) {
  const a = await comprobarAdmin(req);
  if ("error" in a) return respuesta({ error: a.error }, a.status);
  const [telegram, r] = await Promise.all([datosCanales(true), servicio("metricas_redes?select=*&order=fecha.desc&limit=1000")]);
  return respuesta({
    telegram,
    metricas: r?.ok ? await r.json() : [],
    aviso: r?.ok ? null : "Falta crear la tabla (migración 20261128000000).",
  });
}

/** Alta o corrección de las cifras de una red en un día. Un campo vacío se guarda como «sin dato». */
export async function POST(req: Request) {
  const a = await comprobarAdmin(req);
  if ("error" in a) return respuesta({ error: a.error }, a.status);
  const j = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const entero = (v: unknown) => (v === "" || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Math.max(0, Math.trunc(Number(v))));
  const red = String(j.red ?? "");
  const fecha = String(j.fecha ?? "");
  if (!REDES.includes(red) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return respuesta({ error: "Indica red y fecha." }, 400);
  const r = await servicio("metricas_redes?on_conflict=fecha,red", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      fecha,
      red,
      seguidores: entero(j.seguidores),
      vistas: entero(j.vistas),
      interacciones: entero(j.interacciones),
      notas: String(j.notas ?? "").slice(0, 300) || null,
    }),
  });
  return r?.ok ? respuesta({ ok: true }) : respuesta({ error: "No se pudo guardar." }, 500);
}
