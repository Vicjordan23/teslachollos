import type { Metadata } from "next";

export { acortarSinPuntos } from "@chollesla/core";

/** Imagen para compartir por defecto (logo dibujado a mano, sin IA). Las fichas usan la foto del producto. */
export const OG_POR_DEFECTO = "/og-chollesla.png";

/** Recorta un texto a `max` caracteres sin partir palabras. */
export function acortar(texto: string, max: number): string {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max - 1);
  const ultimo = corte.lastIndexOf(" ");
  return `${(ultimo > max * 0.6 ? corte.slice(0, ultimo) : corte).replace(/[\s,.;:\-–]+$/, "")}…`;
}

/**
 * Metadatos completos de una página indexable: título, descripción, canonical propio, hreflang es-ES,
 * Open Graph y Twitter con imagen. Un `openGraph` de página reemplaza al del layout, por eso se rellena entero aquí.
 */
export function metaPagina(raw: { titulo: string; descripcion: string; ruta: string; imagen?: string; absoluto?: boolean; noindex?: boolean }): Metadata {
  const p = { ...raw, descripcion: acortar(raw.descripcion, 158) };
  const imagen = p.imagen ?? OG_POR_DEFECTO;
  return {
    title: p.absoluto ? { absolute: p.titulo } : p.titulo,
    description: p.descripcion,
    alternates: { canonical: p.ruta, languages: { "es-ES": p.ruta, "x-default": p.ruta } },
    openGraph: { title: p.titulo, description: p.descripcion, url: p.ruta, siteName: "Chollesla", locale: "es_ES", type: "website", images: [imagen] },
    twitter: { card: "summary_large_image", title: p.titulo, description: p.descripcion, images: [imagen] },
    robots: p.noindex ? { index: false, follow: true } : undefined,
  };
}
