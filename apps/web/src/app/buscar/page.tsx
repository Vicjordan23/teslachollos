import type { Metadata } from "next";
import Link from "next/link";
import { buscar, nombreCategoria, nombreModelo } from "@chollesla/core";
import { Filtros } from "@/components/Filtros";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, chollosDeModelo, ordenar, pagina, totalPaginas } from "@/datos/chollos";
import { leerFiltro, urlFiltro } from "@/lib/explorar";

// Búsquedas y combinaciones de filtros: no se indexan (contenido duplicado y combinaciones infinitas).
export const metadata: Metadata = { title: "Buscar", robots: { index: false, follow: true } };

export default async function Buscar({ searchParams }: PageProps<"/buscar">) {
  const { p, ...filtro } = leerFiltro(await searchParams);
  const { q, modelo, categoria, orden = "destacados" } = filtro;
  let lista = q ? buscar(CHOLLOS, q) : CHOLLOS;
  if (modelo) lista = chollosDeModelo(modelo, lista);
  if (categoria) lista = lista.filter((c) => c.categoria === categoria);
  // Con búsqueda y orden «destacados», manda la relevancia.
  if (!(q && orden === "destacados")) lista = ordenar(lista, orden);
  const total = totalPaginas(lista);
  const n = Math.min(total, p);
  const ruta = (num: number) => urlFiltro({ ...filtro, orden }, num);
  const boton = "rounded-full border border-borde bg-white px-3 py-1.5";
  const partes = [modelo && nombreModelo(modelo), categoria && nombreCategoria(categoria)].filter(Boolean).join(" · ");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{q ? `Resultados para «${q}»` : `Chollos${partes ? `: ${partes}` : ""}`}</h1>
        {q && partes && <p className="text-texto-suave">Filtrado por {partes}</p>}
        <p className="text-texto-suave" aria-live="polite">
          {lista.length === 0
            ? "No hay chollos con esos filtros. Prueba con menos palabras o quita algún filtro."
            : `${lista.length.toLocaleString("es-ES")} ${lista.length === 1 ? "chollo" : "chollos"}`}
        </p>
        {(q || modelo || categoria) && (
          <Link
            href={`/alertas?${new URLSearchParams({ ...(q && { palabra: q }), ...(modelo && { modelo }), ...(categoria && { categoria }) })}`}
            className="w-fit rounded-full border border-verde/40 bg-verde-claro px-4 py-1.5 text-sm font-medium text-verde"
          >
            Crear alerta con esta búsqueda
          </Link>
        )}
        <Filtros filtro={filtro} />
      </section>
      {lista.length > 0 && <Rejilla chollos={pagina(lista, n)} prioridad={3} />}
      {total > 1 && (
        <nav aria-label="Paginación" className="flex items-center justify-center gap-3 text-sm">
          {n > 1 && (
            <Link className={boton} href={ruta(n - 1)} rel="prev">
              ← Anterior
            </Link>
          )}
          <span className="text-texto-suave">
            Página {n} de {total}
          </span>
          {n < total && (
            <Link className={boton} href={ruta(n + 1)} rel="next">
              Siguiente →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
