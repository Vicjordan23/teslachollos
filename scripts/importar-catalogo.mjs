// Importa el catálogo del agente de Telegram/Facebook como chollos oficiales de Chollesla.
// Uso: node scripts/importar-catalogo.mjs "G:/Mi unidad/Claude/agente Tesla Accesorios/proyecto"
// Requiere `npm run build -w packages/core` antes (usa las reglas de @chollesla/core).
// Reglas de Vic: sin precio no se publica; pausado no se publica; foto real obligatoria en cada tarjeta.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { aplicarAfiliado, categoriaDe, urlFoto } from "../packages/core/dist/index.js";

const origen = process.argv[2];
if (!origen) {
  console.error("Falta la carpeta del catálogo (la carpeta «proyecto» del agente).");
  process.exit(1);
}
const leer = (f) => JSON.parse(readFileSync(join(origen, f), "utf8"));

const precios = { ...leer("precios.json"), ...leer("precios_tesery.json"), ...leer("precios_temu.json") };
const imagenes = { ...leer("imagenes_ig.json"), ...leer("imagenes_tesery.json"), ...leer("imagenes_temu.json") };
const archivos = [
  ["productos.json", "amazon"],
  ["productos_jowua.json", "jowua"],
  ["productos_hansshow.json", "hansshow"],
  ["productos_tesery.json", "tesery"],
  ["productos_evdance.json", "evdance"],
  ["productos_temu.json", "temu"],
];

function slugify(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

const usados = new Set();
const chollos = [];
const descartes = { pausado: 0, sinPrecio: 0, sinFoto: 0, enlace: 0 };

for (const [archivo, tiendaPorDefecto] of archivos) {
  for (const p of leer(archivo)) {
    if (p.pausado) { descartes.pausado++; continue; }
    const precio = precios[p.asin];
    if (!precio) { descartes.sinPrecio++; continue; }
    const foto = urlFoto(imagenes[p.asin]);
    if (!foto) { descartes.sinFoto++; continue; }

    const tienda = p.tienda ?? tiendaPorDefecto;
    const enlace = tienda === "amazon" ? `https://www.amazon.es/dp/${p.asin}` : (p.url_larga ?? p.url);
    const comprobado = aplicarAfiliado(enlace);
    if (comprobado.estado !== "ok" || comprobado.tienda !== tienda) { descartes.enlace++; continue; }

    let slug = slugify(p.titulo) || slugify(p.asin);
    for (let n = 2; usados.has(slug); n++) slug = `${slugify(p.titulo)}-${n}`;
    usados.add(slug);

    chollos.push({
      id: p.asin,
      slug,
      tienda,
      categoria: categoriaDe(p.titulo, p.descripcion ?? ""),
      titulo: p.titulo,
      descripcion: p.descripcion ?? "",
      modelos: p.modelos ?? "",
      enlace,
      foto,
      precioTienda: precio.p,
      desde: precio.d === 1,
      fecha: precio.f,
    });
  }
}

const aqui = dirname(fileURLToPath(import.meta.url));
const destino = join(aqui, "..", "apps", "web", "src", "datos", "oficiales.json");
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(chollos, null, 1) + "\n");

const porTienda = chollos.reduce((a, c) => ((a[c.tienda] = (a[c.tienda] ?? 0) + 1), a), {});
console.log(`Importados ${chollos.length} chollos →`, destino);
console.log("Por tienda:", porTienda);
console.log("Descartados:", descartes);
const porCategoria = chollos.reduce((a, c) => ((a[c.categoria] = (a[c.categoria] ?? 0) + 1), a), {});
console.log("Por categoría:", porCategoria);
