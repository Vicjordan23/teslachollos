/** Tiendas con programa de afiliados de Vic. Cada una con SU enlace: nunca se mezclan. */
export type IdTienda = "amazon" | "jowua" | "hansshow" | "tesery" | "evdance";

export interface Tienda {
  id: IdTienda;
  nombre: string;
  /** Dominios propios de la tienda (sin «www.»); se aceptan subdominios. */
  dominios: string[];
  /** Descuento del código de Vic (0,05 = 5 %). */
  descuento: number;
  /** Código de descuento que se muestra al usuario, si lo hay. */
  codigo: string | null;
}

export const TIENDAS: Record<IdTienda, Tienda> = {
  amazon: { id: "amazon", nombre: "Amazon.es", dominios: ["amazon.es"], descuento: 0, codigo: null },
  jowua: { id: "jowua", nombre: "Jowua", dominios: ["jowua-life.com"], descuento: 0.05, codigo: "ACCESORIOSTESLA" },
  hansshow: { id: "hansshow", nombre: "Hansshow", dominios: ["hansshow.com"], descuento: 0.2, codigo: "VICTOR" },
  tesery: { id: "tesery", nombre: "Tesery", dominios: ["tesery.com"], descuento: 0.05, codigo: "ACCESORIOSTESLA" },
  evdance: { id: "evdance", nombre: "EVDANCE", dominios: ["evdances.com"], descuento: 0.2, codigo: "EVEU20" },
};

/** Acortadores que hay que resolver en el servidor antes de saber la tienda real. */
export const ACORTADORES = ["amzn.eu", "amzn.to", "a.co", "is.gd", "bit.ly", "tinyurl.com", "t.co"];

export function hostLimpio(url: URL): string {
  return url.hostname.toLowerCase().replace(/^www\./, "");
}

function coincideDominio(host: string, dominio: string): boolean {
  return host === dominio || host.endsWith(`.${dominio}`);
}

/** Tienda del programa de Vic a la que pertenece la URL, o null. */
export function tiendaDeUrl(url: URL): Tienda | null {
  const host = hostLimpio(url);
  return Object.values(TIENDAS).find((t) => t.dominios.some((d) => coincideDominio(host, d))) ?? null;
}

export function esAcortador(url: URL): boolean {
  const host = hostLimpio(url);
  return ACORTADORES.some((d) => coincideDominio(host, d));
}
