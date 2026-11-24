import { esAcortador, hostLimpio, tiendaDeUrl, type IdTienda, type Tienda } from "./tiendas.js";

/** Datos de afiliado de Vic. No son secretos: van en todos los enlaces públicos. */
export const AFILIADO = {
  amazonTag: "teslaaccesorios-21",
  hansshowRef: "nBeGMuizu9",
  jowuaGhref: "5866:1343863",
  jowuaDescuento: "accesoriostesla",
  teseryRef: "AccesoriosTesla",
  awinMid: "67740",
  awinAffid: "3115223",
} as const;

export const AVISO_AMAZON =
  "En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos.";
export const AVISO_GENERAL = "Enlace de afiliado: Chollesla puede ganar una comisión si compras, sin coste extra para ti.";

/**
 * Parámetros de afiliado o seguimiento de terceros que se quitan siempre,
 * para que nunca quede el afiliado de otra persona en un chollo.
 */
const PARAMETROS_AJENOS = [
  "tag", "ascsubtag", "linkcode", "linkid", "camp", "creative", "creativeasin",
  "ref", "ref_", "aff", "affid", "aff_id", "affiliate", "affiliate_id",
  "bg_ref", "ghref", "discount", "sca_ref", "irclickid", "clickid", "gclid", "fbclid",
];

export type ResultadoEnlace =
  | { estado: "ok"; url: string; tienda: IdTienda | null }
  | { estado: "resolver"; motivo: "acortador" }
  | { estado: "invalido"; motivo: string };

function limpiarParametros(url: URL): void {
  for (const clave of [...url.searchParams.keys()]) {
    const c = clave.toLowerCase();
    if (PARAMETROS_AJENOS.includes(c) || c.startsWith("utm_")) url.searchParams.delete(clave);
  }
  url.hash = "";
}

const ASIN = /\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?=[/?]|$)/i;

function enlaceAmazon(url: URL): string {
  const asin = url.pathname.match(ASIN)?.[1];
  if (asin) return `https://www.amazon.es/dp/${asin.toUpperCase()}?tag=${AFILIADO.amazonTag}`;
  limpiarParametros(url);
  url.searchParams.set("tag", AFILIADO.amazonTag);
  return url.toString();
}

function enlaceTienda(tienda: Tienda, url: URL): string {
  url.protocol = "https:";
  switch (tienda.id) {
    case "amazon":
      return enlaceAmazon(url);
    case "hansshow":
      limpiarParametros(url);
      url.searchParams.set("bg_ref", AFILIADO.hansshowRef);
      return url.toString();
    case "jowua":
      limpiarParametros(url);
      url.searchParams.set("ghref", AFILIADO.jowuaGhref);
      url.searchParams.set("discount", AFILIADO.jowuaDescuento);
      return url.toString();
    case "tesery": {
      limpiarParametros(url);
      // La versión española de la tienda: /es-es/products/<handle>
      url.pathname = url.pathname.replace(/^\/(?:[a-z]{2}-[a-z]{2}\/)?products\//i, "/es-es/products/");
      url.searchParams.set("ref", AFILIADO.teseryRef);
      url.searchParams.set("utm_medium", "affiliate");
      url.searchParams.set("utm_source", "goaffpro");
      return url.toString();
    }
    case "aliexpress": {
      // Ficha limpia: https://es.aliexpress.com/item/<id>.html, sin afiliados ajenos ni seguimiento.
      const id = url.pathname.match(/\/item\/(\d+)\.html/)?.[1];
      if (id) return `https://es.aliexpress.com/item/${id}.html`;
      limpiarParametros(url);
      for (const k of [...url.searchParams.keys()]) url.searchParams.delete(k);
      return url.toString();
    }
    case "temu":
      // El enlace corto de afiliado (temu.to/k/...) ya lleva el seguimiento de Vic: se usa sin tocarlo.
      return url.toString();
    case "evdance": {
      limpiarParametros(url);
      const destino = encodeURIComponent(url.toString());
      return `https://www.awin1.com/cread.php?awinmid=${AFILIADO.awinMid}&awinaffid=${AFILIADO.awinAffid}&ued=${destino}`;
    }
  }
}

/**
 * Convierte el enlace que pega un usuario en el enlace que se publica:
 * - tienda del programa de Vic → enlace con el afiliado de Vic (y sin afiliados ajenos);
 * - otra tienda → enlace limpio, sin afiliados ni seguimiento de terceros;
 * - acortador → hay que resolverlo en el servidor antes (no se publica tal cual).
 */
export function aplicarAfiliado(enlace: string): ResultadoEnlace {
  let url: URL;
  try {
    url = new URL(enlace.trim());
  } catch {
    return { estado: "invalido", motivo: "No es una URL válida" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return { estado: "invalido", motivo: "Solo se admiten enlaces web" };
  if (url.username || url.password) return { estado: "invalido", motivo: "La URL no puede llevar credenciales" };

  // Enlaces de Awin: se desenvuelve el destino real y se vuelve a procesar.
  if (hostLimpio(url) === "awin1.com") {
    const ued = url.searchParams.get("ued");
    return ued ? aplicarAfiliado(ued) : { estado: "invalido", motivo: "Enlace de Awin sin destino" };
  }
  if (esAcortador(url)) return { estado: "resolver", motivo: "acortador" };
  // Enlaces de afiliado de AliExpress (s.click / a.aliexpress): se siguen hasta la ficha para quitar el afiliado ajeno.
  if (/^(s\.click|a)\.aliexpress\.com$/.test(hostLimpio(url))) return { estado: "resolver", motivo: "acortador" };

  const tienda = tiendaDeUrl(url);
  if (tienda) return { estado: "ok", url: enlaceTienda(tienda, url), tienda: tienda.id };

  url.protocol = "https:";
  limpiarParametros(url);
  return { estado: "ok", url: url.toString(), tienda: null };
}

/** Aviso que la plataforma muestra en cada chollo (el usuario no lo puede quitar). */
export function avisoAfiliado(tienda: IdTienda | null): string | null {
  if (tienda === "amazon") return AVISO_AMAZON;
  if (tienda) return AVISO_GENERAL;
  return null;
}
