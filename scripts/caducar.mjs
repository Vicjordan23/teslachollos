// Caduca chollos de la comunidad: los que pasan su fecha de fin, los de más de 30 días y los que 3 personas
// distintas han reportado como caducados. Lo ejecuta la acción «Enviar alertas» cada día, antes de enviar.
const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !clave) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const cab = { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" };
const pedir = async (ruta, op = {}) => {
  const r = await fetch(`${url}/rest/v1/${ruta}`, { ...op, headers: { ...cab, ...op.headers } });
  if (!r.ok) throw new Error(`${ruta.split("?")[0]}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
};
const ahora = new Date();
const hace30 = new Date(ahora.getTime() - 30 * 86_400_000).toISOString();
const base = "chollos?tipo=eq.comunidad&estado=eq.publicado";
const cuerpo = JSON.stringify({ estado: "caducado", actualizado: ahora.toISOString() });
const p1 = await pedir(`${base}&caduca=lt.${encodeURIComponent(ahora.toISOString())}&select=id`, { method: "PATCH", body: cuerpo, headers: { Prefer: "return=representation" } });
const p2 = await pedir(`${base}&creado=lt.${encodeURIComponent(hace30)}&caduca=is.null&select=id`, { method: "PATCH", body: cuerpo, headers: { Prefer: "return=representation" } });

const reportes = await pedir("reportes?select=chollo_id,usuario_id&motivo=eq.caducado&estado=eq.abierto&limit=10000");
const cuenta = new Map();
for (const r of reportes) cuenta.set(r.chollo_id, (cuenta.get(r.chollo_id) ?? new Set()).add(r.usuario_id));
const ids = [...cuenta].filter(([, s]) => s.size >= 3).map(([id]) => id);
let p3 = [];
if (ids.length) {
  p3 = await pedir(`${base}&id=in.(${ids.join(",")})&select=id`, { method: "PATCH", body: cuerpo, headers: { Prefer: "return=representation" } });
  await pedir(`reportes?chollo_id=in.(${ids.join(",")})&motivo=eq.caducado&estado=eq.abierto`, { method: "PATCH", body: JSON.stringify({ estado: "aceptado" }), headers: { Prefer: "return=minimal" } });
}
console.log(`Caducados: ${p1.length} por fecha, ${p2.length} por antigüedad, ${p3.length} por reportes.`);
