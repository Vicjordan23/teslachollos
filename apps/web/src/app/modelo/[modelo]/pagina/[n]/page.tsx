import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODELOS, nombreModelo, type IdModelo } from "@chollesla/core";
import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeModelo, pagina, totalPaginas } from "@/datos/chollos";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELOS.flatMap((m) =>
    Array.from({ length: totalPaginas(chollosDeModelo(m.id)) - 1 }, (_, i) => ({ modelo: m.id, n: String(i + 2) })),
  );
}

async function resolver(params: PageProps<"/modelo/[modelo]/pagina/[n]">["params"]) {
  const { modelo, n } = await params;
  if (!MODELOS.some((m) => m.id === modelo) || !/^\d+$/.test(n)) return null;
  const id = modelo as IdModelo;
  const lista = chollosDeModelo(id);
  const num = Number(n);
  return num >= 2 && num <= totalPaginas(lista) ? { id, lista, num } : null;
}

export async function generateMetadata({ params }: PageProps<"/modelo/[modelo]/pagina/[n]">): Promise<Metadata> {
  const r = await resolver(params);
  return r
    ? { title: `Accesorios para Tesla ${nombreModelo(r.id)}, página ${r.num}`, alternates: { canonical: `/modelo/${r.id}/pagina/${r.num}` } }
    : {};
}

export default async function PaginaModeloN({ params }: PageProps<"/modelo/[modelo]/pagina/[n]">) {
  const r = await resolver(params);
  if (!r) notFound();
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Accesorios para Tesla {nombreModelo(r.id)} <span className="text-texto-suave">· página {r.num}</span>
        </h1>
        <Filtros filtro={{ modelo: r.id }} />
      </section>
      <Rejilla chollos={pagina(r.lista, r.num)} />
      <Paginacion actual={r.num} total={totalPaginas(r.lista)} base={`/modelo/${r.id}`} prefijo={`/modelo/${r.id}`} />
    </main>
  );
}
