// Una sola vez: reconstruye el registro con el historial de git (recupera los productos ya retirados) y anota como
// redirección las direcciones antiguas de productos que cambiaron de nombre. Uso: node scripts/sembrar-registro.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { claveDe, entrada, guardarRegistro } from "./registro.mjs";

const TIENDAS = new Set(["amazon", "jowua", "hansshow", "tesery", "aliexpress", "temu", "yeslak"]);
// Retirados a propósito porque no son de Tesla: no se recuperan.
const AJENOS = /\bMG ?4\b|mach-?e|volvo/i;
const ARCHIVOS = ["apps/web/src/datos/oficiales.json", "apps/web/src/datos/aliexpress.json"];
const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const registro = {};
const antiguos = new Map(); // slug antiguo → clave
const revisiones = git("log", "--reverse", "--format=%H", "--", ...ARCHIVOS).trim().split("\n");
for (const rev of revisiones) {
  for (const archivo of ARCHIVOS) {
    let lista;
    try {
      lista = JSON.parse(git("show", `${rev}:${archivo}`));
    } catch {
      continue;
    }
    for (const c of lista) {
      if (!TIENDAS.has(c.tienda) || AJENOS.test(c.titulo)) continue;
      const k = claveDe(c.tienda, c.id);
      if (registro[k] && registro[k].s !== c.slug) antiguos.set(registro[k].s, k);
      registro[k] = entrada(c);
    }
  }
}
// El estado actual manda sobre el historial.
const vivos = ARCHIVOS.flatMap((a) => JSON.parse(readFileSync(a, "utf8")));
for (const c of vivos) registro[claveDe(c.tienda, c.id)] = entrada(c);
guardarRegistro(registro);

const usados = new Set(Object.values(registro).map((e) => e.s));
const redirigir = {};
for (const [slug, k] of antiguos) if (!usados.has(slug)) redirigir[slug] = registro[k].s;
writeFileSync("apps/web/src/datos/retirados-config.json", `${JSON.stringify({ conservar: [], eliminados: [], redirigir }, null, 1)}\n`);
console.log(`Registro: ${Object.keys(registro).length} productos (${vivos.length} en el catálogo). Redirecciones: ${Object.keys(redirigir).length}.`);
