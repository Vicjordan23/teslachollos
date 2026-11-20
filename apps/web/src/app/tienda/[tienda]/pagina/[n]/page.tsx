import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TIENDAS, type IdTienda } from "@chollesla/core";
import { BarraCategorias } from "@/components/BarraCategorias";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeTienda, pagina, totalPaginas } from "@/datos/chollos";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(TIENDAS) as IdTienda[]).flatMap((tienda) =>
    Array.from({ length: totalPaginas(chollosDeTienda(tienda)) - 1 }, (_, i) => ({ tienda, n: String(i + 2) })),
  );
}

async function resolver(params: PageProps<"/tienda/[tienda]/pagina/[n]">["params"]) {
  const { tienda, n } = await params;
  if (!(tienda in TIENDAS) || !/^\d+$/.test(n)) return null;
  const id = tienda as IdTienda;
  const lista = chollosDeTienda(id);
  const num = Number(n);
  return num >= 2 && num <= totalPaginas(lista) ? { id, lista, num } : null;
}

export async function generateMetadata({ params }: PageProps<"/tienda/[tienda]/pagina/[n]">): Promise<Metadata> {
  const r = await resolver(params);
  return r
    ? { title: `Chollos de ${TIENDAS[r.id].nombre} para Tesla, página ${r.num}`, alternates: { canonical: `/tienda/${r.id}/pagina/${r.num}` } }
    : {};
}

export default async function PaginaTiendaN({ params }: PageProps<"/tienda/[tienda]/pagina/[n]">) {
  const r = await resolver(params);
  if (!r) notFound();
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">
          Chollos de {TIENDAS[r.id].nombre} para tu Tesla · página {r.num}
        </h1>
        <BarraCategorias />
      </section>
      <Rejilla chollos={pagina(r.lista, r.num)} />
      <Paginacion actual={r.num} total={totalPaginas(r.lista)} base={`/tienda/${r.id}`} prefijo={`/tienda/${r.id}`} />
    </main>
  );
}
