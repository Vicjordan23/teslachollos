import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: totalPaginas(CHOLLOS) - 1 }, (_, i) => ({ n: String(i + 2) }));
}

function numero(n: string): number | null {
  const v = Number(n);
  return /^\d+$/.test(n) && v >= 2 && v <= totalPaginas(CHOLLOS) ? v : null;
}

export async function generateMetadata({ params }: PageProps<"/pagina/[n]">): Promise<Metadata> {
  const n = numero((await params).n);
  return n ? { title: `Chollos en accesorios para Tesla, página ${n}`, alternates: { canonical: `/pagina/${n}` } } : {};
}

export default async function PaginaListado({ params }: PageProps<"/pagina/[n]">) {
  const n = numero((await params).n);
  if (!n) notFound();
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Chollos en accesorios para tu Tesla · página {n}</h1>
        <Filtros filtro={{}} />
      </section>
      <Rejilla chollos={pagina(CHOLLOS, n)} />
      <Paginacion actual={n} total={totalPaginas(CHOLLOS)} base="/" prefijo="" />
    </main>
  );
}
