import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aplicarAfiliado, formatoEuros, nombreCategoria, porcentajeAhorro, precioFinal, TIENDAS } from "@chollesla/core";
import { CompartirFicha, CopiarCodigo } from "@/components/AccionesChollo";
import { AvisoPrecio } from "@/components/AvisoPrecio";
import { CHOLLOS, cholloPorSlug, chollosDeCategoria, formatoFecha } from "@/datos/chollos";
import { Guardar, Temperatura } from "@/components/Interacciones";
import { Reportar } from "@/components/Reportar";
import { atributosSalida, enlaceSalida } from "@/lib/salida";
import { EtiquetasModelo } from "@/components/EtiquetasModelo";
import { SITIO } from "@/lib/sitio";
import { acortar } from "@/lib/seo";
import { TiraChollos } from "@/components/TiraChollos";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CHOLLOS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chollo/[slug]">): Promise<Metadata> {
  const c = cholloPorSlug((await params).slug);
  if (!c) return {};
  const t = TIENDAS[c.tienda];
  const final = precioFinal(c.precioTienda, c.tienda);
  const precio = formatoEuros(final);
  const ahorro = porcentajeAhorro(final, c.precioTienda);
  const titulo = `${acortar(c.titulo, 46)} por ${precio}`;
  const descripcion = acortar(
    `${acortar(c.titulo, 70)}: ${precio}${ahorro > 0 ? ` (-${ahorro} %)` : ""} con el precio final ya calculado${t.codigo ? ` usando el código ${t.codigo}` : ""} en ${t.nombre}. Compatible con ${acortar(c.modelos, 45)}.`,
    158,
  );
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/chollo/${c.slug}` },
    openGraph: { title: titulo, description: descripcion, url: `/chollo/${c.slug}`, images: [c.foto], type: "website" },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: [c.foto] },
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
    url: `${SITIO}/chollo/${c.slug}`,
    description: c.descripcion || undefined,
    category: nombreCategoria(c.categoria),
    image: [c.foto],
    offers: {
      "@type": "Offer",
      price: (final / 100).toFixed(2),
      priceCurrency: "EUR",
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITIO}/chollo/${c.slug}`,
      seller: { "@type": "Organization", name: t.nombre },
    },
  };

  const migas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITIO },
      { "@type": "ListItem", position: 2, name: nombreCategoria(c.categoria), item: `${SITIO}/categoria/${c.categoria}` },
      { "@type": "ListItem", position: 3, name: acortar(c.titulo, 80), item: `${SITIO}/chollo/${c.slug}` },
    ],
  };
  const relacionados = chollosDeCategoria(c.categoria).filter((x) => x.slug !== c.slug).slice(0, 6);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(migas).replace(/</g, "\\u003c") }} />
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
            <div className="flex flex-col gap-1.5">
              <p>
                Precio con el cupón de descuento de {t.nombre}. Si la tienda te lo pide al pagar, cópialo y pégalo:
              </p>
              <div>
                <CopiarCodigo codigo={t.codigo} grande />
              </div>
            </div>
          )}
          <p className="text-sm text-texto-suave">Precio revisado el {formatoFecha(c.fecha)}; puede variar.</p>
          <AvisoPrecio fecha={c.fecha} className="w-fit" />
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
          <CompartirFicha ruta={`/chollo/${c.slug}`} titulo={c.titulo} />
          <Reportar slug={c.slug} />
        </div>
      </article>
      <TiraChollos titulo={`Más ${nombreCategoria(c.categoria).toLowerCase()} para tu Tesla`} etiqueta="Chollos relacionados" lista={relacionados} />
    </main>
  );
}
