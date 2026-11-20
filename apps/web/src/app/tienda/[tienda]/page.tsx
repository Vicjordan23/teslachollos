import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TIENDAS, type IdTienda } from "@chollesla/core";
import { ChipsTiendas } from "@/components/ChipsTiendas";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeTienda, pagina, totalPaginas } from "@/datos/chollos";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(TIENDAS).map((tienda) => ({ tienda }));
}

function tiendaValida(id: string): IdTienda | null {
  return id in TIENDAS ? (id as IdTienda) : null;
}

export async function generateMetadata({ params }: PageProps<"/tienda/[tienda]">): Promise<Metadata> {
  const id = tiendaValida((await params).tienda);
  if (!id) return {};
  const t = TIENDAS[id];
  return {
    title: `Chollos de ${t.nombre} para Tesla`,
    description: `Accesorios para Tesla en ${t.nombre} con el precio final${t.codigo ? ` usando el código ${t.codigo}` : ""}.`,
    alternates: { canonical: `/tienda/${id}` },
  };
}

export default async function PaginaTienda({ params }: PageProps<"/tienda/[tienda]">) {
  const id = tiendaValida((await params).tienda);
  if (!id) notFound();
  const t = TIENDAS[id];
  const lista = chollosDeTienda(id);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">Chollos de {t.nombre} para tu Tesla</h1>
        {t.codigo && (
          <p className="text-lg opacity-80">
            Precios con el código <strong className="text-rojo">{t.codigo}</strong> ya aplicado.
          </p>
        )}
        <ChipsTiendas activa={id} />
      </section>
      <Rejilla chollos={pagina(lista, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(lista)} base={`/tienda/${id}`} prefijo={`/tienda/${id}`} />
    </main>
  );
}
