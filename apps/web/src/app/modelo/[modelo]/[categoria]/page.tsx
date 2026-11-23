import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIAS, formatoEuros, jsonLdColeccion, TIENDAS, type IdCategoria } from "@chollesla/core";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { Rejilla } from "@/components/Rejilla";
import { chollosDeVersionCategoria, formatoFecha, primeros, resumen, ULTIMA_REVISION } from "@/datos/chollos";
import { CONSEJOS_CATEGORIA, HUBS_VERSION, IDS_HUBS_VERSION } from "@/lib/contenido";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

export const dynamicParams = false;

/** Puerta de calidad: solo se crea la página si hay al menos este número de chollos (evita páginas casi vacías). */
const MINIMO = 8;
/** Máximo de chollos que se enseñan; el resto está en la página de la categoría. */
const MAXIMO = 36;

export function generateStaticParams() {
  return IDS_HUBS_VERSION.flatMap((modelo) =>
    CATEGORIAS.filter((c) => c.id !== "otros" && chollosDeVersionCategoria(HUBS_VERSION[modelo]!.version, c.id).length >= MINIMO).map((c) => ({ modelo, categoria: c.id })),
  );
}

function resolver(modelo: string, categoria: string) {
  const hub = HUBS_VERSION[modelo];
  const cat = CATEGORIAS.find((c) => c.id === categoria);
  if (!hub || !cat || cat.id === "otros") return null;
  const lista = chollosDeVersionCategoria(hub.version, cat.id as IdCategoria);
  return lista.length >= MINIMO ? { hub, cat, lista } : null;
}

export async function generateMetadata({ params }: PageProps<"/modelo/[modelo]/[categoria]">): Promise<Metadata> {
  const { modelo, categoria } = await params;
  const r = resolver(modelo, categoria);
  if (!r) return {};
  const { hub, cat, lista } = r;
  return metaPagina({
    titulo: `${cat.nombre} para Tesla ${hub.nombre}: ${lista.length} opciones`,
    descripcion: `${lista.length} ${cat.nombre.toLowerCase()} compatibles con el ${hub.completo}, con el precio final tras el código de descuento. Consejos de compra y comparativa de tiendas.`,
    ruta: `/modelo/${hub.version}/${cat.id}`,
  });
}

export default async function PaginaVersionCategoria({ params }: PageProps<"/modelo/[modelo]/[categoria]">) {
  const { modelo, categoria } = await params;
  const r = resolver(modelo, categoria);
  if (!r) notFound();
  const { hub, cat, lista } = r;
  const res = resumen(lista);
  const nombre = cat.nombre.toLowerCase();
  const ruta = `/modelo/${hub.version}/${cat.id}`;
  const mostrados = primeros(lista, MAXIMO);
  const preguntas = [
    {
      pregunta: `¿Cuánto cuestan las ${nombre} para el ${hub.nombre}?`,
      respuesta: `En Chollesla hay ${lista.length} opciones de ${nombre} para el ${hub.nombre}, desde ${formatoEuros(res.minimo)} hasta ${formatoEuros(res.maximo)} (precio final con el código de descuento de la tienda, revisado el ${formatoFecha(ULTIMA_REVISION)}). Pueden cambiar: confirma el importe en la tienda.`,
    },
    {
      pregunta: `¿En qué tiendas se pueden comprar?`,
      respuesta: `Las opciones de esta página vienen de ${res.tiendas.map((t) => TIENDAS[t].nombre).join(", ")}. Cada ficha te lleva a la tienda con nuestro enlace de afiliado, sin coste extra para ti.`,
    },
    {
      pregunta: `¿Valen para mi coche?`,
      respuesta: `${hub.nota} Si el producto no indica el año, pregunta a la tienda antes de comprar.`,
    },
  ];
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas
        migas={[
          { nombre: hub.nombre, ruta: `/modelo/${hub.version}` },
          { nombre: cat.nombre, ruta },
        ]}
      />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}${ruta}`,
          nombre: `${cat.nombre} para ${hub.completo}`,
          descripcion: `${lista.length} ${nombre} compatibles con el ${hub.completo}.`,
          elementos: mostrados.slice(0, 24).map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />
      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {cat.nombre} para {hub.completo}
        </h1>
        <p className="text-texto-suave">{CONSEJOS_CATEGORIA[cat.id]}</p>
        <p className="text-texto-suave">{hub.nota}</p>
        <p>
          Hoy hay <strong>{lista.length}</strong> opciones, desde <strong>{formatoEuros(res.minimo)}</strong> hasta{" "}
          <strong>{formatoEuros(res.maximo)}</strong> con el código de descuento ya aplicado. Precios revisados el {formatoFecha(ULTIMA_REVISION)}.
        </p>
      </section>
      <Rejilla chollos={mostrados} prioridad={3} />
      {lista.length > MAXIMO && (
        <p>
          Hay más: mira todas las{" "}
          <Link href={`/categoria/${cat.id}`} className="font-medium text-verde-boton hover:underline">
            {nombre}
          </Link>{" "}
          o vuelve a <Link href={`/modelo/${hub.version}`} className="font-medium text-verde-boton hover:underline">todos los accesorios para {hub.nombre}</Link>.
        </p>
      )}
      <Faq preguntas={preguntas} />
    </main>
  );
}
