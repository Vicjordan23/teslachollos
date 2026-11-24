// Carga en ingresos_afiliados los resultados de Amazon Afiliados que deja en el repo la tarea diaria de Chrome.
// Archivo: datos-ingresos/amazon.json  →  { "actualizado": "...", "filas": [ { fecha, tag, clics, pedidos, ventas, comision, estado } ] }
//   fecha aaaa-mm-dd · tag p. ej. "teslatelegram-21" · ventas y comision en euros · estado pendiente|aprobada|pagada|rechazada
// Secretos: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. Uso: node scripts/importar-ingresos-archivo.mjs [--prueba]
import { readFileSync } from "node:fs";

const prueba = process.argv.includes("--prueba");
const URL_SB = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const CLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!prueba && (!URL_SB || !CLAVE)) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const datos = JSON.parse(readFileSync(new URL("../datos-ingresos/amazon.json", import.meta.url), "utf8"));
const ESTADOS = ["pendiente", "aprobada", "pagada", "rechazada"];
const euros = (v) => Math.round(Number(v) * 100);
const entero = (v) => Math.max(0, Math.trunc(Number(v)) || 0);

const filas = [];
for (const f of datos.filas ?? []) {
  const tag = String(f.tag ?? "").trim().toLowerCase();
  // Solo los códigos de Tesla; el de la web de recetas (freidoras…) NO se importa.
  if (!/^tesla[a-z]+-21$/.test(tag)) continue;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.fecha ?? ""))) continue;
  const ventas = euros(f.ventas ?? 0);
  const comision = euros(f.comision ?? 0);
  if (!Number.isFinite(ventas) || !Number.isFinite(comision)) continue;
  filas.push({
    fecha: f.fecha,
    tienda: "amazon",
    clics_tienda: entero(f.clics),
    pedidos: entero(f.pedidos),
    ventas_cents: ventas,
    comision_cents: comision,
    estado: ESTADOS.includes(f.estado) ? f.estado : "pendiente",
    origen: `amazon:${tag.replace(/-21$/, "")}`,
    notas: f.notas ? `${f.notas} (Amazon Afiliados, ID ${tag})` : `Informe de Amazon Afiliados (ID ${tag}). Actualizado ${datos.actualizado ?? ""}`.trim(),
  });
}
console.log(`Filas válidas: ${filas.length} de ${(datos.filas ?? []).length}`);
for (const f of filas.slice(0, 8)) console.log(JSON.stringify(f));
if (prueba || !filas.length) process.exit(0);

const r = await fetch(`${URL_SB}/rest/v1/ingresos_afiliados?on_conflict=fecha,tienda,origen`, {
  method: "POST",
  headers: { apikey: CLAVE, Authorization: `Bearer ${CLAVE}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify(filas),
});
if (!r.ok) {
  console.error("Supabase:", r.status, (await r.text()).slice(0, 300));
  process.exit(3);
}
console.log(`Guardadas ${filas.length} filas en ingresos_afiliados.`);
