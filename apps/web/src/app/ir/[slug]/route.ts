import { aplicarAfiliado } from "@chollesla/core";
import { cholloPorSlug } from "@/datos/chollos";

const CABECERAS = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

/** Salida a la tienda: 302 al enlace con el afiliado de Vic. El clic queda en los registros del Worker. */
export async function GET(_: Request, { params }: RouteContext<"/ir/[slug]">) {
  const { slug } = await params;
  const c = cholloPorSlug(slug);
  const enlace = c ? aplicarAfiliado(c.enlace) : null;
  if (!c || enlace?.estado !== "ok") {
    return new Response("Este chollo ya no está.", { status: 404, headers: { ...CABECERAS, "Content-Type": "text/plain; charset=utf-8" } });
  }
  console.log(JSON.stringify({ evento: "clic", slug, tienda: c.tienda }));
  return new Response(null, { status: 302, headers: { ...CABECERAS, Location: enlace.url } });
}
