import { CATEGORIAS, MODELOS, VERSIONES, type IdCategoria, type IdModelo, type IdVersion } from "@chollesla/core";
import { ORDENES, type IdOrden } from "@/datos/chollos";

export interface Filtro {
  q?: string;
  modelo?: IdModelo;
  /** Versión del Model 3 o del Model Y (Highland, Juniper…). Solo tiene sentido con su modelo. */
  version?: IdVersion;
  categoria?: IdCategoria;
  orden?: IdOrden;
  /** Precio final máximo en euros (10, 20 o 50). */
  max?: number;
  /** Descuento mínimo en % (30). */
  dto?: number;
  /** «amazon», «aliexpress» u «oficiales» (el resto de tiendas con código). */
  tienda?: TiendaFiltro;
}

export const PRECIOS_MAX = [10, 20, 50] as const;
export const DESCUENTOS_MIN = [30] as const;
export const TIENDAS_FILTRO = [
  { id: "amazon", nombre: "Amazon" },
  { id: "aliexpress", nombre: "AliExpress" },
  { id: "temu", nombre: "Temu" },
  { id: "oficiales", nombre: "Tiendas oficiales" },
] as const;
export type TiendaFiltro = (typeof TIENDAS_FILTRO)[number]["id"];

/** URL de un filtro: las combinaciones simples van a páginas estáticas (SEO); el resto, a /buscar. */
export function urlFiltro(f: Filtro, pagina = 1): string {
  const orden = f.orden && f.orden !== "destacados" ? f.orden : undefined;
  const extra = f.max || f.dto || f.tienda;
  if (!f.q && !orden && !f.version && !extra && pagina === 1) {
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
  if (f.max) p.set("max", String(f.max));
  if (f.dto) p.set("dto", String(f.dto));
  if (f.tienda) p.set("tienda", f.tienda);
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
  const max = Number.parseInt(uno(sp.max), 10);
  const dto = Number.parseInt(uno(sp.dto), 10);
  const tienda = uno(sp.tienda);
  return {
    max: (PRECIOS_MAX as readonly number[]).includes(max) ? max : undefined,
    dto: (DESCUENTOS_MIN as readonly number[]).includes(dto) ? dto : undefined,
    tienda: TIENDAS_FILTRO.some((t) => t.id === tienda) ? (tienda as TiendaFiltro) : undefined,
    q: uno(sp.q).slice(0, 80) || undefined,
    modelo: MODELOS.some((m) => m.id === modelo) ? (modelo as IdModelo) : undefined,
    // La versión solo vale si es del modelo elegido.
    version: VERSIONES.some((v) => v.id === version && v.modelo === modelo) ? (version as IdVersion) : undefined,
    categoria: CATEGORIAS.some((c) => c.id === categoria) ? (categoria as IdCategoria) : undefined,
    orden: ORDENES.some((o) => o.id === orden) ? (orden as IdOrden) : undefined,
    p: Math.max(1, Number.parseInt(uno(sp.p), 10) || 1),
  };
}
