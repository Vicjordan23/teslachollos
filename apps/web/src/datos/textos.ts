import { crearContexto, datosDelTitulo, generarTextoFicha, jaccard, shingles, textoPlano, UMBRAL_DUPLICADO, validarTextoFicha, type TextoFicha } from "@chollesla/core";
import opiniones from "./opiniones.json";
import { CHOLLOS, MIN_DESCRIPCION, type CholloOficial } from "./chollos";

/**
 * Texto propio de cada ficha (función pura de @chollesla/core). Se genera aquí, en el build, a partir de los datos del
 * catálogo: no se guarda en oficiales.json, que el importador diario reescribe.
 * Las opiniones son los resúmenes reales de compradores de Amazon.es (datos/opiniones.json), solo para productos Amazon.
 */
const OPINIONES = opiniones as Record<string, string>;

let contexto: ReturnType<typeof crearContexto> | null = null;
const textos = new Map<string, TextoFicha>();

export function textoDe(c: CholloOficial): TextoFicha {
  contexto ??= crearContexto(CHOLLOS);
  let t = textos.get(c.slug);
  if (!t) {
    t = generarTextoFicha(c, contexto, { opinion: c.tienda === "amazon" ? OPINIONES[c.id] : undefined });
    textos.set(c.slug, t);
  }
  return t;
}

/**
 * Fichas con texto casi idéntico a otra de la misma categoría y tienda (Jaccard de shingles de 5 palabras >= 0,8).
 * De cada pareja se queda indexable la de slug menor; la otra va a noindex para no ofrecer contenido duplicado.
 */
const duplicadas: Set<string> = (() => {
  const grupos = new Map<string, { slug: string; sh: Set<number> }[]>();
  for (const c of CHOLLOS) {
    const k = `${c.categoria}|${c.tienda}`;
    const lista = grupos.get(k) ?? [];
    lista.push({ slug: c.slug, sh: shingles(textoPlano(textoDe(c))) });
    grupos.set(k, lista);
  }
  const fuera = new Set<string>();
  for (const lista of grupos.values()) {
    for (let i = 0; i < lista.length; i++)
      for (let j = i + 1; j < lista.length; j++)
        if (jaccard(lista[i]!.sh, lista[j]!.sh) >= UMBRAL_DUPLICADO) fuera.add(lista[i]!.slug > lista[j]!.slug ? lista[i]!.slug : lista[j]!.slug);
  }
  return fuera;
})();

/**
 * Oleada de indexación (progresiva). 1 = solo fichas con algún dato propio además del precio (descripción real, datos
 * citados en el título o opiniones de compradores). 2 = todas las que superan la puerta de calidad. Pasar a 2 cuando
 * Search Console confirme que Google indexa bien la oleada 1 (sin «Rastreada, actualmente sin indexar» en masa).
 */
export const OLEADA_INDEXACION: 1 | 2 = 1;

/** ¿Tiene la ficha algún dato propio verificable más allá del precio y la compatibilidad? */
export function tieneDatosPropios(c: CholloOficial): boolean {
  return c.descripcion.trim().length >= MIN_DESCRIPCION || datosDelTitulo(c.titulo).length > 0 || (c.tienda === "amazon" && Boolean(OPINIONES[c.id]));
}

/**
 * Puerta de calidad para indexar fichas (index, follow y sitemap). Una ficha pasa si su texto propio es válido (120-250
 * palabras, sin valores rotos ni HTML, FAQ completas), no es casi duplicado de otra, no está en «Otros» (categoría sin
 * consejo propio) salvo que tenga descripción real escrita, y entra en la oleada de indexación vigente. El resto sigue
 * accesible con `noindex, follow`.
 */
export function fichaIndexable(c: CholloOficial): boolean {
  if (duplicadas.has(c.slug)) return false;
  if (validarTextoFicha(textoDe(c)).length > 0) return false;
  if (c.categoria === "otros" && c.descripcion.trim().length < MIN_DESCRIPCION) return false;
  return OLEADA_INDEXACION >= 2 || tieneDatosPropios(c);
}

/** Cuántas fichas pasan la puerta (para informes). */
export const totalIndexables = () => CHOLLOS.filter(fichaIndexable).length;
