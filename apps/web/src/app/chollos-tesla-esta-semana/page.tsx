import type { Metadata } from "next";
import Link from "next/link";
import { jsonLdColeccion } from "@chollesla/core";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { Rejilla } from "@/components/Rejilla";
import { ahorroDe, CHOLLOS, finalDe, formatoFecha, primeros, ULTIMA_REVISION } from "@/datos/chollos";
import { metaPagina } from "@/lib/seo";
import { SITIO } from "@/lib/sitio";

const DIAS = 7;
const desde = new Date(Date.parse(ULTIMA_REVISION) - DIAS * 86_400_000).toISOString().slice(0, 10);
/** Solo productos con el precio revisado en los últimos 7 días. */
const recientes = CHOLLOS.filter((c) => c.fecha >= desde);
const MAS_DESCUENTO = primeros(
  recientes.filter((c) => ahorroDe(c) > 0).sort((a, b) => ahorroDe(b) - ahorroDe(a) || finalDe(b) - finalDe(a)),
  18,
);
const BARATOS = primeros(
  recientes.filter((c) => finalDe(c) <= 2000).sort((a, b) => ahorroDe(b) - ahorroDe(a) || finalDe(a) - finalDe(b)),
  18,
);
const MAX_DTO = MAS_DESCUENTO[0] ? ahorroDe(MAS_DESCUENTO[0]) : 0;

export const metadata: Metadata = metaPagina({
  titulo: `Chollos Tesla esta semana: accesorios con más descuento (${formatoFecha(ULTIMA_REVISION)})`,
  descripcion: `Los accesorios para Tesla Model 3 y Model Y con más descuento esta semana y los de menos de 20 €, con el precio final tras el código. Precios revisados el ${formatoFecha(ULTIMA_REVISION)}.`,
  ruta: "/chollos-tesla-esta-semana",
});

const PREGUNTAS = [
  {
    pregunta: "¿Cómo se eligen los chollos de la semana?",
    respuesta: `Solo entran productos cuyo precio se ha revisado en los últimos ${DIAS} días. Los ordenamos por el descuento real que da el código de la tienda y, aparte, enseñamos los de menos de 20 € con más descuento. No inventamos ofertas relámpago ni cuentas atrás.`,
  },
  {
    pregunta: "¿Qué descuento es el que se muestra?",
    respuesta:
      "Es la diferencia entre el precio de la tienda y el precio final tras el código de descuento (por ejemplo Hansshow 20 % o Jowua 5 %). Amazon y AliExpress no tienen código, por eso no aparecen entre los mayores descuentos.",
  },
  {
    pregunta: "¿Cada cuánto se actualiza esta página?",
    respuesta: `Los precios se revisan cada día y la página se regenera con ellos. Última revisión: ${formatoFecha(ULTIMA_REVISION)}. Aun así, los precios pueden cambiar: confirma el importe en la tienda antes de pagar.`,
  },
];

export default function ChollosSemana() {
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <Migas migas={[{ nombre: "Chollos de esta semana", ruta: "/chollos-tesla-esta-semana" }]} />
      <JsonLd
        datos={jsonLdColeccion({
          url: `${SITIO}/chollos-tesla-esta-semana`,
          nombre: "Chollos Tesla de esta semana",
          descripcion: "Accesorios para Tesla con más descuento esta semana.",
          elementos: [...MAS_DESCUENTO, ...BARATOS].map((c) => ({ nombre: c.titulo, url: `${SITIO}/chollo/${c.slug}` })),
        })}
      />
      <section className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Chollos Tesla de esta semana</h1>
        <p className="text-texto-suave">
          Aquí tienes los accesorios para Tesla Model 3 y Model Y con más descuento esta semana. El descuento que ves es real: la diferencia entre el precio
          de la tienda y el precio final tras el código de descuento (Hansshow y EVDANCE dan un 20 %, Jowua y Tesery un 5 %). Hoy el mayor llega al {MAX_DTO} %.
        </p>
        <p className="text-texto-suave">
          Solo aparecen productos con el precio revisado en los últimos {DIAS} días ({recientes.length.toLocaleString("es-ES")} de{" "}
          {CHOLLOS.length.toLocaleString("es-ES")}). Última revisión: {formatoFecha(ULTIMA_REVISION)}. Si buscas algo concreto, prueba por modelo:{" "}
          <Link href="/modelo/model-y-juniper" className="font-medium text-verde-boton hover:underline">
            Model Y Juniper
          </Link>
          ,{" "}
          <Link href="/modelo/model-3-highland" className="font-medium text-verde-boton hover:underline">
            Model 3 Highland
          </Link>{" "}
          o los{" "}
          <Link href="/codigos-descuento" className="font-medium text-verde-boton hover:underline">
            códigos de descuento
          </Link>{" "}
          de cada tienda.
        </p>
      </section>
      <h2 className="text-2xl font-semibold">Los {MAS_DESCUENTO.length} con más descuento</h2>
      <Rejilla chollos={MAS_DESCUENTO} prioridad={3} />
      <h2 className="text-2xl font-semibold">Por 20 € o menos</h2>
      <Rejilla chollos={BARATOS} />
      <Faq preguntas={PREGUNTAS} />
    </main>
  );
}
