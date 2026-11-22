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
  const n = chollosDeCategoria(id).length;
  const titulo = `${nombreCategoria(id)} para Tesla Model 3 y Model Y en oferta`;
  const descripcion = `${n.toLocaleString("es-ES")} chollos de ${nombreCategoria(id).toLowerCase()} para Tesla Model 3 y Model Y con el precio final tras el código de descuento. Compara Amazon, AliExpress y tiendas oficiales.`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/categoria/${id}` },
    openGraph: { title: titulo, description: descripcion, url: `/categoria/${id}` },
  };
}

export default async function PaginaCategoria({ params }: PageProps<"/categoria/[categoria]">) {
  const id = valida((await params).categoria);
  if (!id) notFound();
  const lista = chollosDeCategoria(id);
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{nombreCategoria(id)} para tu Tesla</h1>
        <p className="text-texto-suave">
          {lista.length.toLocaleString("es-ES")} chollos de {nombreCategoria(id).toLowerCase()} para Tesla Model 3 y Model Y, ordenados con el precio final ya calculado tras el código de descuento.
        </p>
        <Filtros filtro={{ categoria: id }} />
      </section>
      <Rejilla chollos={pagina(lista, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(lista)} base={`/categoria/${id}`} prefijo={`/categoria/${id}`} />
    </main>
  );
}
