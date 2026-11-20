// Traduce al español los títulos y descripciones de los chollos que estén en otro idioma (inglés, holandés...).
// Usa el traductor gratuito de Google (sin clave). Guarda lo ya traducido en scripts/traducciones.json para no repetir.
// Si el traductor falla, deja el texto original (nunca rompe nada). Uso: node scripts/traducir-titulos.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ARCHIVOS = ["apps/web/src/datos/aliexpress.json", "apps/web/src/datos/oficiales.json"];
const CACHE = "scripts/traducciones.json";
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};

async function traducir(texto) {
  if (cache[texto] !== undefined) return cache[texto];
  if (!texto || texto.trim().length < 4) return texto;
  try {
    const r = await fetch(
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=" + encodeURIComponent(texto),
      { signal: AbortSignal.timeout(15000) },
    );
    if (!r.ok) return texto;
    const d = await r.json();
    const idioma = d[2];
    const t = d[0].map((x) => x?.[0] ?? "").join("").trim();
    cache[texto] = idioma !== "es" && t ? t : texto;
    return cache[texto];
  } catch {
    return texto;
  }
}

async function enLotes(lista, n, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < lista.length) await fn(lista[i++]);
    }),
  );
}

let cambios = 0;
for (const archivo of ARCHIVOS) {
  const datos = JSON.parse(readFileSync(archivo, "utf8"));
  const textos = [...new Set(datos.flatMap((c) => [c.titulo, c.descripcion]).filter(Boolean))];
  await enLotes(textos, 8, traducir);
  for (const c of datos) {
    for (const campo of ["titulo", "descripcion"]) {
      let nuevo = c[campo] ? cache[c[campo]] ?? c[campo] : c[campo];
      // La base de datos limita el título a 200 caracteres: si la traducción se pasa, se recorta en una palabra.
      if (campo === "titulo" && nuevo.length > 200) nuevo = nuevo.slice(0, 197).replace(/\s+\S*$/, "") + "…";
      if (nuevo !== c[campo]) {
        c[campo] = nuevo;
        cambios++;
      }
    }
  }
  writeFileSync(archivo, JSON.stringify(datos, null, 1) + "\n");
  writeFileSync(CACHE, JSON.stringify(cache));
  console.log(`${archivo}: ${datos.length} chollos`);
}
console.log(`Textos traducidos: ${cambios}`);
