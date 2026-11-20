import Image from "next/image";
import Link from "next/link";
import { formatoEuros, urlFoto } from "@chollesla/core";
import { ahorroDe, CHOLLOS, finalDe } from "@/datos/chollos";

const TOP = [...CHOLLOS].sort((a, b) => ahorroDe(b) - ahorroDe(a)).slice(0, 6);

/** Panel lateral con los chollos de mayor descuento (el voto de la comunidad vive en Supabase y no está en el HTML estático). */
export function MasVotados() {
  return (
    <aside aria-label="Mayores descuentos" className="hidden self-start rounded-xl bg-ficha p-5 lg:sticky lg:top-24 lg:block">
      <h2 className="mb-4 text-xl font-bold">Los mayores descuentos</h2>
      <ul className="flex flex-col gap-4">
        {TOP.map((c) => {
          const foto = urlFoto(c.foto);
          const ahorro = ahorroDe(c);
          return (
            <li key={c.id}>
              <Link href={`/chollo/${c.slug}`} className="flex gap-3 hover:opacity-90">
                <span className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-white">
                  {foto && <Image src={foto} alt="" fill sizes="96px" className="object-contain p-1" />}
                  {ahorro > 0 && (
                    <span className="absolute bottom-0 right-0 rounded-tl-md bg-ficha-descuento px-1.5 py-0.5 text-sm font-bold text-ficha-descuento-texto">
                      {ahorro}%
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-col justify-between">
                  <span className="line-clamp-3 text-sm font-medium leading-snug">{c.titulo}</span>
                  <span className="text-lg font-extrabold text-ficha-precio">{formatoEuros(finalDe(c))}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
