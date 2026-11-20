import Link from "next/link";

/** base: ruta de la página 1 (p. ej. «/» o «/tienda/amazon»); las demás cuelgan de `${prefijo}/pagina/N`. */
export function Paginacion({ actual, total, base, prefijo }: { actual: number; total: number; base: string; prefijo: string }) {
  if (total <= 1) return null;
  const ruta = (n: number) => (n === 1 ? base : `${prefijo}/pagina/${n}`);
  const desde = Math.max(1, actual - 2);
  const hasta = Math.min(total, actual + 2);
  const numeros = Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);
  const boton = "rounded-full px-3 py-1.5 border border-borde bg-superficie";

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-2 text-sm">
      {actual > 1 && (
        <Link className={boton} href={ruta(actual - 1)} rel="prev">
          ← Anterior
        </Link>
      )}
      {desde > 1 && (
        <Link className={boton} href={ruta(1)}>
          1
        </Link>
      )}
      {desde > 2 && <span aria-hidden>…</span>}
      {numeros.map((n) =>
        n === actual ? (
          <span key={n} aria-current="page" className="rounded-full bg-verde-boton px-3 py-1.5 font-semibold text-white">
            {n}
          </span>
        ) : (
          <Link key={n} className={boton} href={ruta(n)}>
            {n}
          </Link>
        ),
      )}
      {hasta < total - 1 && <span aria-hidden>…</span>}
      {hasta < total && (
        <Link className={boton} href={ruta(total)}>
          {total}
        </Link>
      )}
      {actual < total && (
        <Link className={boton} href={ruta(actual + 1)} rel="next">
          Siguiente →
        </Link>
      )}
    </nav>
  );
}
