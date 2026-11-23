import { modelosDe, versionesDe, precioFinal, porcentajeAhorro, type IdCategoria, type IdModelo, type IdTienda, type IdVersion } from "@chollesla/core";
import aliexpress from "./aliexpress.json";
import datos from "./oficiales.json";

/** Chollo oficial importado del catálogo de Vic (scripts/importar-catalogo.mjs). */
export interface CholloOficial {
  id: string;
  slug: string;
  tienda: IdTienda;
  categoria: IdCategoria;
  titulo: string;
  descripcion: string;
  modelos: string;
  enlace: string;
  foto: string;
  /** Precio en tienda en céntimos, antes del código de descuento. */
  precioTienda: number;
  /** El precio es «desde» (varía según la variante). */
  desde: boolean;
  /** Fecha del precio, ISO (aaaa-mm-dd). */
  fecha: string;
  /** Enlace de afiliado ya generado por la tienda (AliExpress: lo crea su API con el tracking ID de Vic). */
  enlaceAfiliado?: string;
}

export const POR_PAGINA = 24;

// Barajado estable (misma semilla que el agente de Telegram) para que el orden no cambie entre builds.
function aleatorio(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function barajar<T>(lista: T[], semilla: number): T[] {
  const r = aleatorio(semilla);
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

/** Mezcla las tiendas en proporción a su tamaño, para que ninguna acapare la portada. */
function intercalar(lista: CholloOficial[]): CholloOficial[] {
  const grupos = new Map<IdTienda, CholloOficial[]>();
  for (const c of lista) grupos.set(c.tienda, [...(grupos.get(c.tienda) ?? []), c]);
  const colas = [...grupos.values()].map((g) => ({ cola: barajar(g, 2026), total: g.length, usados: 0 }));
  const salida: CholloOficial[] = [];
  while (salida.length < lista.length) {
    const siguiente = colas
      .filter((c) => c.usados < c.total)
      .sort((a, b) => a.usados / a.total - b.usados / b.total || b.total - a.total)[0]!;
    salida.push(siguiente.cola[siguiente.usados++]!);
  }
  return salida;
}

const TODOS: CholloOficial[] = [...(datos as unknown as CholloOficial[]), ...(aliexpress as unknown as CholloOficial[])];

/** Fecha de la revisión de precios más reciente del catálogo (aaaa-mm-dd). */
export const ULTIMA_REVISION = TODOS.reduce((max, c) => (c.fecha > max ? c.fecha : max), "");

/** Un producto que lleva más de 10 días sin precio nuevo (agotado o retirado) deja de mostrarse. Se mide contra la última revisión del catálogo, así que si la actualización se parase no se vaciaría la web. */
const DIAS_CADUCIDAD = 10;
const LIMITE = ULTIMA_REVISION ? new Date(Date.parse(ULTIMA_REVISION) - DIAS_CADUCIDAD * 86_400_000).toISOString().slice(0, 10) : "";

export const CHOLLOS: CholloOficial[] = intercalar(TODOS.filter((c) => c.fecha >= LIMITE));

const PORSLUG = new Map(CHOLLOS.map((c) => [c.slug, c]));

export function cholloPorSlug(slug: string): CholloOficial | undefined {
  return PORSLUG.get(slug);
}

export function chollosDeTienda(tienda: IdTienda): CholloOficial[] {
  return CHOLLOS.filter((c) => c.tienda === tienda);
}

export function chollosDeCategoria(categoria: IdCategoria): CholloOficial[] {
  return CHOLLOS.filter((c) => c.categoria === categoria);
}

const MODELOS_DE = new Map(CHOLLOS.map((c) => [c.slug, modelosDe(c.modelos)]));

/** Chollos compatibles con un modelo (incluye los universales, como los cables Tipo 2). */
export function chollosDeModelo(modelo: IdModelo, lista: CholloOficial[] = CHOLLOS): CholloOficial[] {
  return lista.filter((c) => MODELOS_DE.get(c.slug)?.includes(modelo));
}

const VERSIONES_DE = new Map(CHOLLOS.map((c) => [c.slug, versionesDe(c.modelos)]));

/** Chollos compatibles con una versión concreta (Model 3 Highland, Model Y Juniper…). */
export function chollosDeVersion(version: IdVersion, lista: CholloOficial[] = CHOLLOS): CholloOficial[] {
  return lista.filter((c) => VERSIONES_DE.get(c.slug)?.includes(version));
}

export const ORDENES = [
  { id: "destacados", nombre: "Destacados" },
  { id: "descuento", nombre: "Más descuento" },
  { id: "barato", nombre: "Más baratos" },
  { id: "caro", nombre: "Más caros" },
  { id: "recientes", nombre: "Precio más reciente" },
] as const;
export type IdOrden = (typeof ORDENES)[number]["id"];

export const finalDe = (c: CholloOficial) => precioFinal(c.precioTienda, c.tienda);
export const ahorroDe = (c: CholloOficial) => porcentajeAhorro(finalDe(c), c.precioTienda);

/** Ordena sin mutar; «destacados» es el orden mezclado de la portada. Empates: orden de la portada. */
export function ordenar(lista: CholloOficial[], orden: IdOrden): CholloOficial[] {
  const copia = [...lista];
  if (orden === "descuento") return copia.sort((a, b) => ahorroDe(b) - ahorroDe(a));
  if (orden === "barato") return copia.sort((a, b) => finalDe(a) - finalDe(b));
  if (orden === "caro") return copia.sort((a, b) => finalDe(b) - finalDe(a));
  if (orden === "recientes") return copia.sort((a, b) => b.fecha.localeCompare(a.fecha));
  return copia;
}

export function totalPaginas(lista: unknown[]): number {
  return Math.max(1, Math.ceil(lista.length / POR_PAGINA));
}

export function pagina<T>(lista: T[], n: number): T[] {
  return lista.slice((n - 1) * POR_PAGINA, n * POR_PAGINA);
}

/** «2026-11-16» → «16/11/2026». */
export function formatoFecha(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/** Precio máximo (€ finales), descuento mínimo (%) y tienda. Lo que no viene informado no filtra. */
export function filtrarExtra(lista: CholloOficial[], f: { max?: number; dto?: number; tienda?: "amazon" | "aliexpress" | "oficiales" }): CholloOficial[] {
  return lista.filter((c) => {
    if (f.max && finalDe(c) > f.max * 100) return false;
    if (f.dto && ahorroDe(c) < f.dto) return false;
    if (f.tienda === "oficiales") return c.tienda !== "amazon" && c.tienda !== "aliexpress";
    if (f.tienda) return c.tienda === f.tienda;
    return true;
  });
}

/** Descripción real mínima (caracteres) para considerar que una ficha trae descripción propia de la tienda. La puerta de indexación está en datos/textos.ts. */
export const MIN_DESCRIPCION = 60;

/** Chollos de una versión y una categoría (para las páginas «alfombrillas para Model Y Juniper»). */
export function chollosDeVersionCategoria(version: IdVersion, categoria: IdCategoria): CholloOficial[] {
  return chollosDeVersion(version).filter((c) => c.categoria === categoria);
}

/** Resumen real de una lista: cuántos hay, precio final mínimo y máximo y tiendas distintas. */
export function resumen(lista: CholloOficial[]) {
  const precios = lista.map(finalDe).sort((a, b) => a - b);
  return {
    total: lista.length,
    minimo: precios[0] ?? 0,
    maximo: precios[precios.length - 1] ?? 0,
    tiendas: [...new Set(lista.map((c) => c.tienda))],
  };
}

/** Los `n` primeros según el orden de la portada, con las tiendas mezcladas. */
export const primeros = (lista: CholloOficial[], n: number) => lista.slice(0, n);
