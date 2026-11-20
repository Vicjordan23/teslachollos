import { TarjetaChollo } from "@/components/TarjetaChollo";
import type { CholloOficial } from "@/datos/chollos";

export function Rejilla({ chollos, prioridad = 0 }: { chollos: CholloOficial[]; prioridad?: number }) {
  return (
    <section className="flex flex-col gap-3" aria-label="Chollos">
      {chollos.map((c, i) => (
        <TarjetaChollo key={c.id} chollo={{ ...c, oficial: true }} prioridad={i < prioridad} />
      ))}
    </section>
  );
}
