import { servicio } from "@/lib/supabase-servidor";

/** Robots y vistas previas: no son personas pulsando «Ir al chollo». */
const ROBOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|curl|wget|python|go-http|monitor/i;

export function esRobot(userAgent: string | null): boolean {
  return !userAgent || ROBOTS.test(userAgent);
}

/**
 * Anota un clic en «Ir al chollo»: qué chollo y qué tienda. Ni IP ni identificadores de la persona.
 * Nunca falla hacia fuera: si Supabase no responde, el clic sigue su camino.
 */
export async function registrarClic(clic: { slug: string; tienda: string | null; titulo: string | null }, userAgent: string | null) {
  if (esRobot(userAgent)) return;
  try {
    await servicio("clics_ir", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ slug: clic.slug, tienda: clic.tienda, titulo: clic.titulo?.slice(0, 200) ?? null }),
      signal: AbortSignal.timeout(1500),
    });
  } catch {
    /* sin registro, pero la persona llega a la tienda */
  }
}
