import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODELOS, nombreModelo, type IdModelo } from "@chollesla/core";
import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeModelo, pagina, totalPaginas } from "@/datos/chollos";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELOS.map((m) => ({ modelo: m.id }));
}

function modeloValido(id: string): IdModelo | null {
  return MODELOS.some((m) => m.id === id) ? (id as IdModelo) : null;
}

export async function generateMetadata({ params }: PageProps<"/modelo/[modelo]">): Promise<Metadata> {
  const id = modeloValido((await params).modelo);
  if (!id) return {};
  return {
    title: `Accesorios para Tesla ${nombreModelo(id)} en oferta`,
    description: `Chollos de accesorios para el Tesla ${nombreModelo(id)} con el precio final tras el código de descuento.`,
    alternates: { canonical: `/modelo/${id}` },
  };
}

export default async function PaginaModelo({ params }: PageProps<"/modelo/[modelo]">) {
  const id = modeloValido((await params).modelo);
  if (!id) notFound();
  const lista = chollosDeModelo(id);
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Accesorios para Tesla {nombreModelo(id)}</h1>
        <p className="text-texto-suave">{lista.length.toLocaleString("es-ES")} chollos compatibles, incluidos los universales.</p>
        <Filtros filtro={{ modelo: id }} />
      </section>
      <Rejilla chollos={pagina(lista, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(lista)} base={`/modelo/${id}`} prefijo={`/modelo/${id}`} />
    </main>
  );
}
