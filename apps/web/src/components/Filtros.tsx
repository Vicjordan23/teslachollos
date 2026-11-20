import Link from "next/link";
import { CATEGORIAS, MODELOS } from "@chollesla/core";
import { chollosDeCategoria, ORDENES } from "@/datos/chollos";
import { urlFiltro, type Filtro } from "@/lib/explorar";

const chip = (activo: boolean) =>
  `shrink-0 rounded px-3 py-1.5 text-sm ${activo ? "bg-verde-boton text-white" : "border border-borde bg-superficie text-texto hover:border-verde-boton"}`;

function Fila({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <nav aria-label={etiqueta} className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs font-medium uppercase tracking-wide text-texto-suave">{etiqueta}</span>
      {children}
    </nav>
  );
}

/** Pestañas de orden (Destacados, Más descuento…) y botón «Filtrar» con modelo y tipo. Cada enlace cambia un filtro y conserva los demás. */
export function Filtros({ filtro }: { filtro: Filtro }) {
  const { modelo, categoria, orden = "destacados" } = filtro;
  const href = (cambio: Partial<Filtro>) => urlFiltro({ ...filtro, ...cambio });
  const enlace = (cambio: Partial<Filtro>, activo: boolean, texto: React.ReactNode, clave: string) => (
    <Link key={clave} href={href(cambio)} className={chip(activo)} aria-current={activo ? "page" : undefined}>
      {texto}
    </Link>
  );
  const nFiltros = (modelo ? 1 : 0) + (categoria ? 1 : 0);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 border-b border-borde">
        <nav aria-label="Orden" className="-mb-px flex gap-1 overflow-x-auto">
          {ORDENES.map((o) => (
            <Link
              key={o.id}
              href={href({ orden: o.id })}
              aria-current={orden === o.id ? "page" : undefined}
              className={`shrink-0 border-b-2 px-4 py-3 font-semibold ${orden === o.id ? "border-verde-boton text-verde-boton" : "border-transparent text-texto hover:text-verde-boton"}`}
            >
              {o.nombre}
            </Link>
          ))}
        </nav>
        <details className="group relative shrink-0">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded border border-borde bg-superficie px-4 py-2 font-medium marker:hidden">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />
            </svg>
            Filtrar{nFiltros > 0 && <span className="rounded bg-verde-boton px-1.5 text-xs text-white">{nFiltros}</span>}
          </summary>
          <div className="absolute right-0 z-20 mt-2 flex w-[min(92vw,34rem)] flex-col gap-3 rounded-xl border border-borde bg-superficie p-4 shadow-xl">
            <Fila etiqueta="Modelo">
              {enlace({ modelo: undefined }, !modelo, "Todos", "todos")}
              {MODELOS.map((m) => enlace({ modelo: m.id }, modelo === m.id, m.nombre, m.id))}
            </Fila>
            <Fila etiqueta="Tipo">
              {enlace({ categoria: undefined }, !categoria, "Todo", "todo")}
              {CATEGORIAS.filter((c) => chollosDeCategoria(c.id).length > 0).map((c) =>
                enlace({ categoria: c.id }, categoria === c.id, c.nombre, c.id),
              )}
            </Fila>
          </div>
        </details>
      </div>
    </div>
  );
}
