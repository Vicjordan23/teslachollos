import type { Metadata } from "next";
import { Filtros } from "@/components/Filtros";
import { MiTesla } from "@/components/MiTesla";
import { UltimosChollos } from "@/components/UltimosChollos";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";

export const metadata: Metadata = {
  title: { absolute: "Accesorios Tesla baratos: chollos Model 3 y Model Y | Chollesla" },
  description: `Más de ${Math.floor(CHOLLOS.length / 100) * 100} accesorios para Tesla Model 3 y Model Y con el precio final ya calculado tras el código de descuento. Amazon, AliExpress y tiendas oficiales.`,
  alternates: { canonical: "/" },
};

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
    </main>
  );
}
