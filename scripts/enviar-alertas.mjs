// Envía por email las alertas de chollos nuevos (una vez al día). Lo ejecuta la acción «Enviar alertas».
// Secretos: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ALERTAS_REMITENTE («Chollesla <alertas@tu-dominio>»)
// y la variable SITIO (https://…). Sin RESEND_API_KEY no envía nada (solo cuenta coincidencias).
// Regla de Amazon: sus enlaces de afiliado no van en emails; los emails enlazan a nuestra ficha.
import { buscar, categoriaDe, formatoEuros, modelosDe } from "../packages/core/dist/index.js";

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resend = process.env.RESEND_API_KEY;
const remitente = process.env.ALERTAS_REMITENTE;
const sitio = (process.env.SITIO ?? "").replace(/\/+$/, "");
if (!url || !clave || !sitio) {
  console.error("Faltan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o SITIO.");
  process.exit(1);
}
const cab = { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" };

async function pedir(ruta, opciones = {}) {
  const r = await fetch(`${url}${ruta}`, { ...opciones, headers: { ...cab, ...opciones.headers } });
  if (!r.ok) throw new Error(`${opciones.method ?? "GET"} ${ruta.split("?")[0]}: ${r.status} ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null; // return=minimal devuelve 201 sin cuerpo
}

const ahora = new Date().toISOString();
const alertas = await pedir("/rest/v1/alertas?select=id,usuario_id,palabra,modelo,categoria,precio_max,ultimo_aviso&email=eq.true&limit=100000");
if (alertas.length === 0) {
  console.log("No hay alertas.");
  process.exit(0);
}
const desde = alertas.map((a) => a.ultimo_aviso).sort()[0];
const nuevos = await pedir(
  `/rest/v1/chollos_publicos?select=slug,tipo,titulo,descripcion,modelos,precio_final,desde,tienda,creado,categoria&estado=eq.publicado&creado=gt.${encodeURIComponent(desde)}&order=creado.desc&limit=2000`,
);

const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const enlace = (c) => `${sitio}/${c.tipo === "oficial" ? "chollo" : "c"}/${c.slug}`;

/** Chollos nuevos que encajan con una alerta. */
function coinciden(a) {
  let lista = nuevos.filter((c) => c.creado > a.ultimo_aviso);
  if (a.palabra) lista = buscar(lista, a.palabra);
  if (a.modelo) lista = lista.filter((c) => modelosDe(c.modelos).includes(a.modelo));
  if (a.categoria) lista = lista.filter((c) => (c.categoria && c.categoria !== "otros" ? c.categoria : categoriaDe(c.titulo, c.descripcion)) === a.categoria);
  if (a.precio_max) lista = lista.filter((c) => c.precio_final <= a.precio_max);
  return lista;
}

const porUsuario = new Map();
for (const a of alertas) {
  for (const c of coinciden(a)) {
    const m = porUsuario.get(a.usuario_id) ?? new Map();
    m.set(c.slug, c);
    porUsuario.set(a.usuario_id, m);
  }
}

let enviados = 0;
for (const [usuario, chollos] of porUsuario) {
  const lista = [...chollos.values()].slice(0, 15);
  if (!resend || !remitente) continue;
  const { email } = await pedir(`/auth/v1/admin/users/${usuario}`);
  if (!email) continue;
  const filas = lista
    .map((c) => `<li style="margin:0 0 10px"><a href="${enlace(c)}">${escapar(c.titulo)}</a><br><strong>${c.desde ? "Desde " : ""}${escapar(formatoEuros(c.precio_final))}</strong></li>`)
    .join("");
  const html = `<p>Hola: hay ${lista.length === 1 ? "un chollo nuevo" : `${lista.length} chollos nuevos`} que encajan con tus alertas.</p><ul style="padding-left:18px">${filas}</ul><p style="color:#5b6676;font-size:13px">Recibes este email porque creaste alertas en Chollesla. Puedes borrarlas en <a href="${sitio}/alertas">${sitio}/alertas</a>.</p>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: remitente, to: [email], subject: `Chollesla: ${lista.length} ${lista.length === 1 ? "chollo nuevo" : "chollos nuevos"} para tus alertas`, html }),
  });
  if (r.ok) enviados++;
  else console.error(`Resend ${r.status}: ${await r.text()}`);
}

// Avanza la ventana de todas las alertas (aunque no hubiera coincidencias), salvo si no se pudo enviar.
if (resend && remitente) {
  await pedir(`/rest/v1/alertas?email=eq.true&ultimo_aviso=lt.${encodeURIComponent(ahora)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ ultimo_aviso: ahora }),
  });
}
console.log(`${alertas.length} alertas, ${nuevos.length} chollos nuevos, ${porUsuario.size} usuarios con coincidencias, ${enviados} emails enviados.`);
