import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TIENDAS, formatoEuros, jsonLdColeccion, porcentajeAhorro, type IdTienda } from "@chollesla/core";
import { CopiarCodigo } from "@/components/AccionesChollo";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { Rejilla } from "@/components/Rejilla";
import { ahorroDe, chollosDeTienda, finalDe, formatoFecha, primeros, resumen, ULTIMA_REVISION } from "@/datos/chollos";
import { CODIGOS, IDS_CODIGOS } from "@/lib/contenido";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

export const dynamicParams = false;

export function generateStaticParams() {
  return IDS_CODIGOS.map((tienda) => ({ tienda }));
}

function valida(id: string): IdTienda | null {
  return IDS_CODIGOS.includes(id as IdTienda) ? (id as IdTienda) : null;
}

export async function generateMetadata({ params }: PageProps<"/codigos-descuento/[tienda]">): Promise<Metadata> {
  const id = valida((await params).tienda);
  if (!id) return {};
  const t = TIENDAS[id];
  const pct = Math.round(t.descuento * 100);
  return metaPagina({
    titulo: `Código descuento ${t.nombre} ${t.codigo}: ${pct} % en accesorios Tesla`,
    descripcion: `Código ${t.codigo} de ${t.nombre}: ${pct} % de descuento en accesorios para Tesla Model 3 y Model Y. ${chollosDeTienda(id).length} productos con el precio final ya calculado.`,
    ruta: `/codigos-descuento/${id}`,
  });
}

export default async function CodigoTienda({ params }: PageProps<"/codigos-descuento/[tienda]">) {
  const id = valida((await params).tienda);
  if (!id) notFound();
  const t = TIENDAS[id];
  const info = CODIGOS[id]!;
  const pct = Math.round(t.descuento * 100);
  const lista = chollosDeTienda(id);
  const res = resumen(lista);
  const top = [...lista].sort((a, b) => ahorroDe(b) - ahorroDe(a) || finalDe(b) - finalDe(a));
  // Ejemplo real: un producto de precio medio del catálogo de la tienda.
  const ordenados = [...lista].sort((a, b) => a.precioTienda - b.precioTienda);
  const ejemplo = ordenados[Math.floor(ordenados.length / 2)];
  const ruta = `/codigos-descuento/${id}`;
  const preguntas = [
    {
      pregunta: `¿Cuál es el código de descuento de ${t.nombre}?`,
      respuesta: `El código es ${t.codigo} y da un ${pct} % de descuento. Los precios de Chollesla ya lo incluyen.`,
    },
    {
      pregunta: `¿Cómo se usa el código ${t.codigo}?`,
      respuesta: `Entra en la tienda desde cualquier chollo de ${t.nombre} de Chollesla y, si el carrito te lo pide, escribe ${t.codigo} en el campo de código de descuento. Comprueba que el total coincide con el precio final que ves aquí.`,
    },
    {
      pregunta: `¿Cuántos productos de ${t.nombre} hay en Chollesla?`,
      respuesta: `${lista.length} accesorios para Tesla, desde ${formatoEuros(res.minimo)} hasta ${formatoEuros(res.maximo)} con el código aplicado (revisados el ${formatoFecha(ULTIMA_REVISION)}).`,
    },
    {
      pregunta: "¿Puedo juntar el código con otras ofertas?",
      respuesta: "Depende de la tienda y no lo controlamos. Muchas tiendas solo admiten un código por pedido. Mira el total en el carrito antes de pagar.",
    },
  ];
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas migas={[{ nombre: "Códigos de descuento", ruta: "/codigos-descuento" }, { nombre: t.nombre, ruta }]} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}${ruta}`,
          nombre: `Accesorios Tesla de ${t.nombre} con el código ${t.codigo}`,
          descripcion: `Accesorios de ${t.nombre} con el precio final tras el código ${t.codigo}.`,
          elementos: primeros(top, 24).map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />
      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Código descuento {t.nombre}: {pct} % en accesorios Tesla
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <CopiarCodigo codigo={t.codigo!} grande />
          <span className="text-texto-suave">{pct} % de descuento</span>
        </div>
        <p className="text-texto-suave">{info.como}</p>
        {ejemplo && (
          <p className="text-texto-suave">
            Ejemplo real:{" "}
            <Link href={`/chollo/${ejemplo.slug}`} className="font-medium text-verde-boton hover:underline">
              {ejemplo.titulo}
            </Link>{" "}
            cuesta {formatoEuros(ejemplo.precioTienda)} en la tienda y <strong>{formatoEuros(finalDe(ejemplo))}</strong> con el código (
            {porcentajeAhorro(finalDe(ejemplo), ejemplo.precioTienda)} % menos), precio revisado el {formatoFecha(ejemplo.fecha)}.
          </p>
        )}
        <p className="text-texto-suave">{info.aviso}</p>
        <p>
          Hoy hay <strong>{lista.length}</strong> accesorios de {t.nombre} en Chollesla, de {formatoEuros(res.minimo)} a {formatoEuros(res.maximo)}. Mira
          también{" "}
          <Link href="/codigos-descuento" className="font-medium text-verde-boton hover:underline">
            los códigos de las demás tiendas
          </Link>{" "}
          o{" "}
          <Link href="/chollos-tesla-esta-semana" className="font-medium text-verde-boton hover:underline">
            los chollos de esta semana
          </Link>
          .
        </p>
      </section>
      <h2 className="text-2xl font-semibold">Accesorios de {t.nombre} con el código aplicado</h2>
      <Rejilla chollos={primeros(top, 24)} prioridad={3} />
      <p>
        <Link href={`/tienda/${id}`} className="font-medium text-verde-boton hover:underline">
          Ver todos los accesorios de {t.nombre} ({lista.length}) →
        </Link>
      </p>
      <Faq preguntas={preguntas} />
    </main>
  );
}
