import { modelosDe, TIENDAS, type IdCategoria, type IdTienda } from "@chollesla/core";
import { CHOLLOS, ULTIMA_REVISION, type CholloOficial } from "./chollos";
import registro from "./registro.json";
import config from "./retirados-config.json";

/** Producto que estuvo en la web y ya no está en el catálogo. */
export interface Retirado {
  slug: string;
  tienda: IdTienda;
  categoria: IdCategoria;
  titulo: string;
  modelos: string;
  foto: string;
  /** Último precio conocido en céntimos: solo para ordenar alternativas, no se muestra. */
  precio: number;
  /** Última fecha en la que tuvo precio. */
  visto: string;
  /** Tiene visitas en Google (lista `conservar`): se mantiene indexada sin límite de tiempo. */
  conservar: boolean;
}

/** Días que se mantiene la página de un retirado sin visitas antes de dar 404. */
export const DIAS_RETIRADO = 60;

const conservar = new Set<string>(config.conservar);
const eliminados = new Set<string>(config.eliminados);
const vivos = new Set(CHOLLOS.map((c) => c.slug));
const limite = ULTIMA_REVISION ? new Date(Date.parse(ULTIMA_REVISION) - DIAS_RETIRADO * 86_400_000).toISOString().slice(0, 10) : "";

export const RETIRADOS: Retirado[] = Object.entries(registro as Record<string, { s: string; t: string; c: string; m: string; f: string; p: number; v: string }>)
  .map(([clave, e]) => ({
    slug: e.s,
    tienda: clave.slice(0, clave.indexOf(":")) as IdTienda,
    categoria: e.c as IdCategoria,
    titulo: e.t,
    modelos: e.m,
    foto: e.f,
    precio: e.p,
    visto: e.v,
    conservar: conservar.has(e.s),
  }))
  .filter((r) => r.tienda in TIENDAS && !vivos.has(r.slug) && !eliminados.has(r.slug) && (r.conservar || r.visto >= limite));

const PORSLUG = new Map(RETIRADOS.map((r) => [r.slug, r]));
export const retiradoPorSlug = (slug: string) => PORSLUG.get(slug);

const palabras = (t: string) => new Set(t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9]{4,}/g) ?? []);

/** Productos disponibles más parecidos: misma categoría, compatibles, palabras del título en común y precio cercano. */
export function alternativas(r: Retirado, cuantas = 8): CholloOficial[] {
  const suyas = palabras(r.titulo);
  suyas.delete("tesla");
  suyas.delete("model");
  const modelos = modelosDe(r.modelos);
  return CHOLLOS.filter((c) => c.categoria === r.categoria)
    .filter((c) => {
      const m = modelosDe(c.modelos);
      return modelos.length === 0 || m.length === 0 || m.some((x) => modelos.includes(x));
    })
    .map((c) => {
      const comunes = [...palabras(c.titulo)].filter((p) => suyas.has(p)).length;
      return { c, puntos: comunes * 10 - Math.abs(c.precioTienda - r.precio) / Math.max(r.precio, 1) };
    })
    .sort((a, b) => b.puntos - a.puntos || a.c.slug.localeCompare(b.c.slug))
    .slice(0, cuantas)
    .map((x) => x.c);
}
