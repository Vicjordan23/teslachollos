import { cholloPorSlug } from "@/datos/chollos";
import { registrarClic } from "@/lib/clics";

/**
 * Clic en un enlace directo (Amazon, que no se enmascara). El navegador avisa con el atributo `ping` del enlace.
 * Algunos navegadores (Firefox) no lo envían: para Amazon el recuento puede quedarse algo corto.
 */
export async function POST(request: Request, { params }: RouteContext<"/api/clic/[slug]">) {
  const { slug } = await params;
  const c = /^[a-z0-9-]{1,90}$/.test(slug) ? cholloPorSlug(slug) : undefined;
  if (c) await registrarClic({ slug, tienda: c.tienda, titulo: c.titulo }, request.headers);
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
