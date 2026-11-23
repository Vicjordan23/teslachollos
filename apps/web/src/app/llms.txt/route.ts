import { SITIO } from "@/lib/sitio";

export const dynamic = "force-static";

/** Resumen para asistentes de IA (formato llms.txt). Google no lo usa; es opcional y solo describe lo que ya es público. */
export function GET() {
  const cuerpo = `# Chollesla

> Web gratuita en español con chollos de accesorios para Tesla Model 3 y Model Y en tiendas que envían a España. Cada chollo muestra el precio final tras el código de descuento de la tienda y enlaza a la tienda con enlace de afiliado (sin coste extra para el comprador).

## Páginas principales
- [Chollos de esta semana](${SITIO}/chollos-tesla-esta-semana): accesorios con más descuento, con precio revisado en los últimos 7 días.
- [Códigos de descuento](${SITIO}/codigos-descuento): código de cada tienda (Hansshow, Jowua, Tesery, EVDANCE) y cómo se usa.
- [Accesorios Model Y Juniper](${SITIO}/modelo/model-y-juniper): accesorios compatibles con el Model Y de 2025 en adelante.
- [Accesorios Model 3 Highland](${SITIO}/modelo/model-3-highland): accesorios compatibles con el Model 3 de 2024 en adelante.
- [Categorías](${SITIO}/categoria/alfombrillas): alfombrillas, protectores de pantalla, carga, iluminación, organización y más.

## Notas
- Los precios se revisan a diario y pueden cambiar; la tienda es la fuente final.
- No hay valoraciones ni reseñas inventadas. Chollesla no es una web oficial de Tesla.
- Canal de Telegram: https://t.me/teslaaccesorios
`;
  return new Response(cuerpo, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
