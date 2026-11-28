import { aplicarAfiliado } from "@chollesla/core";
import { cholloPorSlug } from "@/datos/chollos";
import { registrarClic } from "@/lib/clics";
import { leer } from "@/lib/supabase-servidor";

const CABECERAS = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

/** Salida a la tienda: 302 al enlace con el afiliado de Vic. El clic se anota (chollo y tienda, nada de la persona) en Supabase y en los registros del Worker. */
export async function GET(request: Request, { params }: RouteContext<"/ir/[slug]">) {
  const { slug } = await params;
  // Oficiales: del catálogo; de la comunidad: de Supabase (enlace ya guardado con el afiliado de Vic).
  const oficial = cholloPorSlug(slug);
  const c = oficial
    ? { enlace: oficial.enlace, tienda: oficial.tienda, afiliado: oficial.enlaceAfiliado, titulo: oficial.titulo as string | null }
    : /^[a-z0-9-]{1,90}$/.test(slug)
      ? (await leer<{ enlace: string; tienda: string | null; titulo: string | null }>(`chollos_publicos?select=enlace,tienda,titulo&slug=eq.${slug}&limit=1`))[0]
      : undefined;
  const enlace = c ? aplicarAfiliado(c.enlace) : null;
  if (!c || enlace?.estado !== "ok") {
    return new Response("Este chollo ya no está.", { status: 404, headers: { ...CABECERAS, "Content-Type": "text/plain; charset=utf-8" } });
  }
  console.log(JSON.stringify({ evento: "clic", slug, tienda: c.tienda }));
  await registrarClic({ slug, tienda: c.tienda, titulo: c.titulo }, request.headers);
  // AliExpress: enlace de afiliado generado por su API (solo se acepta si es de s.click.aliexpress.com).
  const destino = "afiliado" in c && c.afiliado?.startsWith("https://s.click.aliexpress.com/") ? c.afiliado : enlace.url;
  return new Response(null, { status: 302, headers: { ...CABECERAS, Location: destino } });
}
