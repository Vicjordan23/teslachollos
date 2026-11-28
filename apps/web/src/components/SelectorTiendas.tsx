import Image from "next/image";
import Link from "next/link";
import { TIENDAS, type IdTienda } from "@chollesla/core";

/** Logos de todas las tiendas: al pulsar uno se ven solo sus productos. */
export function SelectorTiendas({ activa }: { activa?: IdTienda }) {
  return (
    <nav aria-label="Ver productos por tienda" className="flex flex-col gap-2">
      <h2 className="text-sm font-bold uppercase tracking-wide text-texto-suave">Busca por tienda: pulsa un logo</h2>
      <ul className="flex flex-wrap gap-3">
        {(Object.keys(TIENDAS) as IdTienda[]).map((id) => (
          <li key={id}>
            <Link
              href={`/tienda/${id}`}
              aria-current={activa === id ? "page" : undefined}
              title={`Solo productos de ${TIENDAS[id].nombre}`}
              className={`block overflow-hidden rounded-xl border-2 bg-white hover:-translate-y-0.5 ${activa === id ? "border-verde-boton" : "border-transparent hover:border-[#2aabee]"}`}
            >
              <Image src={`/canales/${id}.webp`} alt={TIENDAS[id].nombre} width={88} height={88} unoptimized loading="eager" className="size-[72px] sm:size-[88px]" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
