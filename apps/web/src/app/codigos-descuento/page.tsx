import type { Metadata } from "next";
import Link from "next/link";
import { TIENDAS } from "@chollesla/core";
import { CopiarCodigo } from "@/components/AccionesChollo";
import { Faq } from "@/components/Faq";
import { Migas } from "@/components/Migas";
import { chollosDeTienda, formatoFecha, ULTIMA_REVISION } from "@/datos/chollos";
import { CODIGOS, IDS_CODIGOS } from "@/lib/contenido";
import { metaPagina } from "@/lib/seo";

const PREGUNTAS = [
  {
    pregunta: "¿Qué códigos de descuento hay para accesorios Tesla?",
    respuesta: `Los que usa Chollesla: ${IDS_CODIGOS.map((t) => `${TIENDAS[t].nombre} ${Math.round(TIENDAS[t].descuento * 100)} % con ${TIENDAS[t].codigo}`).join("; ")}. Amazon, AliExpress y Temu no tienen código: sus precios son los de la tienda.`,
  },
  {
    pregunta: "¿Tengo que escribir el código yo?",
    respuesta:
      "Los precios de Chollesla ya llevan el descuento aplicado. Si al pagar la tienda te pide el código, cópialo desde la ficha y pégalo en el campo de código de descuento del carrito. Comprueba que el importe final coincide antes de pagar.",
  },
  {
    pregunta: "¿Los códigos caducan?",
    respuesta: `Son códigos de las tiendas y pueden cambiar o retirarse sin aviso. Revisamos los precios con frecuencia (última revisión: ${formatoFecha(ULTIMA_REVISION)}), pero la tienda manda: confirma el descuento en el carrito.`,
  },
  {
    pregunta: "¿Cuesta algo más usar estos códigos o enlaces?",
    respuesta: "No. Los enlaces son de afiliado: Chollesla puede recibir una comisión de la tienda si compras, sin coste extra para ti.",
  },
];

export const metadata: Metadata = metaPagina({
  titulo: "Códigos de descuento para accesorios Tesla: Hansshow, Jowua, Tesery y EVDANCE",
  descripcion:
    "Códigos de descuento en Chollesla para accesorios Tesla: Hansshow 20 % (VICTOR), EVDANCE 20 % (EVEU20), Jowua y Tesery 5 % (ACCESORIOSTESLA). Precios ya con el código aplicado.",
  ruta: "/codigos-descuento",
});

export default function CodigosDescuento() {
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas migas={[{ nombre: "Códigos de descuento", ruta: "/codigos-descuento" }]} />
      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Códigos de descuento para accesorios Tesla</h1>
        <p className="text-texto-suave">
          Estas son las tiendas de accesorios para Tesla Model 3 y Model Y con las que trabaja Chollesla y el código de descuento de cada una. En todos los
          chollos de la web el precio que ves es el <strong>precio final</strong>, con el código ya aplicado, así que no tienes que calcular nada: solo
          comprobar en el carrito que la tienda lo reconoce.
        </p>
        <p className="text-texto-suave">
          Elige una tienda para ver su código, cómo se usa, un ejemplo con un producto real y sus accesorios con más descuento. Amazon.es, AliExpress y Temu no
          tienen código: sus precios son los que publica la tienda. Última revisión de precios: {formatoFecha(ULTIMA_REVISION)}.
        </p>
      </section>

      <ul className="grid gap-4 md:grid-cols-2">
        {IDS_CODIGOS.map((id) => {
          const t = TIENDAS[id];
          return (
            <li key={id} className="flex flex-col gap-2 rounded-2xl border border-tarjeta-borde bg-tarjeta p-4">
              <h2 className="text-xl font-semibold">
                <Link href={`/codigos-descuento/${id}`} className="hover:underline">
                  Código {t.nombre}: {Math.round(t.descuento * 100)} % de descuento
                </Link>
              </h2>
              <p className="text-texto-suave">{CODIGOS[id]!.como}</p>
              <div className="flex flex-wrap items-center gap-3">
                <CopiarCodigo codigo={t.codigo!} />
                <span className="text-sm text-texto-suave">{chollosDeTienda(id).length} accesorios con el código aplicado</span>
              </div>
              <Link href={`/codigos-descuento/${id}`} className="w-fit text-sm font-medium text-verde-boton hover:underline">
                Ver los chollos de {t.nombre} →
              </Link>
            </li>
          );
        })}
      </ul>

      <Faq preguntas={PREGUNTAS} />
    </main>
  );
}
