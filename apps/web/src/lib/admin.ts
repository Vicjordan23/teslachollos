import { servicio, usuarioDe } from "@/lib/supabase-servidor";

/** Comprueba que la petición viene de una persona de la tabla `administradores`. Devuelve su id o un error HTTP. */
export async function comprobarAdmin(req: Request): Promise<{ id: string } | { error: string; status: number }> {
  const usuario = await usuarioDe(req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "");
  if (!usuario) return { error: "Sin sesión.", status: 401 };
  const r = await servicio(`administradores?select=user_id&user_id=eq.${usuario.id}`);
  if (!r?.ok) return { error: "Panel no activado.", status: 503 };
  if (((await r.json()) as unknown[]).length === 0) return { error: "Solo administradores.", status: 403 };
  return usuario;
}
