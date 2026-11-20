import { MasVotados } from "@/components/MasVotados";
import { TarjetaChollo } from "@/components/TarjetaChollo";
import type { CholloOficial } from "@/datos/chollos";

/** Lista de fichas a todo el ancho con el panel lateral de mayores descuentos. */
export function Rejilla({ chollos, prioridad = 0 }: { chollos: CholloOficial[]; prioridad?: number }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="flex flex-col gap-3" aria-label="Chollos">
        {chollos.map((c, i) => (
          <TarjetaChollo key={c.id} chollo={{ ...c, oficial: true }} prioridad={i < prioridad} />
        ))}
      </section>
      <MasVotados />
    </div>
  );
}
