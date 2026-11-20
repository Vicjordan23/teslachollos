import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIAS, nombreCategoria, type IdCategoria } from "@chollesla/core";
import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeCategoria, pagina, totalPaginas } from "@/datos/chollos";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIAS.filter((c) => chollosDeCategoria(c.id).length > 0).map((c) => ({ categoria: c.id }));
}

function valida(id: string): IdCategoria | null {
  return CATEGORIAS.some((c) => c.id === id) ? (id as IdCategoria) : null;
}

export async function generateMetadata({ params }: PageProps<"/categoria/[categoria]">): Promise<Metadata> {
  const id = valida((await params).categoria);
  if (!id) return {};
  return {
    title: `${nombreCategoria(id)} para Tesla en oferta`,
    description: `Chollos de ${nombreCategoria(id).toLowerCase()} para Tesla con el precio final tras el código de descuento.`,
    alternates: { canonical: `/categoria/${id}` },
  };
}

export default async function PaginaCategoria({ params }: PageProps<"/categoria/[categoria]">) {
  const id = valida((await params).categoria);
  if (!id) notFound();
  const lista = chollosDeCategoria(id);
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{nombreCategoria(id)} para tu Tesla</h1>
        <Filtros filtro={{ categoria: id }} />
      </section>
      <Rejilla chollos={pagina(lista, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(lista)} base={`/categoria/${id}`} prefijo={`/categoria/${id}`} />
    </main>
  );
}
