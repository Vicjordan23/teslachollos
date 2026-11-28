import { datosCanales, type DatosCanal } from "@/lib/telegram-datos";

export const dynamic = "force-dynamic";

const DURA = 10 * 60 * 1000;
let guardado: { hasta: number; canales: DatosCanal[] } | null = null;

/** Suscriptores reales de cada canal (datos públicos de t.me), con caché de 10 minutos. */
export async function GET() {
  if (!guardado || guardado.hasta < Date.now()) {
    const nuevos = await datosCanales();
    // Si Telegram falla en un canal, se conserva el último dato bueno.
    const canales = nuevos.map((c) => (c.suscriptores === null ? (guardado?.canales.find((a) => a.id === c.id) ?? c) : c));
    guardado = { hasta: Date.now() + DURA, canales };
  }
  const suscriptores = Object.fromEntries(guardado.canales.map((c) => [c.id, c.suscriptores]));
  return Response.json({ suscriptores }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=600" } });
}
