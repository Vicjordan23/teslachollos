import Link from "next/link";
import { jsonLdMigas } from "@chollesla/core";
import { SITIO } from "@/lib/sitio";
import { JsonLd } from "./JsonLd";

/** Migas de pan visibles + BreadcrumbList. `ruta` es relativa («/modelo/model-y»); la última es la página actual. */
export function Migas({ migas }: { migas: { nombre: string; ruta: string }[] }) {
  const todas = [{ nombre: "Inicio", ruta: "/" }, ...migas];
  return (
    <nav aria-label="Migas de pan" className="text-sm text-texto-suave">
      <JsonLd datos={jsonLdMigas(todas.map((m) => ({ nombre: m.nombre, url: m.ruta === "/" ? SITIO : `${SITIO}${m.ruta}` })))} />
      {todas.map((m, i) => (
        <span key={m.ruta}>
          {i > 0 && " › "}
          {i < todas.length - 1 ? (
            <Link href={m.ruta} className="hover:underline">
              {m.nombre}
            </Link>
          ) : (
            <span aria-current="page">{m.nombre}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
