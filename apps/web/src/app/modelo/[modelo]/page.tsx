import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIAS, formatoEuros, MODELOS_WEB, jsonLdColeccion, nombreModelo, type IdModelo } from "@chollesla/core";
import { Faq } from "@/components/Faq";
import { Filtros } from "@/components/Filtros";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { TiraChollos } from "@/components/TiraChollos";
import { chollosDeModelo, chollosDeVersion, chollosDeVersionCategoria, formatoFecha, pagina, primeros, resumen, totalPaginas, ULTIMA_REVISION } from "@/datos/chollos";
import { HUBS_VERSION, IDS_HUBS_VERSION } from "@/lib/contenido";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...MODELOS_WEB.map((m) => ({ modelo: m.id })), ...IDS_HUBS_VERSION.map((id) => ({ modelo: id }))];
}

function modeloValido(id: string): IdModelo | null {
  return MODELOS_WEB.some((m) => m.id === id) ? (id as IdModelo) : null;
}

export async function generateMetadata({ params }: PageProps<"/modelo/[modelo]">): Promise<Metadata> {
  const { modelo } = await params;
  const hub = HUBS_VERSION[modelo];
  if (hub) {
    const n = chollosDeVersion(hub.version).length;
    return metaPagina({
      titulo: `Accesorios Tesla ${hub.nombre}: ${n.toLocaleString("es-ES")} chollos`,
      descripcion: `Accesorios para el ${hub.completo} con el precio final tras el código de descuento: alfombrillas, protectores de pantalla, carga, iluminación y más. Amazon, AliExpress y tiendas especializadas.`,
      ruta: `/modelo/${hub.version}`,
    });
  }
  const id = modeloValido(modelo);
  if (!id) return {};
  const n = chollosDeModelo(id).length;
  return metaPagina({
    titulo: `Accesorios para Tesla ${nombreModelo(id)}: ${n.toLocaleString("es-ES")} chollos`,
    descripcion: `Accesorios compatibles con el Tesla ${nombreModelo(id)} con el precio final tras el código de descuento: alfombrillas, fundas, cargadores, organizadores y más. Amazon, AliExpress y tiendas especializadas.`,
    ruta: `/modelo/${id}`,
  });
}

export default async function PaginaModelo({ params }: PageProps<"/modelo/[modelo]">) {
  const { modelo } = await params;
  const hub = HUBS_VERSION[modelo];
  if (hub) return <HubVersion id={hub.version} />;
  const id = modeloValido(modelo);
  if (!id) notFound();
  const lista = chollosDeModelo(id);
  const versiones = Object.values(HUBS_VERSION).filter((h) => h.modelo === id);
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <Migas migas={[{ nombre: `Tesla ${nombreModelo(id)}`, ruta: `/modelo/${id}` }]} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}/modelo/${id}`,
          nombre: `Accesorios para Tesla ${nombreModelo(id)}`,
          descripcion: `Chollos compatibles con el Tesla ${nombreModelo(id)}.`,
          elementos: primeros(lista, 24).map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Accesorios para Tesla {nombreModelo(id)}</h1>
        <p className="text-texto-suave">{lista.length.toLocaleString("es-ES")} chollos compatibles, incluidos los universales.</p>
        {versiones.length > 0 && (
          <p>
            ¿Tienes la versión nueva? Mira los accesorios específicos para{" "}
            {versiones.map((v, i) => (
              <span key={v.version}>
                {i > 0 && " o "}
                <Link href={`/modelo/${v.version}`} className="font-medium text-verde-boton hover:underline">
                  {v.nombre}
                </Link>
              </span>
            ))}
            .
          </p>
        )}
        <Filtros filtro={{ modelo: id }} />
      </section>
      <Rejilla chollos={pagina(lista, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(lista)} base={`/modelo/${id}`} prefijo={`/modelo/${id}`} />
    </main>
  );
}

function HubVersion({ id }: { id: string }) {
  const hub = HUBS_VERSION[id]!;
  const lista = chollosDeVersion(hub.version);
  const r = resumen(lista);
  const secciones = CATEGORIAS.filter((c) => c.id !== "otros").map((c) => ({ c, lista: chollosDeVersionCategoria(hub.version, c.id) })).filter((s) => s.lista.length >= 3);
  const ruta = `/modelo/${hub.version}`;
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas migas={[{ nombre: `Tesla ${nombreModelo(hub.modelo)}`, ruta: `/modelo/${hub.modelo}` }, { nombre: hub.nombre, ruta }]} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}${ruta}`,
          nombre: `Accesorios para ${hub.completo}`,
          descripcion: `Accesorios compatibles con el ${hub.completo}, con precio final tras el código de descuento.`,
          elementos: secciones.flatMap((s) => primeros(s.lista, 2)).map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />
      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Accesorios para {hub.completo}</h1>
        {hub.parrafos.map((p) => (
          <p key={p.slice(0, 30)} className="text-texto-suave">
            {p}
          </p>
        ))}
        <p>
          Hoy hay <strong>{r.total.toLocaleString("es-ES")}</strong> accesorios para el {hub.nombre}, desde{" "}
          <strong>{formatoEuros(r.minimo)}</strong> hasta <strong>{formatoEuros(r.maximo)}</strong>, en {r.tiendas.length} tiendas. Precios
          revisados el {formatoFecha(ULTIMA_REVISION)}.
        </p>
      </section>

      <nav aria-label={`Categorías para ${hub.nombre}`} className="flex flex-wrap gap-2">
        {secciones.map((s) => (
          <Link key={s.c.id} href={`/modelo/${hub.version}/${s.c.id}`} className="rounded-full border border-borde bg-superficie px-4 py-1.5 text-sm hover:border-verde-boton">
            {s.c.nombre} ({s.lista.length})
          </Link>
        ))}
      </nav>

      {secciones.map((s) => (
        <div key={s.c.id} className="flex flex-col gap-2">
          <TiraChollos titulo={`${s.c.nombre} para ${hub.nombre}`} etiqueta={`${s.c.nombre} para ${hub.nombre}`} lista={primeros(s.lista, 6)} />
          <Link href={`/modelo/${hub.version}/${s.c.id}`} className="w-fit text-sm font-medium text-verde-boton hover:underline">
            Ver las {s.lista.length} opciones de {s.c.nombre.toLowerCase()} para {hub.nombre} →
          </Link>
        </div>
      ))}

      <section className="flex max-w-3xl flex-col gap-2 text-texto-suave">
        <h2 className="text-2xl font-semibold text-texto">Más páginas útiles</h2>
        <p>
          Consulta los <Link href="/codigos-descuento" className="font-medium text-verde-boton hover:underline">códigos de descuento</Link> de cada tienda, los{" "}
          <Link href="/chollos-tesla-esta-semana" className="font-medium text-verde-boton hover:underline">chollos de esta semana</Link> o todos los{" "}
          <Link href={`/modelo/${hub.modelo}`} className="font-medium text-verde-boton hover:underline">accesorios para Tesla {nombreModelo(hub.modelo)}</Link>.
        </p>
      </section>

      <Faq preguntas={hub.preguntas} />
    </main>
  );
}
