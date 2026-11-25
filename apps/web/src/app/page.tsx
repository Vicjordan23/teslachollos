import type { Metadata } from "next";
import { Filtros } from "@/components/Filtros";
import { MiTesla } from "@/components/MiTesla";
import { UltimosChollos } from "@/components/UltimosChollos";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import Link from "next/link";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";
import { Faq } from "@/components/Faq";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titulo: "Accesorios Tesla baratos: chollos Model 3 y Model Y | Chollesla",
  absoluto: true,
  descripcion: `Más de ${Math.floor(CHOLLOS.length / 100) * 100} accesorios para Tesla Model 3 y Model Y con el precio final ya calculado tras el código de descuento. Amazon, AliExpress y tiendas especializadas.`,
  ruta: "/",
});

const PREGUNTAS = [
  {
    pregunta: "¿Qué es Chollesla?",
    respuesta:
      "Una web gratuita que reúne chollos de accesorios para Tesla Model 3 y Model Y en tiendas que envían a España, con el precio final ya calculado después del código de descuento de cada tienda.",
  },
  {
    pregunta: "¿Cómo ganáis dinero?",
    respuesta:
      "Los enlaces a tiendas son de afiliado: si compras, la tienda puede darnos una comisión sin coste extra para ti. En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos.",
  },
  {
    pregunta: "¿Cómo sé si un accesorio vale para mi Tesla?",
    respuesta:
      "Cada chollo indica los modelos y años para los que está pensado. Para el Model Y Juniper (2025 en adelante) y el Model 3 Highland (2024 en adelante) hemos creado páginas propias; en cualquier caso, confirma el año y la versión en la tienda antes de comprar.",
  },
];

export default function Inicio() {
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <MiTesla />
      <Filtros filtro={{}} />
      <UltimosChollos />
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Accesorios Tesla al mejor precio</h1>
        <p className="text-texto-suave">
          {CHOLLOS.length.toLocaleString("es-ES")} accesorios · precio final ya con el código aplicado
        </p>
      </section>
      <Rejilla chollos={pagina(CHOLLOS, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(CHOLLOS)} base="/" prefijo="" />
      <section className="flex max-w-3xl flex-col gap-3 text-texto-suave">
        <h2 className="text-2xl font-semibold text-texto">Accesorios para tu Tesla, con el precio final</h2>
        <p>
          Chollesla reúne accesorios para Tesla Model 3 y Model Y de Amazon, AliExpress y tiendas especializadas como Hansshow, Jowua y Tesery.
          En cada chollo ves el precio de la tienda y el <strong>precio final</strong> tras el código de descuento, sin tener que hacer cuentas.
        </p>
        <p>
          Empieza por tu coche:{" "}
          <Link href="/modelo/model-y-juniper" className="font-medium text-verde-boton hover:underline">accesorios para Model Y Juniper</Link> o{" "}
          <Link href="/modelo/model-3-highland" className="font-medium text-verde-boton hover:underline">para Model 3 Highland</Link>. Mira los{" "}
          <Link href="/chollos-tesla-esta-semana" className="font-medium text-verde-boton hover:underline">chollos de esta semana</Link> y los{" "}
          <Link href="/codigos-descuento" className="font-medium text-verde-boton hover:underline">códigos de descuento</Link> de cada tienda. También
          puedes ir directo a <Link href="/categoria/alfombrillas" className="font-medium text-verde-boton hover:underline">alfombrillas</Link>,{" "}
          <Link href="/categoria/pantalla" className="font-medium text-verde-boton hover:underline">protectores de pantalla</Link> o{" "}
          <Link href="/categoria/carga" className="font-medium text-verde-boton hover:underline">carga</Link>.
        </p>
      </section>
      <Faq preguntas={PREGUNTAS} />
    </main>
  );
}
