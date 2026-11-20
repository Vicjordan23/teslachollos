/**
 * Fotos de producto: siempre la foto real de la tienda enlazada (nunca generada por IA).
 * Solo se aceptan hosts conocidos, para no mostrar imágenes de cualquier sitio.
 */
export const HOSTS_FOTO = ["m.media-amazon.com", "cdn.shopify.com"] as const;

/** Proxy de imágenes que usaba el agente de Instagram; en la web se usa la foto original. */
const PROXY = "wsrv.nl";

/** URL https de la foto lista para la web, o null si no es de un host permitido. */
export function urlFoto(entrada: string | null | undefined): string | null {
  if (!entrada) return null;
  let url: URL;
  try {
    url = new URL(entrada.trim());
  } catch {
    return null;
  }
  if (url.hostname === PROXY) {
    const original = url.searchParams.get("url");
    return original ? urlFoto(original) : null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  return (HOSTS_FOTO as readonly string[]).includes(url.hostname) ? url.toString() : null;
}
