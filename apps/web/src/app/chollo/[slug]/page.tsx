import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aplicarAfiliado, formatoEuros, nombreCategoria, porcentajeAhorro, precioFinal, TIENDAS } from "@chollesla/core";
import { CHOLLOS, cholloPorSlug, formatoFecha } from "@/datos/chollos";
import { Guardar, Temperatura } from "@/components/Interacciones";
import { Reportar } from "@/components/Reportar";
import { atributosSalida, enlaceSalida } from "@/lib/salida";
import { EtiquetasModelo } from "@/components/EtiquetasModelo";
import { SITIO } from "@/lib/sitio";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CHOLLOS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chollo/[slug]">): Promise<Metadata> {
  const c = cholloPorSlug((await params).slug);
  if (!c) return {};
  const t = TIENDAS[c.tienda];
  const precio = formatoEuros(precioFinal(c.precioTienda, c.tienda));
  return {
    title: `${c.titulo} por ${precio}`,
    description: `${c.descripcion} ${t.codigo ? `Precio con el código ${t.codigo} en ${t.nombre}.` : `En ${t.nombre}.`}`.trim(),
    alternates: { canonical: `/chollo/${c.slug}` },
    openGraph: { title: `${c.titulo} por ${precio}`, images: [c.foto], type: "website" },
  };
}

export default async function FichaChollo({ params }: PageProps<"/chollo/[slug]">) {
  const c = cholloPorSlug((await params).slug);
  if (!c) notFound();
  const t = TIENDAS[c.tienda];
  const final = precioFinal(c.precioTienda, c.tienda);
  const enlace = aplicarAfiliado(c.enlace);
  const salida = enlaceSalida(c.slug, enlace, c.enlaceAfiliado);
  const ahorro = porcentajeAhorro(final, c.precioTienda);

  // Datos estructurados de producto: sin valoraciones ni opiniones (regla de Vic: nada inventado).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.titulo,
    description: c.descripcion || undefined,
    image: [c.foto],
    offers: {
      "@type": "Offer",
      price: (final / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITIO}/chollo/${c.slug}`,
      seller: { "@type": "Organization", name: t.nombre },
    },
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="text-sm text-texto-suave">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        ›{" "}
        <Link href={`/categoria/${c.categoria}`} className="hover:underline">
          {nombreCategoria(c.categoria)}
        </Link>
      </nav>

      <article className="grid gap-6 rounded-2xl border border-tarjeta-borde bg-tarjeta p-4 sm:p-6 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
          <Image src={c.foto} alt={c.titulo} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6" />
          <span className="absolute left-3 top-3 rounded-full bg-verde-claro px-3 py-0.5 text-sm font-medium text-verde">Oficial</span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-texto-suave">{t.nombre}</p>
            <div className="flex items-center gap-3">
              <Temperatura slug={c.slug} />
              <Guardar slug={c.slug} claro />
            </div>
          </div>
          <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">{c.titulo}</h1>
          <p className="text-texto-suave">{c.modelos}</p>
          <EtiquetasModelo modelos={c.modelos} />
          {c.descripcion && <p className="text-lg text-texto">{c.descripcion}</p>}

          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-4xl font-semibold text-verde">
              {c.desde && <span className="text-xl font-medium">Desde </span>}
              {formatoEuros(final)}
            </p>
            {final < c.precioTienda && <p className="line-through text-texto-suave">{formatoEuros(c.precioTienda)}</p>}
            {ahorro > 0 && <span className="rounded-md bg-verde-claro px-2 text-sm font-medium text-verde">-{ahorro} %</span>}
          </div>
          {t.codigo && (
            <p>
              Con el código <strong className="rounded bg-verde-claro px-1.5 py-0.5 font-semibold text-verde">{t.codigo}</strong> en{" "}
              {t.nombre}
            </p>
          )}
          <p className="text-sm text-texto-suave">Precio del {formatoFecha(c.fecha)}; puede variar.</p>
          {c.tienda === "evdance" && (
            <p className="text-sm text-texto-suave">Ojo: EVDANCE envía desde la UE y cobra gastos de envío a España.</p>
          )}

          {salida && (
            <a
              href={salida}
              rel="sponsored nofollow noopener"
              target="_blank"
              {...atributosSalida(c.slug, c.titulo, c.tienda, salida)}
              className="mt-2 w-fit rounded-full bg-verde-boton px-6 py-3 text-lg font-medium text-white hover:bg-verde-boton-hover"
            >
              Ir al chollo en {t.nombre}
            </a>
          )}
          <Reportar slug={c.slug} />
        </div>
      </article>
    </main>
  );
}
