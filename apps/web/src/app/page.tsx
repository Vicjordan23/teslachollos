import { ChipsTiendas } from "@/components/ChipsTiendas";
import { Paginacion } from "@/components/Paginacion";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";

export default function Inicio() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">Chollos en accesorios para tu Tesla</h1>
        <p className="max-w-2xl text-lg opacity-80">
          {CHOLLOS.length.toLocaleString("es-ES")} accesorios con el precio final después del código de descuento. Muy
          pronto podrás votar los mejores, guardar y crear alertas.
        </p>
        <ChipsTiendas />
      </section>
      <Rejilla chollos={pagina(CHOLLOS, 1)} prioridad={3} />
      <Paginacion actual={1} total={totalPaginas(CHOLLOS)} base="/" prefijo="" />
    </main>
  );
}
