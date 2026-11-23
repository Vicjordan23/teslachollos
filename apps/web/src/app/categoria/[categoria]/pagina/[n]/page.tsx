import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIAS, nombreCategoria, type IdCategoria } from "@chollesla/core";
import { metaPagina } from "@/lib/seo";
import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeCategoria, pagina, totalPaginas } from "@/datos/chollos";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIAS.flatMap((c) =>
    Array.from({ length: totalPaginas(chollosDeCategoria(c.id)) - 1 }, (_, i) => ({ categoria: c.id, n: String(i + 2) })),
  );
}

async function resolver(params: PageProps<"/categoria/[categoria]/pagina/[n]">["params"]) {
  const { categoria, n } = await params;
  if (!CATEGORIAS.some((c) => c.id === categoria) || !/^\d+$/.test(n)) return null;
  const id = categoria as IdCategoria;
  const lista = chollosDeCategoria(id);
  const num = Number(n);
  return num >= 2 && num <= totalPaginas(lista) ? { id, lista, num } : null;
}

export async function generateMetadata({ params }: PageProps<"/categoria/[categoria]/pagina/[n]">): Promise<Metadata> {
  const r = await resolver(params);
  return r
    ? metaPagina({ titulo: `${nombreCategoria(r.id)} para Tesla, página ${r.num}`, descripcion: `Página ${r.num} de ${nombreCategoria(r.id).toLowerCase()} para Tesla Model 3 y Model Y con el precio final tras el código de descuento.`, ruta: `/categoria/${r.id}/pagina/${r.num}` })
    : {};
}

export default async function PaginaCategoriaN({ params }: PageProps<"/categoria/[categoria]/pagina/[n]">) {
  const r = await resolver(params);
  if (!r) notFound();
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">
          {nombreCategoria(r.id)} para tu Tesla · página {r.num}
        </h1>
        <Filtros filtro={{ categoria: r.id }} />
      </section>
      <Rejilla chollos={pagina(r.lista, r.num)} />
      <Paginacion actual={r.num} total={totalPaginas(r.lista)} base={`/categoria/${r.id}`} prefijo={`/categoria/${r.id}`} />
    </main>
  );
}
