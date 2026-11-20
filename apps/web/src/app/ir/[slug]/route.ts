import { aplicarAfiliado } from "@chollesla/core";
import { cholloPorSlug } from "@/datos/chollos";
import { leer } from "@/lib/supabase-servidor";

const CABECERAS = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

/** Salida a la tienda: 302 al enlace con el afiliado de Vic. El clic queda en los registros del Worker. */
export async function GET(_: Request, { params }: RouteContext<"/ir/[slug]">) {
  const { slug } = await params;
  // Oficiales: del catálogo; de la comunidad: de Supabase (enlace ya guardado con el afiliado de Vic).
  const oficial = cholloPorSlug(slug);
  const c = oficial
    ? { enlace: oficial.enlace, tienda: oficial.tienda, afiliado: oficial.enlaceAfiliado }
    : /^[a-z0-9-]{1,90}$/.test(slug)
      ? (await leer<{ enlace: string; tienda: string | null }>(`chollos_publicos?select=enlace,tienda&slug=eq.${slug}&limit=1`))[0]
      : undefined;
  const enlace = c ? aplicarAfiliado(c.enlace) : null;
  if (!c || enlace?.estado !== "ok") {
    return new Response("Este chollo ya no está.", { status: 404, headers: { ...CABECERAS, "Content-Type": "text/plain; charset=utf-8" } });
  }
  console.log(JSON.stringify({ evento: "clic", slug, tienda: c.tienda }));
  // AliExpress: enlace de afiliado generado por su API (solo se acepta si es de s.click.aliexpress.com).
  const destino = "afiliado" in c && c.afiliado?.startsWith("https://s.click.aliexpress.com/") ? c.afiliado : enlace.url;
  return new Response(null, { status: 302, headers: { ...CABECERAS, Location: destino } });
}
