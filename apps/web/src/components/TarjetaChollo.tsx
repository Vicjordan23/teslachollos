import Image from "next/image";
import Link from "next/link";
import { aplicarAfiliado, formatoEuros, porcentajeAhorro, precioFinal, TIENDAS, urlFoto } from "@chollesla/core";
import { Compartir, CopiarCodigo } from "@/components/AccionesChollo";
import { formatoFecha } from "@/datos/chollos";

export interface DatosChollo {
  slug: string;
  titulo: string;
  modelos: string;
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
  /** Temperatura (suma de votos). Hasta que haya cuentas, 0. */
  temperatura?: number;
}

/** Ficha horizontal (opción A elegida por Vic): foto a la izquierda, datos y acciones a la derecha. */
export function TarjetaChollo({ chollo, prioridad = false }: { chollo: DatosChollo; prioridad?: boolean }) {
  const enlace = aplicarAfiliado(chollo.enlace);
  const tienda = enlace.estado === "ok" && enlace.tienda ? TIENDAS[enlace.tienda] : null;
  const final = precioFinal(chollo.precioTienda, tienda?.id ?? null);
  const ahorro = porcentajeAhorro(final, chollo.precioTienda);
  const foto = urlFoto(chollo.foto);
  const ficha = `/chollo/${chollo.slug}`;
  const temperatura = chollo.temperatura ?? 0;

  return (
    <article className="flex gap-3 rounded-2xl border border-tarjeta-borde bg-tarjeta p-3 sm:gap-4 sm:p-4">
      <Link
        href={ficha}
        tabIndex={-1}
        aria-hidden
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white sm:h-36 sm:w-36"
      >
        {foto && (
          <Image src={foto} alt="" fill priority={prioridad} sizes="(max-width: 640px) 96px, 144px" className="object-contain p-2" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 text-xs text-texto-suave">
          <div className="flex items-center gap-1 rounded-full border border-borde bg-white px-1 py-0.5">
            <Link href="/entrar" aria-label="Voto negativo" className="rounded-full px-1.5 text-base leading-none hover:bg-fondo">
              ▾
            </Link>
            <span className="min-w-8 text-center text-sm font-medium text-ambar">{temperatura}°</span>
            <Link href="/entrar" aria-label="Voto positivo" className="rounded-full px-1.5 text-base leading-none hover:bg-fondo">
              ▴
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {chollo.oficial && <span className="rounded-full bg-verde-claro px-2 py-0.5 font-medium text-verde">Oficial</span>}
            <span>Precio del {formatoFecha(chollo.fecha)}</span>
          </div>
        </div>

        <h2 className="line-clamp-2 text-base font-medium leading-snug sm:text-lg">
          <Link href={ficha} className="hover:underline">
            {chollo.titulo}
          </Link>
        </h2>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xl font-semibold text-verde sm:text-2xl">
            {chollo.desde && <span className="text-sm font-medium">Desde </span>}
            {formatoEuros(final)}
          </span>
          {final < chollo.precioTienda && <span className="text-sm text-texto-suave line-through">{formatoEuros(chollo.precioTienda)}</span>}
          {ahorro > 0 && <span className="rounded-md bg-verde-claro px-1.5 text-xs font-medium text-verde">-{ahorro} %</span>}
          {tienda && <span className="text-sm text-texto-suave">· {tienda.nombre}</span>}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex gap-3 text-sm text-texto-suave">
            <Link href="/entrar" className="hover:text-texto">
              Guardar
            </Link>
            <Compartir ruta={ficha} titulo={chollo.titulo} />
          </div>
          <div className="flex items-center gap-2">
            {tienda?.codigo && <CopiarCodigo codigo={tienda.codigo} />}
            {enlace.estado === "ok" && (
              <a
                href={enlace.url}
                rel="sponsored nofollow noopener"
                target="_blank"
                className="rounded-full bg-verde-boton px-4 py-1.5 text-sm font-medium text-white hover:bg-verde-boton-hover"
              >
                Ir al chollo
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
