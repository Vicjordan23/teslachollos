// Copia los chollos oficiales (apps/web/src/datos/oficiales.json y aliexpress.json) a la tabla `chollos` de Supabase, para que
// se puedan votar, guardar y reportar. La web los sigue pintando desde el JSON (estático y rápido).
// Uso: SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/sincronizar-supabase.mjs [--prueba]
// Lo ejecuta la acción «Sincronizar Supabase» con los secretos del repo. Requiere `npm run build -w packages/core`.
import { readFileSync } from "node:fs";
import { aplicarAfiliado, precioFinal } from "../packages/core/dist/index.js";

const prueba = process.argv.includes("--prueba");
const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!prueba && (!url || !clave)) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (secretos del repositorio).");
  process.exit(1);
}

const leerJson = (f) => JSON.parse(readFileSync(new URL(`../apps/web/src/datos/${f}`, import.meta.url), "utf8"));
const datos = [...leerJson("oficiales.json"), ...leerJson("aliexpress.json")];

export function fila(c) {
  const enlace = aplicarAfiliado(c.enlace);
  if (enlace.estado !== "ok") throw new Error(`Enlace no válido en ${c.slug}`);
  return {
    slug: c.slug,
    tipo: "oficial",
    tienda: c.tienda,
    id_externo: `${c.tienda}:${c.id}`,
    titulo: c.titulo,
    descripcion: c.descripcion.slice(0, 2000),
    modelos: c.modelos,
    enlace_original: c.enlace,
    // AliExpress: el enlace de afiliado lo genera su API con el tracking ID de Vic.
    enlace: c.enlaceAfiliado ?? enlace.url,
    foto: c.foto,
    precio_tienda: c.precioTienda,
    precio_final: precioFinal(c.precioTienda, c.tienda),
    desde: c.desde,
    fecha_precio: c.fecha,
    estado: "publicado",
  };
}

const filas = datos.map(fila);
if (prueba) {
  console.log(`${filas.length} filas válidas. Ejemplo:`, filas[0]);
  process.exit(0);
}

const cabeceras = { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" };

async function pedir(ruta, opciones = {}) {
  const r = await fetch(`${url}/rest/v1/${ruta}`, { ...opciones, headers: { ...cabeceras, ...opciones.headers } });
  if (!r.ok) throw new Error(`${opciones.method ?? "GET"} ${ruta.split("?")[0]}: ${r.status} ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null; // return=minimal devuelve 201 sin cuerpo
}

// 1) Alta o actualización por id_externo, en tandas.
for (let i = 0; i < filas.length; i += 500) {
  await pedir("chollos?on_conflict=id_externo", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(filas.slice(i, i + 500)),
  });
}

// 2) Los oficiales que ya no están en el catálogo pasan a «retirado» (no se borran: conservan votos y guardados).
const actuales = new Set(filas.map((f) => f.id_externo));
const enBase = await pedir("chollos?select=id,id_externo&tipo=eq.oficial&estado=eq.publicado&limit=100000");
const sobran = enBase.filter((c) => !actuales.has(c.id_externo)).map((c) => c.id);
for (let i = 0; i < sobran.length; i += 200) {
  await pedir(`chollos?id=in.(${sobran.slice(i, i + 200).join(",")})`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ estado: "retirado", actualizado: new Date().toISOString() }),
  });
}

console.log(`Sincronizados ${filas.length} chollos oficiales; retirados ${sobran.length}.`);
