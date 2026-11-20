import Link from "next/link";
import { CATEGORIAS, MODELOS } from "@chollesla/core";
import { chollosDeCategoria, ORDENES } from "@/datos/chollos";
import { urlFiltro, type Filtro } from "@/lib/explorar";

const chip = (activo: boolean) =>
  `shrink-0 rounded-full px-3 py-1.5 text-sm ${activo ? "bg-verde-boton text-white" : "border border-borde bg-white text-texto hover:border-verde/40"}`;

function Fila({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <nav aria-label={etiqueta} className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-texto-suave">{etiqueta}</span>
      {children}
    </nav>
  );
}

/** Filtros por modelo, tipo de producto y orden. Cada chip cambia un filtro y conserva los demás. */
export function Filtros({ filtro }: { filtro: Filtro }) {
  const { modelo, categoria, orden = "destacados" } = filtro;
  const enlace = (cambio: Partial<Filtro>, activo: boolean, texto: React.ReactNode, clave: string) => (
    <Link key={clave} href={urlFiltro({ ...filtro, ...cambio })} className={chip(activo)} aria-current={activo ? "page" : undefined}>
      {texto}
    </Link>
  );
  return (
    <div className="flex flex-col gap-2">
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
      <Fila etiqueta="Orden">
        {ORDENES.map((o) => enlace({ orden: o.id }, orden === o.id, o.nombre, o.id))}
      </Fila>
    </div>
  );
}
