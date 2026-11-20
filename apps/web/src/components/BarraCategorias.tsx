import Link from "next/link";
import { CATEGORIAS, type IdCategoria } from "@chollesla/core";
import { chollosDeCategoria } from "@/datos/chollos";

/** Filtro por tipo de producto (lo que le importa a la gente; no por tienda). */
export function BarraCategorias({ activa }: { activa?: IdCategoria }) {
  const chip = (activo: boolean) =>
    `shrink-0 rounded px-3 py-1.5 text-sm ${activo ? "bg-verde-boton text-white" : "border border-borde bg-superficie text-texto hover:border-verde/40"}`;
  return (
    <nav aria-label="Tipos de producto" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <Link href="/" className={chip(!activa)} aria-current={!activa ? "page" : undefined}>
        Todo
      </Link>
      {CATEGORIAS.filter((c) => chollosDeCategoria(c.id).length > 0).map((c) => (
        <Link key={c.id} href={`/categoria/${c.id}`} className={chip(activa === c.id)} aria-current={activa === c.id ? "page" : undefined}>
          {c.nombre} <span className={activa === c.id ? "text-white/80" : "text-texto-suave"}>{chollosDeCategoria(c.id).length}</span>
        </Link>
      ))}
    </nav>
  );
}
