import type { Metadata } from "next";
import Link from "next/link";
import { TarjetaChollo } from "@/components/TarjetaChollo";
import { metaPagina } from "@/lib/seo";
import { aTarjeta, CAMPOS } from "@/lib/comunidad";
import { HAY_SUPABASE, leer, type CholloComunidad } from "@/lib/supabase-servidor";

export const metadata: Metadata = metaPagina({
  titulo: "Chollos de la comunidad",
  descripcion: "Chollos de accesorios para Tesla compartidos por la comunidad: los más nuevos y los más calientes.",
  ruta: "/comunidad",
});

const ORDEN = {
  nuevos: { nombre: "Nuevos", sql: "creado.desc" },
  calientes: { nombre: "Más calientes", sql: "temperatura.desc,creado.desc" },
} as const;

/** Fecha (aaaa-mm-dd) de hace n días. */
function haceDias(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

export default async function Comunidad({ searchParams }: PageProps<"/comunidad">) {
  const sp = await searchParams;
  const orden = sp.orden === "calientes" ? "calientes" : "nuevos";
  // Más calientes: de los últimos 7 días, como en las comunidades de chollos.
  const filtro = orden === "calientes" ? `&creado=gt.${haceDias(7)}` : "";
  const lista = await leer<CholloComunidad>(`chollos_publicos?select=${CAMPOS}&tipo=eq.comunidad&estado=eq.publicado${filtro}&order=${ORDEN[orden].sql}&limit=48`, 30);
  const chip = (activo: boolean) =>
    `rounded-full px-3 py-1.5 text-sm ${activo ? "bg-verde-boton text-white" : "border border-borde bg-superficie hover:border-verde/40"}`;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Chollos de la comunidad</h1>
        <p className="text-texto-suave">
          Los comparte la gente y se ordenan por votos. ¿Has visto uno? <Link href="/publicar" className="text-verde underline">Publícalo</Link>.
        </p>
        <nav aria-label="Orden" className="flex gap-2">
          {(Object.keys(ORDEN) as (keyof typeof ORDEN)[]).map((o) => (
            <Link key={o} href={o === "nuevos" ? "/comunidad" : "/comunidad?orden=calientes"} className={chip(orden === o)} aria-current={orden === o ? "page" : undefined}>
              {ORDEN[o].nombre}
            </Link>
          ))}
        </nav>
      </section>
      {lista.length === 0 ? (
        <p className="text-texto-suave">
          {HAY_SUPABASE ? "Todavía no hay chollos de la comunidad. ¡Sé el primero en publicar uno!" : "La comunidad abre muy pronto."}
        </p>
      ) : (
        <section className="flex flex-col gap-3" aria-label="Chollos">
          {lista.map((c, i) => (
            <TarjetaChollo key={c.id} chollo={aTarjeta(c)} prioridad={i < 3} />
          ))}
        </section>
      )}
    </main>
  );
}
