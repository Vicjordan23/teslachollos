import Image from "next/image";
import Link from "next/link";
import { formatoEuros, urlFoto } from "@chollesla/core";
import { ahorroDe, finalDe, type CholloOficial } from "@/datos/chollos";

/** Fila de chollos pequeños con foto, precio final y descuento (últimos chollos, relacionados…). */
export function TiraChollos({ titulo, etiqueta, lista, prioridad = 0 }: { titulo: string; etiqueta: string; lista: CholloOficial[]; prioridad?: number }) {
  if (lista.length === 0) return null;
  return (
    <section aria-label={etiqueta} className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">{titulo}</h2>
      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {lista.map((c, i) => {
          const foto = urlFoto(c.foto);
          const ahorro = ahorroDe(c);
          return (
            <li key={c.id} className="w-40 shrink-0 sm:w-auto">
              <Link href={`/chollo/${c.slug}`} className="flex h-full flex-col gap-2 rounded-xl border border-tarjeta-borde bg-tarjeta p-2 hover:border-verde-boton">
                <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
                  {foto && <Image src={foto} alt={c.titulo} fill priority={i < prioridad} sizes="(max-width: 640px) 160px, 200px" className="object-contain p-2" />}
                  {ahorro > 0 && (
                    <span className="absolute bottom-0 right-0 rounded-tl-md bg-ficha-descuento px-1.5 py-0.5 text-xs font-bold text-ficha-descuento-texto">-{ahorro}%</span>
                  )}
                </span>
                <span className="line-clamp-2 text-sm font-medium leading-snug">{c.titulo}</span>
                <span className="mt-auto flex items-baseline justify-between gap-2">
                  <span className="text-lg font-extrabold text-ficha-precio">{formatoEuros(finalDe(c))}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
