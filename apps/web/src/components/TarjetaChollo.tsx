import Image from "next/image";
import Link from "next/link";
import { aplicarAfiliado, formatoEuros, porcentajeAhorro, precioFinal, TIENDAS, urlFoto } from "@chollesla/core";
import { Compartir, CopiarCodigo } from "@/components/AccionesChollo";
import { Guardar, Temperatura } from "@/components/Interacciones";
import { enlaceSalida } from "@/lib/salida";
import { formatoFecha } from "@/datos/chollos";

export interface DatosChollo {
  slug: string;
  titulo: string;
  modelos: string;
  /** Descripción corta (se recorta a 2 líneas). */
  descripcion?: string;
  /** Enlace a la tienda tal como llega (la tarjeta pone el afiliado de Vic). */
  enlace: string;
  /** Foto real del producto (Amazon o Shopify). */
  foto?: string | null;
  /** Precio en tienda en céntimos, antes del código de descuento. */
  precioTienda: number;
  desde?: boolean;
  /** Fecha del precio, ISO (aaaa-mm-dd). */
  fecha: string;
  oficial?: boolean;
  /** Enlace de afiliado generado por la tienda (AliExpress). */
  enlaceAfiliado?: string;
  /** Alias del autor (chollos de la comunidad). */
  autor?: string | null;
  /** Ruta de la ficha (por defecto /chollo/<slug>; los de la comunidad, /c/<slug>). */
  ruta?: string;
}

const ICONO = "size-4 shrink-0";

/** Ficha oscura horizontal: foto en panel blanco a la izquierda; temperatura, título, precio, tienda y botón a la derecha. */
export function TarjetaChollo({ chollo, prioridad = false }: { chollo: DatosChollo; prioridad?: boolean }) {
  const enlace = aplicarAfiliado(chollo.enlace);
  const salida = enlaceSalida(chollo.slug, enlace, chollo.enlaceAfiliado);
  const tienda = enlace.estado === "ok" && enlace.tienda ? TIENDAS[enlace.tienda] : null;
  const final = precioFinal(chollo.precioTienda, tienda?.id ?? null);
  const ahorro = porcentajeAhorro(final, chollo.precioTienda);
  const foto = urlFoto(chollo.foto);
  const ficha = chollo.ruta ?? `/chollo/${chollo.slug}`;

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-ficha p-3 text-ficha-texto sm:flex-row sm:gap-5 sm:p-4">
      <Link
        href={ficha}
        tabIndex={-1}
        aria-hidden
        className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-white sm:h-auto sm:min-h-52 sm:w-52 sm:self-stretch"
      >
        {foto && (
          <Image src={foto} alt="" fill priority={prioridad} sizes="(max-width: 640px) 100vw, 208px" className="object-contain p-2" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <Temperatura slug={chollo.slug} />
          <span className="flex items-center gap-1.5 rounded-md bg-ficha-aviso px-2.5 py-1.5 text-xs text-ficha-aviso-texto sm:text-sm">
            <svg viewBox="0 0 24 24" className={ICONO} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span>
              <span className="hidden sm:inline">Precio del </span>
              {formatoFecha(chollo.fecha)}
            </span>
          </span>
        </div>

        <h2 className="line-clamp-2 text-base font-bold leading-snug sm:text-xl">
          <Link href={ficha} className="hover:underline">
            {chollo.titulo}
          </Link>
        </h2>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ficha-suave">
          <span className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ficha-precio sm:text-3xl">
              {chollo.desde && <span className="text-sm font-medium">Desde </span>}
              {formatoEuros(final)}
            </span>
            {final < chollo.precioTienda && <span className="text-sm line-through sm:text-base">{formatoEuros(chollo.precioTienda)}</span>}
          </span>
          {ahorro > 0 && <span className="rounded-md bg-ficha-descuento px-1.5 py-0.5 text-sm font-bold text-ficha-descuento-texto sm:text-base">-{ahorro}%</span>}
          {tienda && (
            <>
              <span className="hidden h-6 w-px bg-ficha-borde sm:block" aria-hidden />
              <span>
                Disponible en <strong className="font-bold text-ficha-texto">{tienda.nombre}</strong>
              </span>
            </>
          )}
          {!chollo.oficial && chollo.autor && (
            <span>
              <span className="hidden sm:inline">Compartido por</span> <strong className="font-bold text-ficha-texto">@{chollo.autor}</strong>
            </span>
          )}
          {chollo.oficial && (
            <span className="flex items-center gap-1.5">
              <Image src="/icon.svg" alt="" width={22} height={22} unoptimized className="rounded-full" />
              <span className="hidden sm:inline">Compartido por</span> <strong className="font-bold text-ficha-texto">Chollesla</strong>
            </span>
          )}
        </div>

        {chollo.descripcion && (
          <p className="line-clamp-2 hidden text-[15px] leading-relaxed text-ficha-suave sm:block">{chollo.descripcion}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-4">
            <Compartir ruta={ficha} titulo={chollo.titulo} />
<Guardar slug={chollo.slug} />
          </div>
          <div className="flex items-center gap-2">
            {tienda?.codigo && <CopiarCodigo codigo={tienda.codigo} />}
            {salida && (
              <a
                href={salida}
                rel="sponsored nofollow noopener"
                target="_blank"
                className="flex items-center gap-2 rounded-full bg-ficha-boton px-5 py-2.5 text-sm font-extrabold text-white hover:bg-ficha-boton-hover sm:px-8 sm:py-3 sm:text-base"
              >
                Ir al chollo
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
