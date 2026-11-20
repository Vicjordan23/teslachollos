import { servicio, usuarioDe } from "@/lib/supabase-servidor";

const respuesta = (cuerpo: object, status = 200) => Response.json(cuerpo, { status, headers: { "Cache-Control": "no-store" } });

type Accion = "publicar" | "retirar" | "caducar" | "aceptar_reporte" | "rechazar_reporte" | "suspender";
const ESTADO: Partial<Record<Accion, string>> = { publicar: "publicado", retirar: "retirado", caducar: "caducado" };

/**
 * Moderación (solo admin). Cada decisión sobre un chollo o una cuenta queda en `moderacion` con su motivo,
 * que el autor ve en su cuenta (Reglamento de Servicios Digitales, art. 17).
 */
export async function POST(req: Request) {
  const usuario = await usuarioDe(req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "");
  if (!usuario) return respuesta({ error: "Sin sesión." }, 401);
  const perfil = await servicio(`perfiles?select=rol&id=eq.${usuario.id}`);
  if (!perfil) return respuesta({ error: "Moderación no activada." }, 503);
  if (((await perfil.json()) as { rol: string }[])[0]?.rol !== "admin") return respuesta({ error: "Solo administradores." }, 403);

  const j = (await req.json().catch(() => ({}))) as { accion?: Accion; chollo_id?: number; reporte_id?: number; motivo?: string };
  const motivo = (j.motivo ?? "").trim().slice(0, 2000);
  const cholloId = Number(j.chollo_id);
  if (!j.accion || !Number.isInteger(cholloId) || cholloId <= 0) return respuesta({ error: "Datos no válidos." }, 400);
  if (j.accion !== "publicar" && j.accion !== "rechazar_reporte" && motivo.length < 5) {
    return respuesta({ error: "Explica el motivo (mínimo 5 caracteres): lo verá el autor." }, 422);
  }

  const ahora = new Date().toISOString();
  const estado = ESTADO[j.accion];
  if (estado) {
    await servicio(`chollos?id=eq.${cholloId}`, { method: "PATCH", body: JSON.stringify({ estado, actualizado: ahora }), headers: { Prefer: "return=minimal" } });
  }
  if (j.accion === "suspender") {
    const r = await servicio(`chollos?select=autor&id=eq.${cholloId}`);
    const autor = ((await r?.json()) as { autor: string | null }[] | undefined)?.[0]?.autor;
    if (!autor) return respuesta({ error: "Ese chollo no tiene autor." }, 404);
    await servicio(`perfiles?id=eq.${autor}`, { method: "PATCH", body: JSON.stringify({ suspendido: true }), headers: { Prefer: "return=minimal" } });
    await servicio(`chollos?autor=eq.${autor}&estado=in.(pendiente,publicado)`, {
      method: "PATCH",
      body: JSON.stringify({ estado: "retirado", actualizado: ahora }),
      headers: { Prefer: "return=minimal" },
    });
  }
  if (j.accion === "aceptar_reporte" || j.accion === "rechazar_reporte" || estado) {
    // Al decidir sobre el chollo se cierran sus reportes abiertos (aceptados si se retira o caduca).
    const filtro = Number.isInteger(j.reporte_id) ? `id=eq.${j.reporte_id}` : `chollo_id=eq.${cholloId}&estado=eq.abierto`;
    const nuevo = j.accion === "rechazar_reporte" || j.accion === "publicar" ? "rechazado" : "aceptado";
    if (j.accion !== "publicar" || Number.isInteger(j.reporte_id)) {
      await servicio(`reportes?${filtro}`, { method: "PATCH", body: JSON.stringify({ estado: nuevo }), headers: { Prefer: "return=minimal" } });
    }
  }
  const decision = { publicar: "publicar", retirar: "retirar", caducar: "caducar", suspender: "suspender", aceptar_reporte: "aviso", rechazar_reporte: null }[j.accion];
  if (decision) {
    await servicio("moderacion", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ chollo_id: cholloId, admin_id: usuario.id, decision, motivo: motivo || "Revisado y publicado." }),
    });
  }
  return respuesta({ ok: true });
}
