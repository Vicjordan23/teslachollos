import type { DatosChollo } from "@/components/TarjetaChollo";
import type { CholloComunidad } from "@/lib/supabase-servidor";

/** Fila de Supabase → datos de la tarjeta. */
export function aTarjeta(c: CholloComunidad): DatosChollo {
  return {
    slug: c.slug,
    titulo: c.titulo,
    modelos: c.modelos,
    descripcion: c.descripcion,
    enlace: c.enlace,
    foto: c.foto,
    precioTienda: c.precio_tienda,
    desde: c.desde,
    fecha: c.fecha_precio,
    oficial: c.tipo === "oficial",
    autor: c.autor_alias,
    ruta: c.tipo === "oficial" ? `/chollo/${c.slug}` : `/c/${c.slug}`,
  };
}

export const CAMPOS = "id,slug,tipo,tienda,titulo,descripcion,modelos,enlace,foto,precio_tienda,precio_final,desde,fecha_precio,estado,creado,autor_alias,temperatura,categoria";
