import type { Metadata } from "next";
import Link from "next/link";
import { jsonLdColeccion } from "@chollesla/core";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { GUIAS } from "@/lib/guias";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = metaPagina({
  titulo: "Guías de compra de accesorios Tesla Model 3 y Model Y",
  descripcion:
    "Guías para elegir accesorios para Tesla Model 3 Highland y Model Y Juniper: alfombrillas, carga, pantalla, organizadores y más, con el precio final y qué comprobar antes de comprar.",
  ruta: "/guias",
});

export default function IndiceGuias() {
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas migas={[{ nombre: "Guías de compra", ruta: "/guias" }]} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}/guias`,
          nombre: "Guías de compra de accesorios Tesla",
          descripcion: "Guías para elegir accesorios para Tesla Model 3 y Model Y.",
          elementos: GUIAS.map((g) => ({ nombre: g.h1, url: `${SITIO}/guias/${g.slug}` })),
        })}
      />
      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Guías de compra de accesorios Tesla</h1>
        <p className="text-texto-suave">
          Qué mirar antes de comprar, qué encaja con tu versión del Model 3 o del Model Y y opciones con el precio final tras el código de descuento. Sin
          puntuaciones inventadas: solo consejos de compra y productos reales del catálogo.
        </p>
      </section>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIAS.map((g) => (
          <li key={g.slug}>
            <Link href={`/guias/${g.slug}`} className="flex h-full flex-col gap-2 rounded-xl border border-tarjeta-borde bg-tarjeta p-4 hover:border-verde-boton">
              <span className="text-lg font-semibold">{g.h1}</span>
              <span className="text-sm text-texto-suave">{g.resumen}</span>
              <span className="mt-auto text-sm font-medium text-verde-boton">Leer la guía →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
