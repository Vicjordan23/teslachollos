import Image from "next/image";
import Link from "next/link";
import { nombreCategoria, TIENDAS } from "@chollesla/core";
import { AvisoTelegram } from "@/components/AvisoTelegram";
import { Rejilla } from "@/components/Rejilla";
import { formatoFecha } from "@/datos/chollos";
import { alternativas, type Retirado } from "@/datos/retirados";

/** Página de un producto que ya no está: sin precio ni botón de compra, con lo más parecido que sí se puede comprar. */
export function FichaRetirada({ r }: { r: Retirado }) {
  const lista = alternativas(r);
  const categoria = nombreCategoria(r.categoria);
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-5 px-4 py-6">
      <nav className="text-sm text-texto-suave">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        ›{" "}
        <Link href={`/categoria/${r.categoria}`} className="hover:underline">
          {categoria}
        </Link>
      </nav>
      <section className="flex flex-wrap items-start gap-5 rounded-2xl border border-tarjeta-borde bg-tarjeta p-4 sm:p-6">
        <div className="relative size-40 shrink-0 overflow-hidden rounded-xl bg-white opacity-60">
          <Image src={r.foto} alt={r.titulo} fill sizes="160px" className="object-contain p-3" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="w-fit rounded-full border border-borde px-3 py-0.5 text-sm font-medium">Ya no está disponible</p>
          <h1 className="text-2xl font-semibold leading-snug">{r.titulo}</h1>
          <p className="text-texto-suave">{r.modelos}</p>
          <p className="text-texto-suave">
            Lo vimos en {TIENDAS[r.tienda].nombre} por última vez el {formatoFecha(r.visto)}.
            {lista.length > 0 ? " Estas son las alternativas parecidas que sí puedes comprar ahora." : ""}
          </p>
          <Link href={`/categoria/${r.categoria}`} className="w-fit rounded-full bg-verde-boton px-5 py-2 font-medium text-white">
            Ver todo en {categoria}
          </Link>
        </div>
      </section>
      {lista.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">Alternativas disponibles</h2>
          <Rejilla chollos={lista} />
        </section>
      )}
      <AvisoTelegram />
    </main>
  );
}
