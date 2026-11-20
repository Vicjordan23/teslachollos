import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aplicarAfiliado, formatoEuros, porcentajeAhorro, TIENDAS, type IdTienda } from "@chollesla/core";
import { CopiarCodigo } from "@/components/AccionesChollo";
import { Guardar, Temperatura } from "@/components/Interacciones";
import { Reportar } from "@/components/Reportar";
import { formatoFecha } from "@/datos/chollos";
import { CAMPOS } from "@/lib/comunidad";
import { enlaceSalida } from "@/lib/salida";
import { leer, type CholloComunidad } from "@/lib/supabase-servidor";

async function cargar(slug: string): Promise<CholloComunidad | null> {
  if (!/^[a-z0-9-]{1,90}$/.test(slug)) return null;
  const [c] = await leer<CholloComunidad>(`chollos_publicos?select=${CAMPOS}&slug=eq.${slug}&tipo=eq.comunidad&limit=1`, 30);
  return c ?? null;
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const c = await cargar((await params).slug);
  if (!c) return {};
  return {
    title: `${c.titulo} por ${formatoEuros(c.precio_final)}`,
    description: c.descripcion || `Chollo compartido por @${c.autor_alias} en Chollesla.`,
    alternates: { canonical: `/c/${c.slug}` },
    // Los chollos de la comunidad caducados no se indexan.
    robots: c.estado === "publicado" ? undefined : { index: false },
  };
}

export default async function FichaComunidad({ params }: PageProps<"/c/[slug]">) {
  const c = await cargar((await params).slug);
  if (!c) notFound();
  const tienda = c.tienda && c.tienda in TIENDAS ? TIENDAS[c.tienda as IdTienda] : null;
  const enlace = aplicarAfiliado(c.enlace);
  const salida = enlaceSalida(c.slug, enlace);
  const ahorro = porcentajeAhorro(c.precio_final, c.precio_tienda);
  const host = enlace.estado === "ok" ? new URL(enlace.url).hostname.replace(/^www\./, "") : "";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-6">
      <nav className="text-sm text-texto-suave">
        <Link href="/comunidad" className="hover:underline">
          Comunidad
        </Link>
      </nav>
      <article className="grid gap-6 rounded-2xl border border-tarjeta-borde bg-tarjeta p-4 sm:p-6 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
          {c.foto ? (
            <Image src={c.foto} alt={c.titulo} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6" />
          ) : (
            <div className="grid h-full place-items-center text-texto-suave">Sin foto</div>
          )}
          {c.estado === "caducado" && <span className="absolute left-3 top-3 rounded-full bg-ambar-claro px-3 py-0.5 text-sm font-medium text-ambar">Caducado</span>}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-texto-suave">{tienda?.nombre ?? host}</p>
            <div className="flex items-center gap-3">
              <Temperatura slug={c.slug} />
              <Guardar slug={c.slug} claro />
            </div>
          </div>
          <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">{c.titulo}</h1>
          {c.modelos && <p className="text-texto-suave">{c.modelos}</p>}
          {c.descripcion && <p className="whitespace-pre-line text-lg">{c.descripcion}</p>}
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-4xl font-semibold text-verde">
              {c.desde && <span className="text-xl font-medium">Desde </span>}
              {formatoEuros(c.precio_final)}
            </p>
            {c.precio_final < c.precio_tienda && <p className="line-through text-texto-suave">{formatoEuros(c.precio_tienda)}</p>}
            {ahorro > 0 && <span className="rounded-md bg-verde-claro px-2 text-sm font-medium text-verde">-{ahorro} %</span>}
          </div>
          {tienda?.codigo && (
            <p className="flex items-center gap-2">
              Con el código{" "}
              <span className="rounded-lg bg-ficha p-1">
                <CopiarCodigo codigo={tienda.codigo} />
              </span>
            </p>
          )}
          <p className="text-sm text-texto-suave">
            Compartido por{" "}
            <Link href={`/u/${c.autor_alias}`} className="font-semibold underline">
              @{c.autor_alias}
            </Link> el {formatoFecha(c.creado.slice(0, 10))}. Precio indicado por quien lo
            publicó; la comunidad lo puede reportar si no es correcto.
          </p>
          {salida && c.estado === "publicado" && (
            <a href={salida} rel="sponsored nofollow noopener" target="_blank" className="mt-2 w-fit rounded-full bg-verde-boton px-6 py-3 text-lg font-medium text-white hover:bg-verde-boton-hover">
              Ir al chollo{tienda ? ` en ${tienda.nombre}` : ""}
            </a>
          )}
          <Reportar slug={c.slug} />
        </div>
      </article>
    </main>
  );
}
