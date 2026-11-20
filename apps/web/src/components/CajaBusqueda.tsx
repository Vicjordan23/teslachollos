/** Cuadro de búsqueda (formulario GET a /buscar): funciona sin JavaScript. */
export function CajaBusqueda({ valor = "", className = "" }: { valor?: string; className?: string }) {
  return (
    <form action="/buscar" method="get" role="search" className={`relative ${className}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-texto" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        name="q"
        aria-label="Buscar chollos"
        type="search"
        defaultValue={valor}
        placeholder="Buscar…"
        maxLength={80}
        enterKeyHint="search"
        className="h-12 w-full rounded-full border border-borde bg-fondo pl-12 pr-4 text-base text-texto outline-none placeholder:text-texto-suave focus:border-verde-boton"
      />
    </form>
  );
}
