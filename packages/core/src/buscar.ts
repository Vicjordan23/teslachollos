/** Buscador de chollos por texto: sin acentos, por prefijo de palabra y con los modelos de Tesla normalizados. */

export interface Buscable {
  titulo: string;
  descripcion?: string;
  modelos?: string;
}

const VACIAS = new Set(["de", "del", "la", "el", "los", "las", "para", "con", "y", "en", "un", "una", "por", "tesla", "the", "for", "and", "of"]);

/** «Model 3/Y», «MY», «modelo y» → «model3 modely». */
function modelos(texto: string): string {
  return texto
    .replace(/\bmodel[o]?\s*([3syx])((?:\s*[\/,y]\s*[3syx]\b)*)/g, (_, primero: string, resto: string) => {
      const otros = resto.match(/[3syx]\b/g) ?? [];
      return [primero, ...otros].map((m) => ` model${m} `).join("");
    })
    .replace(/\bm([3syx])\b/g, " model$1 ");
}

/** Pasa a minúsculas, quita acentos y signos, y normaliza los modelos. */
export function normalizar(texto: string): string {
  const base = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\/,]+/g, " ");
  return modelos(base).replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Raíz sencilla: «alfombrillas» → «alfombrill», «luces» → «luz», «ambiente» → «ambient» (encuentra «ambiental»),
 * «carbono» → «carbon» (encuentra también el inglés).
 */
function raiz(palabra: string): string {
  if (/^model[3syx]$/.test(palabra)) return palabra;
  let r = palabra;
  if (r.length > 4 && r.endsWith("ces")) r = `${r.slice(0, -3)}z`;
  else if (r.length > 5 && r.endsWith("es")) r = r.slice(0, -2);
  else if (r.length > 4 && r.endsWith("s")) r = r.slice(0, -1);
  if (r.length > 6 && /[aeo]$/.test(r)) r = r.slice(0, -1);
  return r;
}

/** Palabras de la búsqueda; quita las vacías salvo que no quede ninguna. */
export function terminos(consulta: string): string[] {
  const todas = [...new Set(normalizar(consulta).split(" ").filter(Boolean))];
  const utiles = todas.filter((t) => !VACIAS.has(t));
  return (utiles.length > 0 ? utiles : todas).slice(0, 8).map(raiz);
}

function contiene(palabras: string[], termino: string): boolean {
  return palabras.some((p) => p.startsWith(termino));
}

/**
 * Devuelve los elementos que contienen todas las palabras (por prefijo), ordenados por relevancia:
 * título (3), modelos (2), descripción (1). A igual relevancia se mantiene el orden de entrada.
 */
export function buscar<T extends Buscable>(lista: readonly T[], consulta: string): T[] {
  const ts = terminos(consulta);
  if (ts.length === 0) return [];
  const resultados: { item: T; puntos: number; i: number }[] = [];
  lista.forEach((item, i) => {
    const titulo = normalizar(item.titulo).split(" ");
    const mods = normalizar(item.modelos ?? "").split(" ");
    const desc = normalizar(item.descripcion ?? "").split(" ");
    let puntos = 0;
    for (const t of ts) {
      const p = contiene(titulo, t) ? 3 : contiene(mods, t) ? 2 : contiene(desc, t) ? 1 : 0;
      if (p === 0) return;
      puntos += p;
    }
    resultados.push({ item, puntos, i });
  });
  return resultados.sort((a, b) => b.puntos - a.puntos || a.i - b.i).map((r) => r.item);
}
