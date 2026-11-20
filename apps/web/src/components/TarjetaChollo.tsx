import Image from "next/image";
import Link from "next/link";
import { aplicarAfiliado, avisoAfiliado, formatoEuros, precioFinal, TIENDAS, urlFoto } from "@chollesla/core";
import { formatoFecha } from "@/datos/chollos";

export interface DatosChollo {
  /** Si existe, el título y la foto enlazan a la ficha /chollo/<slug>. */
  slug?: string;
  titulo: string;
  modelos: string;
  /** Enlace a la tienda tal como llega (la tarjeta pone el afiliado de Vic). */
  enlace: string;
  /** Foto real del producto (Amazon o Shopify; se admite el proxy wsrv.nl del catálogo antiguo). */
  foto?: string | null;
  /** Precio en tienda en céntimos, antes del código de descuento. */
  precioTienda: number;
  desde?: boolean;
  /** Fecha del precio, ISO (aaaa-mm-dd). */
  fecha: string;
  oficial?: boolean;
}

export function TarjetaChollo({ chollo, prioridad = false }: { chollo: DatosChollo; prioridad?: boolean }) {
  const enlace = aplicarAfiliado(chollo.enlace);
  const tienda = enlace.estado === "ok" && enlace.tienda ? TIENDAS[enlace.tienda] : null;
  const final = precioFinal(chollo.precioTienda, tienda?.id ?? null);
  const aviso = avisoAfiliado(tienda?.id ?? null);
  const foto = urlFoto(chollo.foto);
  const ficha = chollo.slug ? `/chollo/${chollo.slug}` : null;

  const imagen = (
    <div className="relative aspect-[4/3] w-full bg-white">
      {foto ? (
        <Image
          src={foto}
          alt={chollo.titulo}
          fill
          priority={prioridad}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-black/40">Sin foto</div>
      )}
      {chollo.oficial && (
        <span className="absolute left-3 top-3 rounded-full bg-rojo px-3 py-0.5 text-sm font-medium text-white">
          Chollo oficial
        </span>
      )}
    </div>
  );

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl bg-suave ${chollo.oficial ? "border-2 border-rojo" : "border border-black/10 dark:border-white/10"}`}
    >
      {ficha ? (
        <Link href={ficha} tabIndex={-1} aria-hidden>
          {imagen}
        </Link>
      ) : (
        imagen
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        {tienda && <p className="text-sm font-medium opacity-70">{tienda.nombre}</p>}
        <h2 className="text-lg font-medium leading-snug">
          {ficha ? (
            <Link href={ficha} className="hover:underline">
              {chollo.titulo}
            </Link>
          ) : (
            chollo.titulo
          )}
        </h2>
        <p className="text-sm opacity-70">{chollo.modelos}</p>

        <div className="flex flex-wrap items-baseline gap-x-3">
          <p className="text-2xl font-semibold text-rojo">
            {chollo.desde && <span className="text-base font-medium">Desde </span>}
            {formatoEuros(final)}
          </p>
          {final < chollo.precioTienda && (
            <p className="text-sm line-through opacity-60">{formatoEuros(chollo.precioTienda)}</p>
          )}
        </div>
        {tienda?.codigo ? (
          <p className="text-sm">
            Con el código <strong className="rounded bg-rojo/10 px-1.5 py-0.5 font-semibold text-rojo">{tienda.codigo}</strong>
          </p>
        ) : null}
        <p className="text-xs opacity-60">Precio del {formatoFecha(chollo.fecha)}; puede variar.</p>

        {enlace.estado === "ok" && (
          <a
            href={enlace.url}
            rel="sponsored nofollow noopener"
            target="_blank"
            className="mt-auto w-fit rounded-full bg-negro px-5 py-2 font-medium text-white dark:bg-white dark:text-negro"
          >
            Ir al chollo
          </a>
        )}
        {aviso && <p className="text-xs opacity-60">{aviso}</p>}
      </div>
    </article>
  );
}
