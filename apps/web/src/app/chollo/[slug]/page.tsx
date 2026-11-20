import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aplicarAfiliado, avisoAfiliado, formatoEuros, precioFinal, TIENDAS } from "@chollesla/core";
import { CHOLLOS, cholloPorSlug, formatoFecha } from "@/datos/chollos";
import { SITIO } from "@/lib/sitio";

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
  const aviso = avisoAfiliado(c.tienda);

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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="text-sm opacity-70">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        ›{" "}
        <Link href={`/tienda/${t.id}`} className="hover:underline">
          {t.nombre}
        </Link>
      </nav>

      <article className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-rojo bg-white">
          <Image src={c.foto} alt={c.titulo} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6" />
          <span className="absolute left-3 top-3 rounded-full bg-rojo px-3 py-0.5 text-sm font-medium text-white">
            Chollo oficial
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium opacity-70">{t.nombre}</p>
          <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">{c.titulo}</h1>
          <p className="opacity-70">{c.modelos}</p>
          {c.descripcion && <p className="text-lg opacity-90">{c.descripcion}</p>}

          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-4xl font-semibold text-rojo">
              {c.desde && <span className="text-xl font-medium">Desde </span>}
              {formatoEuros(final)}
            </p>
            {final < c.precioTienda && <p className="line-through opacity-60">{formatoEuros(c.precioTienda)}</p>}
          </div>
          {t.codigo && (
            <p>
              Con el código <strong className="rounded bg-rojo/10 px-1.5 py-0.5 font-semibold text-rojo">{t.codigo}</strong> en{" "}
              {t.nombre}
            </p>
          )}
          <p className="text-sm opacity-60">Precio del {formatoFecha(c.fecha)}; puede variar.</p>
          {c.tienda === "evdance" && (
            <p className="text-sm opacity-80">Ojo: EVDANCE envía desde la UE y cobra gastos de envío a España.</p>
          )}

          {enlace.estado === "ok" && (
            <a
              href={enlace.url}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="mt-2 w-fit rounded-full bg-negro px-6 py-3 text-lg font-medium text-white dark:bg-white dark:text-negro"
            >
              Ir al chollo en {t.nombre}
            </a>
          )}
          {aviso && <p className="text-xs opacity-60">{aviso}</p>}
        </div>
      </article>
    </main>
  );
}
