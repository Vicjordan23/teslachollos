// Informe de calidad y unicidad del texto propio de las fichas (docs/SEO_CHOLLESLA.md, sección 9).
// Uso: npm run build -w packages/core && node scripts/informe-unicidad.mjs [--muestra=slug1,slug2] [--json]
// Mide, con los datos reales de apps/web/src/datos, la validez del texto y la similitud (Jaccard de shingles de 5 palabras)
// entre fichas de la misma categoría y tienda. No forma parte de `npm test` (depende del catálogo, que cambia a diario).
import { readFileSync } from "node:fs";
import { crearContexto, datosDelTitulo, generarTextoFicha, validarTextoFicha, shingles, jaccard, textoPlano, UMBRAL_DUPLICADO } from "../packages/core/dist/index.js";

const leer = (f) => JSON.parse(readFileSync(new URL(`../apps/web/src/datos/${f}`, import.meta.url), "utf8"));
const todos = [...leer("oficiales.json"), ...leer("aliexpress.json")];
const opiniones = leer("opiniones.json");
const ultima = todos.reduce((m, c) => (c.fecha > m ? c.fecha : m), "");
const limite = new Date(Date.parse(ultima) - 10 * 86_400_000).toISOString().slice(0, 10);
const chollos = todos.filter((c) => c.fecha >= limite);

const ctx = crearContexto(chollos);
const textos = chollos.map((c) => ({ c, t: generarTextoFicha(c, ctx, { opinion: c.tienda === "amazon" ? opiniones[c.id] : undefined }) }));
const problemas = {};
for (const x of textos) for (const p of validarTextoFicha(x.t)) problemas[p.replace(/\(\d+\)/, "")] = (problemas[p.replace(/\(\d+\)/, "")] ?? 0) + 1;
const palabras = textos.map((x) => x.t.palabras).sort((a, b) => a - b);
const pct = (a, p) => a[Math.min(a.length - 1, Math.floor((a.length * p) / 100))];

const grupos = new Map();
for (const x of textos) {
  x.sh = shingles(textoPlano(x.t));
  const k = `${x.c.categoria}|${x.c.tienda}`;
  grupos.set(k, [...(grupos.get(k) ?? []), x]);
}
let pares = 0, bajo05 = 0, alto08 = 0, suma = 0, max = 0;
const sims = [];
const duplicados = [];
for (const lista of grupos.values()) {
  for (let i = 0; i < lista.length; i++)
    for (let j = i + 1; j < lista.length; j++) {
      const s = jaccard(lista[i].sh, lista[j].sh);
      pares++; suma += s; sims.push(s);
      if (s < 0.5) bajo05++;
      if (s >= UMBRAL_DUPLICADO) { alto08++; duplicados.push([lista[i].c.slug, lista[j].c.slug, s.toFixed(2)]); }
      if (s > max) max = s;
    }
}
sims.sort((a, b) => a - b);
const salida = {
  fichas: chollos.length,
  validas: textos.filter((x) => validarTextoFicha(x.t).length === 0).length,
  problemas,
  palabras: { min: palabras[0], p50: pct(palabras, 50), p95: pct(palabras, 95), max: palabras[palabras.length - 1] },
  pares: { total: pares, media: +(suma / pares).toFixed(3), mediana: +pct(sims, 50).toFixed(3), p95: +pct(sims, 95).toFixed(3), max: +max.toFixed(3), porDebajoDe05: +((100 * bajo05) / pares).toFixed(1), conSim08omas: alto08 },
  duplicados: duplicados.slice(0, 25),
};
// Puerta de indexación (misma regla que apps/web/src/datos/textos.ts): válida, no casi duplicada y no «otros» sin descripción real.
const fuera = new Set(duplicados.map(([a, b]) => (a > b ? a : b)));
const propios = (c) => c.descripcion.trim().length >= 60 || datosDelTitulo(c.titulo).length > 0 || (c.tienda === "amazon" && Boolean(opiniones[c.id]));
const oleada = Number(process.argv.find((a) => a.startsWith("--oleada="))?.slice(9) ?? 1);
const indexables = textos.filter((x) => (oleada >= 2 || propios(x.c)) && !fuera.has(x.c.slug) && validarTextoFicha(x.t).length === 0 && (x.c.categoria !== "otros" || x.c.descripcion.trim().length >= 60));
const medir = (lista, clave) => {
  const g = new Map();
  for (const x of lista) g.set(clave(x), [...(g.get(clave(x)) ?? []), x]);
  const v = [];
  for (const l of g.values()) for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) v.push(jaccard(l[i].sh, l[j].sh));
  v.sort((a, b) => a - b);
  return { pares: v.length, media: +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(3), p95: +pct(v, 95).toFixed(3), max: +v[v.length - 1].toFixed(3), porDebajoDe05: +((100 * v.filter((y) => y < 0.5).length) / v.length).toFixed(1), conSim08omas: v.filter((y) => y >= 0.8).length };
};
salida.indexables = {
  total: indexables.length,
  porTienda: Object.fromEntries([...new Set(indexables.map((x) => x.c.tienda))].map((t) => [t, indexables.filter((x) => x.c.tienda === t).length])),
  mismaCategoriaYTienda: medir(indexables, (x) => x.c.categoria + "|" + x.c.tienda),
  mismaCategoria: medir(indexables, (x) => x.c.categoria),
  mismaTienda: medir(indexables, (x) => x.c.tienda),
};
console.log(JSON.stringify(salida, null, 2));

const muestra = (process.argv.find((a) => a.startsWith("--muestra=")) ?? "").slice(10).split(",").filter(Boolean);
for (const slug of muestra) {
  const x = textos.find((y) => y.c.slug === slug);
  if (!x) { console.log(`\n(no existe ${slug})`); continue; }
  console.log(`\n==== ${x.c.tienda} / ${x.c.categoria} / ${x.c.slug} (${x.t.palabras} palabras)\nTÍTULO: ${x.c.titulo}\nMODELOS: ${x.c.modelos}  PRECIO TIENDA: ${x.c.precioTienda}  desde=${x.c.desde}  fecha=${x.c.fecha}`);
  for (const s of x.t.secciones) { console.log(`\n## ${s.titulo}`); for (const p of s.parrafos) console.log(p); for (const p of s.puntos) console.log("- " + p); }
  console.log("\n## FAQ"); for (const f of x.t.faq) console.log(`P: ${f.pregunta}\nR: ${f.respuesta}`);
}
if (process.argv.includes("--lista")) for (const x of textos) console.log(x.c.tienda, x.c.categoria, x.c.slug);
