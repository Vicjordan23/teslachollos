// Importa accesorios para Tesla de AliExpress con su API de afiliados (AliExpress Portals) y genera
// apps/web/src/datos/aliexpress.json. Lo ejecuta la acción «Importar AliExpress» con los secretos del repo:
// ALIEXPRESS_APP_KEY, ALIEXPRESS_APP_SECRET y ALIEXPRESS_TRACKING_ID. Requiere `npm run build -w packages/core`.
// Reglas: foto real de AliExpress, precio de la API (EUR, envío a España), enlace de afiliado generado por la API
// con el tracking ID de Vic. No se muestra el «precio original» de AliExpress (suele estar inflado).
import { createHmac } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { aplicarAfiliado, categoriaDe, urlFoto } from "../packages/core/dist/index.js";

const APP_KEY = process.env.ALIEXPRESS_APP_KEY;
const SECRETO = process.env.ALIEXPRESS_APP_SECRET;
const TRACKING = process.env.ALIEXPRESS_TRACKING_ID;
if (!APP_KEY || !SECRETO || !TRACKING) {
  console.error("Faltan ALIEXPRESS_APP_KEY, ALIEXPRESS_APP_SECRET o ALIEXPRESS_TRACKING_ID.");
  process.exit(1);
}
const MAXIMO = Number(process.env.ALIEXPRESS_MAXIMO ?? 300);
const BUSQUEDAS = [
  "tesla model y accessories", "tesla model 3 accessories", "tesla model y juniper", "tesla model 3 highland",
  "tesla floor mats", "tesla screen protector", "tesla center console organizer", "tesla wireless charger",
  "tesla ambient light", "tesla steering wheel", "tesla seat cover", "tesla trunk", "tesla sunshade",
  "tesla mud flaps", "tesla key card holder", "tesla wheel cover", "tesla charging cable type 2", "tesla cybertruck accessories",
  "tesla model s accessories", "tesla model x accessories",
];

/** Firma de la API de AliExpress (IOP): HMAC-SHA256 de clave+valor ordenados, en hexadecimal mayúsculas. */
export function firmar(params, secreto) {
  const base = Object.keys(params).sort().map((k) => `${k}${params[k]}`).join("");
  return createHmac("sha256", secreto).update(base, "utf8").digest("hex").toUpperCase();
}

async function llamar(metodo, negocio) {
  const params = { app_key: APP_KEY, method: metodo, sign_method: "sha256", timestamp: String(Date.now()), ...negocio };
  params.sign = firmar(params, SECRETO);
  const r = await fetch(process.env.ALIEXPRESS_API ?? "https://api-sg.aliexpress.com/sync", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(params),
  });
  const j = await r.json();
  if (j.error_response) throw new Error(`${metodo}: ${j.error_response.code} ${j.error_response.msg}`);
  return j;
}

const centimos = (v) => Math.round(Number(String(v ?? "").replace(",", ".")) * 100);
const esTesla = (t) => /\btesla\b|\bmodel\s?[3syx]\b|cybertruck|juniper|highland/i.test(t);

function modelosDeTitulo(t) {
  const m = [];
  if (/model\s?3|highland/i.test(t)) m.push(/highland|2024|2025|2026/i.test(t) ? "Model 3 Highland" : "Model 3");
  if (/model\s?y|juniper/i.test(t)) m.push(/juniper|2025|2026/i.test(t) ? "Model Y Juniper" : "Model Y");
  if (/model\s?s\b/i.test(t)) m.push("Model S");
  if (/model\s?x\b/i.test(t)) m.push("Model X");
  if (/cybertruck/i.test(t)) m.push("Cybertruck");
  return m.length ? m.join(" y ") : "Tesla (comprueba el modelo en la ficha)";
}

function slugify(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "");
}

const productos = new Map();
for (const keywords of BUSQUEDAS) {
  for (let pagina = 1; pagina <= 2; pagina++) {
    let j;
    try {
      j = await llamar("aliexpress.affiliate.product.query", {
        keywords, page_no: String(pagina), page_size: "50", sort: "LAST_VOLUME_DESC",
        target_currency: "EUR", target_language: "ES", ship_to_country: "ES", tracking_id: TRACKING,
        fields: "product_id,product_title,product_main_image_url,target_sale_price,promotion_link,product_detail_url,lastest_volume,evaluate_rate",
      });
    } catch (e) {
      console.error(`«${keywords}» p${pagina}: ${e.message}`);
      break;
    }
    const resp = j.aliexpress_affiliate_product_query_response?.resp_result;
    const lista = resp?.result?.products?.product ?? [];
    for (const p of lista) {
      const id = String(p.product_id);
      if (productos.has(id) || !esTesla(p.product_title ?? "")) continue;
      productos.set(id, p);
    }
    if (lista.length < 50) break;
  }
}

const oficiales = JSON.parse(readFileSync(new URL("../apps/web/src/datos/oficiales.json", import.meta.url), "utf8"));
const usados = new Set(oficiales.map((c) => c.slug));
const hoy = new Date().toISOString().slice(0, 10);
const descartes = { foto: 0, precio: 0, enlace: 0 };
const salida = [];
for (const p of [...productos.values()].sort((a, b) => (b.lastest_volume ?? 0) - (a.lastest_volume ?? 0))) {
  if (salida.length >= MAXIMO) break;
  const foto = urlFoto(p.product_main_image_url);
  if (!foto) { descartes.foto++; continue; }
  const precio = centimos(p.target_sale_price);
  if (!(precio > 0)) { descartes.precio++; continue; }
  const ficha = aplicarAfiliado(p.product_detail_url ?? `https://es.aliexpress.com/item/${p.product_id}.html`);
  const afiliado = String(p.promotion_link ?? "");
  if (ficha.estado !== "ok" || ficha.tienda !== "aliexpress" || !/^https:\/\/s\.click\.aliexpress\.com\//.test(afiliado)) { descartes.enlace++; continue; }
  const titulo = String(p.product_title).replace(/\s+/g, " ").trim().slice(0, 200);
  let slug = `${slugify(titulo) || "aliexpress"}-${String(p.product_id).slice(-6)}`;
  for (let n = 2; usados.has(slug); n++) slug = `${slug}-${n}`;
  usados.add(slug);
  salida.push({
    id: String(p.product_id),
    slug,
    tienda: "aliexpress",
    categoria: categoriaDe(titulo),
    titulo,
    descripcion: "",
    modelos: modelosDeTitulo(titulo),
    enlace: ficha.url,
    enlaceAfiliado: afiliado,
    foto,
    precioTienda: precio,
    desde: false,
    fecha: hoy,
  });
}

writeFileSync(new URL("../apps/web/src/datos/aliexpress.json", import.meta.url), `${JSON.stringify(salida, null, 1)}\n`);
console.log(`AliExpress: ${productos.size} productos para Tesla encontrados, ${salida.length} guardados. Descartados:`, descartes);
