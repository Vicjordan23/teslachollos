import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIAS, formatoEuros, jsonLdColeccion } from "@chollesla/core";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { TiraChollos } from "@/components/TiraChollos";
import { CHOLLOS, chollosDeVersion, chollosDeVersionCategoria, finalDe, formatoFecha, ordenar, primeros, resumen, ULTIMA_REVISION, type CholloOficial } from "@/datos/chollos";
import { fichaIndexable } from "@/datos/textos";
import { CONSEJOS_CATEGORIA, HUBS_VERSION } from "@/lib/contenido";
import { GUIA_POR_SLUG, GUIAS, type BloqueGuia, type Guia } from "@/lib/guias";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

/** Mínimo de productos para pintar un bloque: una fila de 1 o 2 productos no aporta. */
const MIN_BLOQUE = 3;
const POR_BLOQUE = 6;

function listaDelBloque(b: BloqueGuia): CholloOficial[] {
  let lista = b.version ? chollosDeVersion(b.version) : CHOLLOS;
  if (b.categoria) lista = lista.filter((c) => c.categoria === b.categoria);
  if (b.maxEuros) lista = lista.filter((c) => finalDe(c) <= b.maxEuros! * 100);
  return lista;
}

/** Prefiere fichas indexables (con texto propio); si hay pocas, usa todas. */
function seleccion(b: BloqueGuia): CholloOficial[] {
  const lista = listaDelBloque(b);
  const preferidas = lista.filter(fichaIndexable);
  return primeros(ordenar(preferidas.length >= MIN_BLOQUE ? preferidas : lista, b.orden ?? "destacados"), POR_BLOQUE);
}

function enlaceDelBloque(b: BloqueGuia, total: number): { href: string; texto: string } | null {
  const nombre = CATEGORIAS.find((c) => c.id === b.categoria)?.nombre.toLowerCase();
  if (b.version && b.categoria && total >= 8) return { href: `/modelo/${b.version}/${b.categoria}`, texto: `Ver las ${total} opciones de ${nombre}` };
  if (b.categoria) return { href: `/categoria/${b.categoria}`, texto: `Ver todas las opciones de ${nombre}` };
  if (b.version) return { href: `/modelo/${b.version}`, texto: "Ver todos los accesorios" };
  return null;
}

export async function generateMetadata({ params }: PageProps<"/guias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIA_POR_SLUG.get(slug);
  if (!g) return {};
  return metaPagina({ titulo: g.titulo, descripcion: g.descripcion, ruta: `/guias/${g.slug}` });
}

function JsonLdArticulo({ g }: { g: Guia }) {
  return (
    <JsonLd
      datos={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: g.h1,
        description: g.descripcion,
        inLanguage: "es-ES",
        dateModified: ULTIMA_REVISION,
        mainEntityOfPage: `${SITIO}/guias/${g.slug}`,
        author: { "@type": "Organization", name: "Chollesla", url: SITIO },
        publisher: { "@type": "Organization", name: "Chollesla", url: SITIO },
      }}
    />
  );
}

export default async function PaginaGuia({ params }: PageProps<"/guias/[slug]">) {
  const { slug } = await params;
  const g = GUIA_POR_SLUG.get(slug);
  if (!g) notFound();

  const bloques = g.bloques
    .map((b) => ({ b, total: listaDelBloque(b).length, lista: seleccion(b) }))
    .filter((x) => x.lista.length >= MIN_BLOQUE);
  const base = g.version ? chollosDeVersion(g.version) : bloques[0] ? listaDelBloque(bloques[0].b) : CHOLLOS;
  const r = resumen(base);
  const hub = g.version ? HUBS_VERSION[g.version] : undefined;
  const otras = GUIAS.filter((x) => x.slug !== g.slug).slice(0, 4);

  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas migas={[{ nombre: "Guías de compra", ruta: "/guias" }, { nombre: g.h1, ruta: `/guias/${g.slug}` }]} />
      <JsonLdArticulo g={g} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}/guias/${g.slug}`,
          nombre: g.h1,
          descripcion: g.descripcion,
          elementos: bloques.flatMap((x) => primeros(x.lista, 3)).map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />

      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{g.h1}</h1>
        {g.intro.map((p) => (
          <p key={p.slice(0, 30)} className="text-texto-suave">
            {p}
          </p>
        ))}
        <p>
          En el catálogo hay ahora <strong>{r.total.toLocaleString("es-ES")}</strong> productos relacionados, desde{" "}
          <strong>{formatoEuros(r.minimo)}</strong> hasta <strong>{formatoEuros(r.maximo)}</strong>, en {r.tiendas.length} tiendas. Precios revisados el{" "}
          {formatoFecha(ULTIMA_REVISION)}.
        </p>
      </section>

      <section className="flex max-w-3xl flex-col gap-2">
        <h2 className="text-2xl font-semibold">Qué mirar antes de comprar</h2>
        <ul className="list-disc space-y-1 pl-5 text-texto-suave">
          {g.comoElegir.map((t) => (
            <li key={t.slice(0, 30)}>{t}</li>
          ))}
        </ul>
      </section>

      {bloques.map(({ b, total, lista }) => {
        const enlace = enlaceDelBloque(b, total);
        const consejo = b.texto ?? (b.categoria ? CONSEJOS_CATEGORIA[b.categoria] : undefined);
        return (
          <div key={b.titulo} className="flex flex-col gap-2">
            <TiraChollos titulo={b.titulo} etiqueta={b.titulo} lista={lista} />
            {consejo && <p className="max-w-3xl text-sm text-texto-suave">{consejo}</p>}
            {enlace && (
              <Link href={enlace.href} className="w-fit text-sm font-medium text-verde-boton hover:underline">
                {enlace.texto} →
              </Link>
            )}
          </div>
        );
      })}

      <section className="flex max-w-3xl flex-col gap-2 text-texto-suave">
        <h2 className="text-2xl font-semibold text-texto">Sigue leyendo</h2>
        <ul className="list-disc space-y-1 pl-5">
          {hub && (
            <li>
              <Link href={`/modelo/${hub.version}`} className="font-medium text-verde-boton hover:underline">
                Todos los accesorios para {hub.completo}
              </Link>
            </li>
          )}
          <li>
            <Link href="/codigos-descuento" className="font-medium text-verde-boton hover:underline">
              Códigos de descuento de cada tienda
            </Link>
          </li>
          <li>
            <Link href="/chollos-tesla-esta-semana" className="font-medium text-verde-boton hover:underline">
              Chollos Tesla de esta semana
            </Link>
          </li>
          {otras.map((o) => (
            <li key={o.slug}>
              <Link href={`/guias/${o.slug}`} className="font-medium text-verde-boton hover:underline">
                {o.h1}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Faq preguntas={g.preguntas} />
    </main>
  );
}
