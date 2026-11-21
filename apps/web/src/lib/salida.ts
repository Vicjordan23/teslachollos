import type { ResultadoEnlace } from "@chollesla/core";

/**
 * Enlace del botón «Ir al chollo».
 * - Amazon: directo a amazon.es con el tag, para que se vea claramente que es Amazon (su acuerdo de afiliados
 *   no permite ocultar o enmascarar los enlaces especiales).
 * - Resto de tiendas: por /ir/<slug>, que pone el afiliado en el servidor y deja el clic en los registros del Worker.
 */
export function enlaceSalida(slug: string, enlace: ResultadoEnlace, enlaceAfiliado?: string): string | null {
  if (enlaceAfiliado) return `/ir/${slug}`;
  if (enlace.estado !== "ok") return null;
  return enlace.tienda === "amazon" ? enlace.url : `/ir/${slug}`;
}

/**
 * Atributos del enlace «Ir al chollo»: datos para el evento de Analytics y, en los enlaces directos (Amazon),
 * el aviso `ping` con el que el navegador nos deja anotar el clic. Los demás pasan por /ir, que ya lo anota.
 */
export function atributosSalida(slug: string, titulo: string, tienda: string | null, salida: string) {
  return {
    "data-ir-slug": slug,
    "data-ir-titulo": titulo.slice(0, 120),
    "data-ir-tienda": tienda ?? "",
    ...(salida.startsWith("/ir/") ? {} : { ping: `/api/clic/${slug}` }),
  };
}
