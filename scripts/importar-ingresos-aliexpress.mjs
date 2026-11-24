// Importa los PEDIDOS de AliExpress (API de afiliados, aliexpress.affiliate.order.list) y los resume por día en la tabla
// ingresos_afiliados (origen «api») para el panel /admin/afiliados.
// Secretos: ALIEXPRESS_APP_KEY, ALIEXPRESS_APP_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Uso: node scripts/importar-ingresos-aliexpress.mjs [--prueba] [--dias=45]
//   --prueba: no escribe en Supabase; imprime la estructura de la respuesta y el resumen por día.
// Si la respuesta no tiene los campos esperados, NO escribe nada y lo cuenta (para no guardar datos falsos).
import { createHash, createHmac } from "node:crypto";

const prueba = process.argv.includes("--prueba");
const dias = Number((process.argv.find((a) => a.startsWith("--dias=")) ?? "--dias=45").split("=")[1]) || 45;
const APP_KEY = process.env.ALIEXPRESS_APP_KEY?.trim();
const SECRETO = process.env.ALIEXPRESS_APP_SECRET?.trim();
const SB_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SB_CLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!APP_KEY || !SECRETO) {
  console.error("Faltan ALIEXPRESS_APP_KEY o ALIEXPRESS_APP_SECRET.");
  process.exit(1);
}
if (!prueba && (!SB_URL || !SB_CLAVE)) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

function firmar(params, secreto, modo) {
  const base = Object.keys(params).sort().map((k) => `${k}${params[k]}`).join("");
  if (modo === "md5") return createHash("md5").update(secreto + base + secreto, "utf8").digest("hex").toUpperCase();
  return createHmac("sha256", secreto).update(base, "utf8").digest("hex").toUpperCase();
}
let modoFirma = null;
async function llamar(metodo, negocio) {
  let ultimo;
  for (const modo of modoFirma ? [modoFirma] : ["sha256", "md5"]) {
    const params =
      modo === "md5"
        ? { app_key: APP_KEY, method: metodo, timestamp: new Date(Date.now() + 8 * 3600_000).toISOString().replace("T", " ").slice(0, 19), sign_method: "md5", v: "2.0", format: "json", ...negocio }
        : { app_key: APP_KEY, method: metodo, sign_method: "sha256", timestamp: String(Date.now()), ...negocio };
    params.sign = firmar(params, SECRETO, modo);
    const r = await fetch(process.env.ALIEXPRESS_API ?? "https://api-sg.aliexpress.com/sync", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: new URLSearchParams(params),
    });
    const j = await r.json();
    if (!j.error_response) {
      modoFirma = modo;
      return j;
    }
    ultimo = new Error(`${metodo}: ${j.error_response.code} ${j.error_response.msg}`);
    if (!/signature/i.test(`${j.error_response.code} ${j.error_response.msg}`)) throw ultimo;
  }
  throw ultimo;
}

// Hora de Pekín (UTC+8), que es la que usa AliExpress para los filtros de fecha.
const pekin = (ms) => new Date(ms + 8 * 3600_000).toISOString().replace("T", " ").slice(0, 19);
const FIELDS = "order_id,order_number,sub_order_id,order_status,paid_amount,finished_amount,estimated_paid_commission,estimated_finished_commission,paid_time,finished_time,tracking_id,currency,settled_currency";

const encontrados = [];
let raw = null;
for (let pagina = 1; pagina <= 40; pagina++) {
  const j = await llamar("aliexpress.affiliate.order.list", {
    fields: FIELDS,
    start_time: pekin(Date.now() - dias * 864e5),
    end_time: pekin(Date.now()),
    page_no: String(pagina),
    page_size: "50",
    locale_site: "es",
  });
  const res = j.aliexpress_affiliate_order_list_response?.resp_result;
  if (pagina === 1) raw = j;
  if (!res || (res.resp_code && Number(res.resp_code) !== 200)) {
    console.error("Respuesta inesperada:", JSON.stringify(j).slice(0, 600));
    process.exit(2);
  }
  const lista = res.result?.orders?.order ?? [];
  encontrados.push(...lista);
  if (lista.length < 50) break;
}
console.log(`Pedidos leídos: ${encontrados.length} (últimos ${dias} días)`);
if (prueba && encontrados[0]) console.log("Ejemplo (campos):", JSON.stringify(encontrados[0]).slice(0, 700));
if (prueba && !encontrados.length) console.log("Respuesta cruda:", JSON.stringify(raw).slice(0, 700));

const num = (v) => Number(String(v ?? "0").replace(",", ".")) || 0;
const porDia = new Map();
const monedas = new Set();
for (const o of encontrados) {
  const fecha = String(o.paid_time ?? o.finished_time ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) continue;
  if (o.currency) monedas.add(String(o.currency));
  const terminado = /finish|confirm/i.test(String(o.order_status ?? ""));
  const d = porDia.get(fecha) ?? { pedidos: 0, ventas: 0, comision: 0, todosTerminados: true };
  d.pedidos++;
  d.ventas += num(terminado ? o.finished_amount || o.paid_amount : o.paid_amount);
  d.comision += num(terminado ? o.estimated_finished_commission || o.estimated_paid_commission : o.estimated_paid_commission);
  if (!terminado) d.todosTerminados = false;
  porDia.set(fecha, d);
}
const moneda = [...monedas].join(",") || "desconocida";
console.log(`Moneda de la API: ${moneda}`);
const filas = [...porDia].map(([fecha, d]) => ({
  fecha,
  tienda: "aliexpress",
  clics_tienda: 0,
  pedidos: d.pedidos,
  ventas_cents: Math.round(d.ventas * 100),
  comision_cents: Math.round(d.comision * 100),
  estado: d.todosTerminados ? "aprobada" : "pendiente",
  origen: "api",
  notas: `Importado de la API de AliExpress (moneda ${moneda}); comisión estimada.`,
}));
for (const f of filas.sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).slice(0, 10)) console.log(JSON.stringify(f));
if (!/^(EUR|)$/i.test(moneda.replace(/,/g, "")) && moneda !== "desconocida") {
  console.warn(`AVISO: la moneda de la API (${moneda}) no es EUR; los importes quedan en esa moneda (mira la nota de cada fila).`);
}
if (prueba) process.exit(0);
if (!filas.length) {
  console.log("Sin pedidos: nada que guardar.");
  process.exit(0);
}
const r = await fetch(`${SB_URL}/rest/v1/ingresos_afiliados?on_conflict=fecha,tienda,origen`, {
  method: "POST",
  headers: { apikey: SB_CLAVE, Authorization: `Bearer ${SB_CLAVE}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify(filas),
});
if (!r.ok) {
  console.error("Supabase:", r.status, (await r.text()).slice(0, 300));
  process.exit(3);
}
console.log(`Guardadas ${filas.length} filas en ingresos_afiliados.`);
