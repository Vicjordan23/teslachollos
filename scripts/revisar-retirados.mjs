// Revisión mensual: con las direcciones que Search Console muestra con clics o impresiones (un archivo de texto, una
// URL o slug por línea) marca para conservar las fichas retiradas que reciben visitas.
// Uso: node scripts/revisar-retirados.mjs visitas.txt      (sin archivo: solo informa)
import { readFileSync, writeFileSync } from "node:fs";
import { cargarRegistro } from "./registro.mjs";

const CONFIG = "apps/web/src/datos/retirados-config.json";
const config = JSON.parse(readFileSync(CONFIG, "utf8"));
const registro = cargarRegistro();
const vivos = new Set(
  ["apps/web/src/datos/oficiales.json", "apps/web/src/datos/aliexpress.json"].flatMap((a) => JSON.parse(readFileSync(a, "utf8")).map((c) => c.slug)),
);
const retirados = new Set(Object.values(registro).map((e) => e.s).filter((s) => !vivos.has(s)));
console.log(`Productos en el registro: ${Object.keys(registro).length}. Retirados: ${retirados.size}. Conservados: ${config.conservar.length}.`);

if (process.argv[2]) {
  const visitadas = readFileSync(process.argv[2], "utf8")
    .split(/\s+/)
    .map((l) => l.replace(/^.*\/chollo\//, "").replace(/[/?#].*$/, ""))
    .filter((s) => retirados.has(s));
  const antes = config.conservar.length;
  config.conservar = [...new Set([...config.conservar, ...visitadas])].sort();
  writeFileSync(CONFIG, `${JSON.stringify(config, null, 1)}\n`);
  console.log(`Añadidas a conservar: ${config.conservar.length - antes}.`);
}
