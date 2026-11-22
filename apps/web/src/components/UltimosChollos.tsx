import { CHOLLOS } from "@/datos/chollos";
import { TiraChollos } from "@/components/TiraChollos";

const ULTIMOS = [...CHOLLOS].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);

/** Los chollos con el precio más reciente, encima del catálogo. */
export function UltimosChollos() {
  return <TiraChollos titulo="Últimos chollos" etiqueta="Últimos chollos" lista={ULTIMOS} prioridad={3} />;
}
