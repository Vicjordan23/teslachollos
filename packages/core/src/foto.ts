/**
 * Fotos de producto: siempre la foto real de la tienda enlazada (nunca generada por IA).
 * Solo se aceptan hosts conocidos, para no mostrar imágenes de cualquier sitio.
 */
export const HOSTS_FOTO = ["m.media-amazon.com", "cdn.shopify.com", "ae01.alicdn.com", "ae-pic-a1.aliexpress-media.com"] as const;

/** Proxy de imágenes que usaba el agente de Instagram; en la web se usa la foto original. */
const PROXY = "wsrv.nl";

/**
 * Pide al CDN de la tienda la foto ya reducida al ancho indicado (gratis, sin optimizador propio):
 * Amazon cambia el modificador «._AC_SL1200_.» por «._AC_SL<ancho>_.»; Shopify acepta «?width=<ancho>».
 * Si la URL no es de un host conocido, se devuelve igual.
 */
export function fotoConAncho(url: string, ancho: number): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  const w = Math.max(1, Math.round(ancho));
  if (u.hostname === "m.media-amazon.com") {
    u.pathname = /\._[^/]*_\.(jpe?g|png|webp)$/i.test(u.pathname)
      ? u.pathname.replace(/\._[^/]*_\.(jpe?g|png|webp)$/i, `._AC_SL${w}_.$1`)
      : u.pathname.replace(/\.(jpe?g|png|webp)$/i, `._AC_SL${w}_.$1`);
    return u.toString();
  }
  if (u.hostname === "cdn.shopify.com") {
    u.searchParams.set("width", String(w));
    return u.toString();
  }
  return url;
}

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
