// Registro permanente de productos (apps/web/src/datos/registro.json): cada producto que ha estado en la web conserva
// su dirección para siempre, aunque cambie el nombre, y si se retira su página sigue existiendo con alternativas.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const RUTA = new URL("../apps/web/src/datos/registro.json", import.meta.url);

export const claveDe = (tienda, id) => `${tienda}:${id}`;

export const cargarRegistro = () => (existsSync(RUTA) ? JSON.parse(readFileSync(RUTA, "utf8")) : {});

/** Ficha mínima: lo necesario para pintar la página de un producto retirado y buscarle alternativas. */
export const entrada = (c) => ({ s: c.slug, t: c.titulo, c: c.categoria, m: c.modelos, f: c.foto, p: c.precioTienda, v: c.fecha });

export function guardarRegistro(registro) {
  // Una línea por producto: los cambios diarios se leen bien en git.
  const lineas = Object.keys(registro)
    .sort()
    .map((k) => `${JSON.stringify(k)}: ${JSON.stringify(registro[k])}`);
  writeFileSync(RUTA, `{\n${lineas.join(",\n")}\n}\n`);
}

export function registrar(chollos) {
  const registro = cargarRegistro();
  for (const c of chollos) registro[claveDe(c.tienda, c.id)] = entrada(c);
  guardarRegistro(registro);
}

/**
 * Reparte direcciones: la del registro si el producto ya existió; si es nuevo, `base` (con -2, -3… si está ocupada
 * por cualquier producto, también retirado).
 */
export function repartidorDeSlugs(otros = []) {
  const registro = cargarRegistro();
  const ocupados = new Set([...Object.values(registro).map((e) => e.s), ...otros]);
  const dados = new Set(otros);
  return (tienda, id, base) => {
    let slug = registro[claveDe(tienda, id)]?.s;
    if (!slug || dados.has(slug)) {
      slug = base;
      for (let n = 2; ocupados.has(slug); n++) slug = `${base}-${n}`;
    }
    ocupados.add(slug);
    dados.add(slug);
    return slug;
  };
}
