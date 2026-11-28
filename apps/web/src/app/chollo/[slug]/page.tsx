import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { acortarSinPuntos, aplicarAfiliado, formatoEuros, jsonLdMigas, nombreCategoria, nombreVersion, porcentajeAhorro, precioFinal, TIENDAS, versionesDe, VERSIONES } from "@chollesla/core";
import { CompartirFicha, CopiarCodigo } from "@/components/AccionesChollo";
import { AvisoPrecio } from "@/components/AvisoPrecio";
import { AvisoTelegram } from "@/components/AvisoTelegram";
import { CHOLLOS, cholloPorSlug, chollosDeCategoria, formatoFecha } from "@/datos/chollos";
import { fichaIndexable, textoDe, textoPropio } from "@/datos/textos";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { HUBS_VERSION } from "@/lib/contenido";
import { Guardar, Temperatura } from "@/components/Interacciones";
import { Reportar } from "@/components/Reportar";
import { atributosSalida, enlaceSalida } from "@/lib/salida";
import { EtiquetasModelo } from "@/components/EtiquetasModelo";
import { SITIO } from "@/lib/sitio";
import { acortar, metaPagina } from "@/lib/seo";
import { TiraChollos } from "@/components/TiraChollos";
import { FichaRetirada } from "@/components/FichaRetirada";
import { retiradoPorSlug, RETIRADOS } from "@/datos/retirados";

// Solo existen las rutas generadas en el build; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...CHOLLOS, ...RETIRADOS].map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chollo/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = cholloPorSlug(slug);
  if (!c) {
    const r = retiradoPorSlug(slug);
    if (!r) return {};
    return metaPagina({
      titulo: `${acortarSinPuntos(r.titulo, 40)}: ya no disponible, alternativas`,
      descripcion: acortar(`${acortar(r.titulo, 70)} ya no está disponible. Mira alternativas parecidas para tu Tesla con el precio final calculado.`, 158),
      ruta: `/chollo/${r.slug}`,
      imagen: r.foto,
      noindex: !r.conservar,
    });
  }
  const t = TIENDAS[c.tienda];
  const final = precioFinal(c.precioTienda, c.tienda);
  const precio = formatoEuros(final);
  const ahorro = porcentajeAhorro(final, c.precioTienda);
  const titulo = `${acortarSinPuntos(c.titulo, 52)} por ${precio}`;
  const descripcion = acortar(
    `${acortar(c.titulo, 70)}: ${precio}${ahorro > 0 ? ` (-${ahorro} %)` : ""} con el precio final ya calculado${t.codigo ? ` usando el código ${t.codigo}` : ""} en ${t.nombre}. Compatible con ${acortar(c.modelos, 45)}.`,
    158,
  );
  return metaPagina({ titulo, descripcion, ruta: `/chollo/${c.slug}`, imagen: c.foto, noindex: !fichaIndexable(c), producto: true });
}

export default async function FichaChollo({ params }: PageProps<"/chollo/[slug]">) {
  const { slug } = await params;
  const c = cholloPorSlug(slug);
  if (!c) {
    const r = retiradoPorSlug(slug);
    if (!r) notFound();
    return <FichaRetirada r={r} />;
  }
  const t = TIENDAS[c.tienda];
  const final = precioFinal(c.precioTienda, c.tienda);
  const enlace = aplicarAfiliado(c.enlace);
  const salida = enlaceSalida(c.slug, enlace, c.enlaceAfiliado);
  const ahorro = porcentajeAhorro(final, c.precioTienda);

  const texto = textoDe(c);
  const propio = textoPropio(c.slug);
  const compatibles = versionesDe(c.modelos);
  // Datos estructurados de producto: sin valoraciones ni opiniones (regla de Vic: nada inventado).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.titulo,
    url: `${SITIO}/chollo/${c.slug}`,
    description: texto.resumen,
    ...(compatibles.length > 0 && compatibles.length < VERSIONES.length
      ? { isAccessoryOrSparePartFor: compatibles.map((v) => ({ "@type": "Product", name: `Tesla ${nombreVersion(v)}` })) }
      : {}),
    category: nombreCategoria(c.categoria),
    sku: c.id,
    // Marca solo si la tienda vende producto propio; en Amazon/AliExpress no se conoce y no se inventa.
    ...(["hansshow", "jowua", "tesery", "yeslak"].includes(c.tienda) ? { brand: { "@type": "Brand", name: t.nombre } } : {}),
    image: [c.foto],
    offers: {
      "@type": "Offer",
      price: (final / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.parse(c.fecha) + 14 * 86_400_000).toISOString().slice(0, 10),
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITIO}/chollo/${c.slug}`,
      seller: { "@type": "Organization", name: t.nombre },
    },
  };

  const migas = jsonLdMigas([
    { nombre: "Inicio", url: SITIO },
    { nombre: nombreCategoria(c.categoria), url: `${SITIO}/categoria/${c.categoria}` },
    { nombre: acortar(c.titulo, 80), url: `${SITIO}/chollo/${c.slug}` },
  ]);
  const hubsCompatibles = Object.values(HUBS_VERSION).filter((h) => compatibles.includes(h.version) && compatibles.length < VERSIONES.length);
  const relacionados = chollosDeCategoria(c.categoria).filter((x) => x.slug !== c.slug).slice(0, 6);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <JsonLd datos={jsonLd} />
      <JsonLd datos={migas} />
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
          {c.tienda === "temu" && (
            <p className="text-sm text-texto-suave">Ojo: en Temu elige la variante correcta para tu Tesla y revisa el envío en la ficha antes de pagar.</p>
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
      <AvisoTelegram />
      {propio.length > 0 && (
        <section aria-label="Antes de comprar este modelo" className="flex max-w-3xl flex-col gap-2">
          <h2 className="text-2xl font-semibold">Antes de comprar este modelo</h2>
          {propio.map((p) => (
            <p key={p} className="text-texto-suave">
              {p}
            </p>
          ))}
        </section>
      )}
      <section aria-label="Datos del chollo" className="flex max-w-3xl flex-col gap-3">
        <h2 className="text-2xl font-semibold">Datos de este chollo</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-texto-suave">
          <dt className="font-medium text-texto">Tienda</dt>
          <dd>{t.nombre}</dd>
          <dt className="font-medium text-texto">Precio en la tienda</dt>
          <dd>{formatoEuros(c.precioTienda)}</dd>
          {t.codigo && (
            <>
              <dt className="font-medium text-texto">Código de descuento</dt>
              <dd>
                {t.codigo} ({Math.round(t.descuento * 100)} %){" "}
                <Link href={`/codigos-descuento/${c.tienda}`} className="text-verde-boton hover:underline">
                  cómo usarlo
                </Link>
              </dd>
            </>
          )}
          <dt className="font-medium text-texto">Precio final</dt>
          <dd>
            {c.desde ? "Desde " : ""}
            {formatoEuros(final)}
          </dd>
          <dt className="font-medium text-texto">Categoría</dt>
          <dd>
            <Link href={`/categoria/${c.categoria}`} className="text-verde-boton hover:underline">
              {nombreCategoria(c.categoria)}
            </Link>
          </dd>
          <dt className="font-medium text-texto">Compatible con</dt>
          <dd>
            {c.modelos}
            {hubsCompatibles.length > 0 && (
              <>
                {" · "}
                {hubsCompatibles.map((h, i) => (
                  <span key={h.version}>
                    {i > 0 && ", "}
                    <Link href={`/modelo/${h.version}`} className="text-verde-boton hover:underline">
                      más para {h.nombre}
                    </Link>
                  </span>
                ))}
              </>
            )}
          </dd>
          <dt className="font-medium text-texto">Precio revisado</dt>
          <dd>{formatoFecha(c.fecha)}</dd>
        </dl>
        <p className="text-texto-suave">
          El precio final es el de la tienda con el código de descuento ya aplicado. Antes de pagar, confirma en la tienda el año y la versión de tu coche: los
          accesorios a medida cambian entre generaciones.
        </p>
      </section>
      <section aria-label="Información de Chollesla sobre este producto" className="flex max-w-3xl flex-col gap-4">
        <h2 className="text-2xl font-semibold">Qué debes saber antes de comprarlo</h2>
        {texto.secciones.map((s) => (
          <div key={s.id} className="flex flex-col gap-1.5">
            {s.id !== "resumen" && <h3 className="text-lg font-semibold">{s.titulo}</h3>}
            {s.parrafos.map((p) => (
              <p key={p} className="text-texto-suave">
                {p}
              </p>
            ))}
            {s.puntos.length > 0 && (
              <ul className="list-disc pl-5 text-texto-suave">
                {s.puntos.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p className="text-sm text-texto-suave">Los datos salen del catálogo de Chollesla (título, compatibilidad y precio de la tienda); no son una valoración del producto.</p>
      </section>
      {c.categoria === "alfombrillas" && /maletero|frunk|trunk|cofre/i.test(c.titulo) && (
        <p className="max-w-3xl text-texto-suave">
          ¿Dudas con la zona de carga? Mira la{" "}
          <Link href="/guias/alfombrillas-de-maletero-tesla" className="font-medium text-verde-boton hover:underline">
            guía de alfombrillas de maletero para Tesla
          </Link>
          .
        </p>
      )}
      <div className="max-w-3xl">
        <Faq preguntas={texto.faq} titulo="Preguntas frecuentes sobre este producto" />
      </div>
      <TiraChollos titulo={`Más ${nombreCategoria(c.categoria).toLowerCase()} para tu Tesla`} etiqueta="Chollos relacionados" lista={relacionados} />
    </main>
  );
}
