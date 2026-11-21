import Link from "next/link";
import { etiquetasDe } from "@chollesla/core";
import { urlFiltro } from "@/lib/explorar";

// Un color por modelo y versión (fondo y texto), para reconocerlos de un vistazo.
const COLORES: Record<string, string> = {
  "model-3": "bg-[#2f7dff] text-white",
  "model-3-antiguo": "bg-[#5b6b8c] text-white",
  "model-3-highland": "bg-[#1d4ed8] text-white",
  "model-3-standard": "bg-[#06b6d4] text-black",
  "model-y": "bg-[#a855f7] text-white",
  "model-y-antiguo": "bg-[#6d4aa8] text-white",
  "model-y-juniper": "bg-[#ff3d1f] text-white",
  "model-y-standard": "bg-[#ffb020] text-black",
  "model-y-l": "bg-[#ec4899] text-white",
  "model-s": "bg-[#14b8a6] text-black",
  "model-x": "bg-[#84cc16] text-black",
  cybertruck: "bg-[#64748b] text-white",
  universal: "bg-[#3f3f46] text-white",
};

/** Cuadros de colores con los modelos y versiones de Tesla para los que vale el producto. */
export function EtiquetasModelo({ modelos, className = "" }: { modelos: string; className?: string }) {
  const etiquetas = etiquetasDe(modelos);
  return (
    <ul aria-label="Compatible con" className={`flex flex-wrap gap-1.5 ${className}`}>
      {etiquetas.map((e) => {
        const clase = `block rounded px-2 py-0.5 text-xs font-bold leading-5 sm:text-sm ${COLORES[e.id] ?? "bg-[#3f3f46] text-white"}`;
        return (
          <li key={e.id}>
            {e.modelo ? (
              <Link href={urlFiltro({ modelo: e.modelo, version: e.version ?? undefined })} className={`${clase} hover:brightness-110`}>
                {e.texto}
              </Link>
            ) : (
              <span className={clase}>{e.texto}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
