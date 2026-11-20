import type { IdCategoria, IdTienda } from "@chollesla/core";
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

export const CHOLLOS: CholloOficial[] = intercalar(datos as unknown as CholloOficial[]);

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
