import { CATEGORIAS, MODELOS, VERSIONES, type IdCategoria, type IdModelo, type IdVersion } from "@chollesla/core";
import { ORDENES, type IdOrden } from "@/datos/chollos";

export interface Filtro {
  q?: string;
  modelo?: IdModelo;
  /** Versión del Model 3 o del Model Y (Highland, Juniper…). Solo tiene sentido con su modelo. */
  version?: IdVersion;
  categoria?: IdCategoria;
  orden?: IdOrden;
}

/** URL de un filtro: las combinaciones simples van a páginas estáticas (SEO); el resto, a /buscar. */
export function urlFiltro(f: Filtro, pagina = 1): string {
  const orden = f.orden && f.orden !== "destacados" ? f.orden : undefined;
  if (!f.q && !orden && !f.version && pagina === 1) {
    if (!f.modelo && !f.categoria) return "/";
    if (f.modelo && !f.categoria) return `/modelo/${f.modelo}`;
    if (f.categoria && !f.modelo) return `/categoria/${f.categoria}`;
  }
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.modelo) p.set("modelo", f.modelo);
  if (f.version) p.set("version", f.version);
  if (f.categoria) p.set("categoria", f.categoria);
  if (orden) p.set("orden", orden);
  if (pagina > 1) p.set("p", String(pagina));
  const qs = p.toString();
  return qs ? `/buscar?${qs}` : "/buscar";
}

function uno(v: string | string[] | undefined): string {
  return ((Array.isArray(v) ? v[0] : v) ?? "").trim();
}

/** Lee y valida los parámetros de /buscar (lo desconocido se ignora). */
export function leerFiltro(sp: Record<string, string | string[] | undefined>): Filtro & { p: number } {
  const modelo = uno(sp.modelo);
  const version = uno(sp.version);
  const categoria = uno(sp.categoria);
  const orden = uno(sp.orden);
  return {
    q: uno(sp.q).slice(0, 80) || undefined,
    modelo: MODELOS.some((m) => m.id === modelo) ? (modelo as IdModelo) : undefined,
    // La versión solo vale si es del modelo elegido.
    version: VERSIONES.some((v) => v.id === version && v.modelo === modelo) ? (version as IdVersion) : undefined,
    categoria: CATEGORIAS.some((c) => c.id === categoria) ? (categoria as IdCategoria) : undefined,
    orden: ORDENES.some((o) => o.id === orden) ? (orden as IdOrden) : undefined,
    p: Math.max(1, Number.parseInt(uno(sp.p), 10) || 1),
  };
}
