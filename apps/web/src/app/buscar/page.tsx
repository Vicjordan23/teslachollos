import type { Metadata } from "next";
import Link from "next/link";
import { buscar } from "@chollesla/core";
import { BarraCategorias } from "@/components/BarraCategorias";
import { Rejilla } from "@/components/Rejilla";
import { CHOLLOS, pagina, totalPaginas } from "@/datos/chollos";

// Las búsquedas no se indexan (contenido duplicado y combinaciones infinitas).
export const metadata: Metadata = { title: "Buscar", robots: { index: false, follow: true } };

function texto(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim().slice(0, 80) ?? "";
}

export default async function Buscar({ searchParams }: PageProps<"/buscar">) {
  const sp = await searchParams;
  const q = texto(sp.q);
  const resultados = q ? buscar(CHOLLOS, q) : [];
  const total = totalPaginas(resultados);
  const n = Math.min(total, Math.max(1, Number.parseInt(texto(sp.p), 10) || 1));
  const ruta = (p: number) => `/buscar?q=${encodeURIComponent(q)}${p > 1 ? `&p=${p}` : ""}`;
  const boton = "rounded-full border border-borde bg-white px-3 py-1.5";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{q ? `Resultados para «${q}»` : "Buscar chollos"}</h1>
        {q && (
          <p className="text-texto-suave" aria-live="polite">
            {resultados.length === 0
              ? "No hay chollos con esas palabras. Prueba con menos palabras o mira por tipo de producto:"
              : `${resultados.length.toLocaleString("es-ES")} ${resultados.length === 1 ? "chollo" : "chollos"}`}
          </p>
        )}
        {(!q || resultados.length === 0) && <BarraCategorias />}
      </section>
      {resultados.length > 0 && <Rejilla chollos={pagina(resultados, n)} prioridad={3} />}
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
