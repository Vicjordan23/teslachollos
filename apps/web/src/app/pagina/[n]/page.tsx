import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChipsTiendas } from "@/components/ChipsTiendas";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";

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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Chollos en accesorios para tu Tesla · página {n}</h1>
        <ChipsTiendas />
      </section>
      <Rejilla chollos={pagina(CHOLLOS, n)} />
      <Paginacion actual={n} total={totalPaginas(CHOLLOS)} base="/" prefijo="" />
    </main>
  );
}
