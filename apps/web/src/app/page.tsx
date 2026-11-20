import { Filtros } from "@/components/Filtros";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";

export default function Inicio() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Chollos en accesorios para tu Tesla</h1>
        <p className="text-texto-suave">
          {CHOLLOS.length.toLocaleString("es-ES")} accesorios con el precio final después del código de descuento.
        </p>
        <Filtros filtro={{}} />
      </section>
      <Rejilla chollos={pagina(CHOLLOS, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(CHOLLOS)} base="/" prefijo="" />
    </main>
  );
}
