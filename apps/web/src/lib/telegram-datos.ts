import { leerSuscriptores, leerVistas } from "@chollesla/core";
import { CANALES_TIENDA, TELEGRAM } from "@/lib/telegram";

export interface DatosCanal {
  id: string;
  usuario: string;
  /** Suscriptores reales (null = Telegram no respondió). */
  suscriptores: number | null;
  /** Vistas sumadas de los últimos posts de la vista pública y cuántos posts son. */
  vistas: number | null;
  posts: number;
}

export const CANALES = [{ id: "principal", url: TELEGRAM }, ...CANALES_TIENDA].map((c) => ({ id: c.id, usuario: c.url.split("/").pop()! }));

async function pagina(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" }, signal: AbortSignal.timeout(6000) });
    return r.ok ? await r.text() : null;
  } catch {
    return null;
  }
}

export async function datosCanales(conVistas = false): Promise<DatosCanal[]> {
  return Promise.all(
    CANALES.map(async ({ id, usuario }) => {
      const [ficha, muro] = await Promise.all([pagina(`https://t.me/${usuario}`), conVistas ? pagina(`https://t.me/s/${usuario}`) : null]);
      const v = muro ? leerVistas(muro) : [];
      return {
        id,
        usuario,
        suscriptores: ficha ? leerSuscriptores(ficha) : null,
        vistas: muro ? v.reduce((a, b) => a + b, 0) : null,
        posts: v.length,
      };
    }),
  );
}
