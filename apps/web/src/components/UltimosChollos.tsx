import { CHOLLOS } from "@/datos/chollos";
import { TiraChollos } from "@/components/TiraChollos";

const porFecha = [...CHOLLOS].sort((a, b) => b.fecha.localeCompare(a.fecha));
/** 4 de Amazon y 2 del resto (mayoría Amazon, igual que la portada), los de precio más reciente de cada grupo. */
const ULTIMOS = [...porFecha.filter((c) => c.tienda === "amazon").slice(0, 4), ...porFecha.filter((c) => c.tienda !== "amazon").slice(0, 2)];

/** Los chollos con el precio más reciente, encima del catálogo. */
export function UltimosChollos() {
  return <TiraChollos titulo="Últimos chollos" etiqueta="Últimos chollos" lista={ULTIMOS} prioridad={3} />;
}
