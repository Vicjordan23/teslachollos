import { aplicarAfiliado, type ResultadoEnlace } from "./afiliado.js";
import { categoriaDe, type IdCategoria } from "./categorias.js";
import { precioFinal } from "./precio.js";
import { urlFoto } from "./foto.js";
import { hostLimpio, type IdTienda } from "./tiendas.js";

/** Tiendas sin programa de Vic que también se aceptan (el enlace se publica limpio, sin afiliados ajenos). */
export const TIENDAS_EXTRA = ["tesla.com", "aliexpress.com"];

export interface Borrador {
  titulo: string;
  enlace: string;
  /** Precio en tienda en euros, antes del código de Chollesla («39,99»). */
  precio: string;
  descripcion?: string;
  modelos?: string;
  foto?: string;
}

export interface Publicable {
  titulo: string;
  descripcion: string;
  modelos: string;
  enlace_original: string;
  enlace: string;
  tienda: IdTienda | null;
  foto: string | null;
  precio_tienda: number;
  precio_final: number;
  categoria: IdCategoria;
}

export type ResultadoPublicacion = { ok: true; chollo: Publicable } | { ok: false; error: string } | { ok: "resolver" };

/** «39,99» o «1.234,5» → céntimos; null si no es un precio válido (0,01 € a 100.000 €). */
export function eurosACentimos(texto: string): number | null {
  const limpio = texto.trim().replace(/\s|€/g, "");
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(limpio)) return null;
  const normal = /,/.test(limpio) ? limpio.replace(/\./g, "").replace(",", ".") : limpio;
  const c = Math.round(Number(normal) * 100);
  return c > 0 && c <= 10_000_000 ? c : null;
}

function enlaceAceptado(r: ResultadoEnlace): r is Extract<ResultadoEnlace, { estado: "ok" }> {
  if (r.estado !== "ok") return false;
  if (r.tienda) return true;
  const host = hostLimpio(new URL(r.url));
  return TIENDAS_EXTRA.some((d) => host === d || host.endsWith(`.${d}`));
}

/**
 * Valida un chollo enviado por la comunidad y lo deja listo para guardar, con el afiliado de Vic puesto.
 * Si el enlace es un acortador, devuelve «resolver»: el servidor lo sigue y vuelve a llamar con el enlace real.
 */
export function prepararPublicacion(b: Borrador): ResultadoPublicacion {
  const titulo = b.titulo.trim().replace(/\s+/g, " ");
  if (titulo.length < 5 || titulo.length > 200) return { ok: false, error: "El título debe tener entre 5 y 200 caracteres." };
  const descripcion = (b.descripcion ?? "").trim().slice(0, 2000);
  const modelos = (b.modelos ?? "").trim().slice(0, 200);
  const precio = eurosACentimos(b.precio);
  if (!precio) return { ok: false, error: "El precio no es válido." };

  const r = aplicarAfiliado(b.enlace);
  if (r.estado === "resolver") return { ok: "resolver" };
  if (r.estado === "invalido") return { ok: false, error: "El enlace no es válido." };
  if (!enlaceAceptado(r)) {
    return { ok: false, error: "Esa tienda aún no está admitida. Tiendas: Amazon.es, Jowua, Hansshow, Tesery, EVDANCE, Tesla y AliExpress." };
  }
  if (r.tienda === "amazon" && !/\/(dp|gp\/product)\/[A-Z0-9]{10}/i.test(r.url)) {
    return { ok: false, error: "Pega el enlace de la ficha del producto en Amazon (con /dp/)." };
  }
  return {
    ok: true,
    chollo: {
      titulo,
      descripcion,
      modelos,
      enlace_original: b.enlace.trim(),
      enlace: r.url,
      tienda: r.tienda,
      foto: urlFoto(b.foto),
      precio_tienda: precio,
      precio_final: precioFinal(precio, r.tienda),
      categoria: categoriaDe(titulo, descripcion),
    },
  };
}

/** Slug único para un chollo de la comunidad: título + sufijo aleatorio. */
export function slugComunidad(titulo: string, sufijo: string): string {
  const base = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
  return `${base || "chollo"}-${sufijo.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8)}`;
}
