import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIAS, jsonLdColeccion, nombreCategoria, type IdCategoria } from "@chollesla/core";
import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeCategoria, chollosDeVersionCategoria, pagina, primeros, totalPaginas } from "@/datos/chollos";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { CONSEJOS_CATEGORIA, HUBS_VERSION } from "@/lib/contenido";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

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
  const descripcion = `${n.toLocaleString("es-ES")} chollos de ${nombreCategoria(id).toLowerCase()} para Tesla Model 3 y Model Y con el precio final tras el código de descuento. Compara Amazon, AliExpress, Temu y tiendas oficiales.`;
  return metaPagina({ titulo, descripcion, ruta: `/categoria/${id}` });
}

export default async function PaginaCategoria({ params }: PageProps<"/categoria/[categoria]">) {
  const id = valida((await params).categoria);
  if (!id) notFound();
  const lista = chollosDeCategoria(id);
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <Migas migas={[{ nombre: nombreCategoria(id), ruta: `/categoria/${id}` }]} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}/categoria/${id}`,
          nombre: `${nombreCategoria(id)} para Tesla Model 3 y Model Y`,
          descripcion: `Chollos de ${nombreCategoria(id).toLowerCase()} para Tesla.`,
          elementos: primeros(lista, 24).map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{nombreCategoria(id)} para tu Tesla</h1>
        <p className="text-texto-suave">
          {lista.length.toLocaleString("es-ES")} chollos de {nombreCategoria(id).toLowerCase()} para Tesla Model 3 y Model Y, ordenados con el precio final ya calculado tras el código de descuento.
        </p>
        <p className="max-w-3xl text-texto-suave">{CONSEJOS_CATEGORIA[id]}</p>
        <p className="max-w-3xl text-texto-suave">
          Por versión:{" "}
          {Object.values(HUBS_VERSION)
            .filter((h) => chollosDeVersionCategoria(h.version, id).length >= 8)
            .map((h, i) => (
              <span key={h.version}>
                {i > 0 && " · "}
                <Link href={`/modelo/${h.version}/${id}`} className="font-medium text-verde-boton hover:underline">
                  {nombreCategoria(id)} para {h.nombre}
                </Link>
              </span>
            ))}
        </p>
        <Filtros filtro={{ categoria: id }} />
      </section>
      <Rejilla chollos={pagina(lista, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(lista)} base={`/categoria/${id}`} prefijo={`/categoria/${id}`} />
    </main>
  );
}
