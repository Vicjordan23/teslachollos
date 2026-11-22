import Image from "next/image";
import Link from "next/link";
import { formatoEuros, urlFoto } from "@chollesla/core";
import { ahorroDe, CHOLLOS, finalDe, formatoFecha } from "@/datos/chollos";
import { HaceTiempo } from "@/components/HaceTiempo";

const ULTIMOS = [...CHOLLOS].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);

/** Los chollos con el precio más reciente, encima del catálogo. */
export function UltimosChollos() {
  return (
    <section aria-label="Últimos chollos" className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">Últimos chollos</h2>
      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {ULTIMOS.map((c, i) => {
          const foto = urlFoto(c.foto);
          const ahorro = ahorroDe(c);
          return (
            <li key={c.id} className="w-40 shrink-0 sm:w-auto">
              <Link href={`/chollo/${c.slug}`} className="flex h-full flex-col gap-2 rounded-xl border border-tarjeta-borde bg-tarjeta p-2 hover:border-verde-boton">
                <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
                  {foto && <Image src={foto} alt="" fill priority={i < 3} sizes="(max-width: 640px) 160px, 200px" className="object-contain p-2" />}
                  {ahorro > 0 && (
                    <span className="absolute bottom-0 right-0 rounded-tl-md bg-ficha-descuento px-1.5 py-0.5 text-xs font-bold text-ficha-descuento-texto">-{ahorro}%</span>
                  )}
                </span>
                <span className="line-clamp-2 text-sm font-medium leading-snug">{c.titulo}</span>
                <span className="mt-auto flex items-baseline justify-between gap-2">
                  <span className="text-lg font-extrabold text-ficha-precio">{formatoEuros(finalDe(c))}</span>
                  <span className="text-xs text-texto-suave">
                    <HaceTiempo fecha={c.fecha} alternativa={formatoFecha(c.fecha)} />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
