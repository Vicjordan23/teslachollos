/** Cuadro de búsqueda (formulario GET a /buscar): funciona sin JavaScript. */
export function CajaBusqueda({ valor = "", className = "" }: { valor?: string; className?: string }) {
  return (
    <form action="/buscar" method="get" role="search" className={`relative ${className}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-texto-suave" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        name="q"
        aria-label="Buscar chollos"
        type="search"
        defaultValue={valor}
        placeholder="Buscar chollos…"
        maxLength={80}
        enterKeyHint="search"
        className="w-full rounded-full border border-borde bg-fondo py-1.5 pl-9 pr-3 text-sm outline-none placeholder:text-texto-suave focus:border-verde focus:bg-white"
      />
    </form>
  );
}
