import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { insigniasDe, nivelDe, type Estadisticas } from "@chollesla/core";
import { TarjetaChollo } from "@/components/TarjetaChollo";
import { aTarjeta, CAMPOS } from "@/lib/comunidad";
import { leer, type CholloComunidad } from "@/lib/supabase-servidor";

type Perfil = Estadisticas & { alias: string };

async function cargar(alias: string): Promise<Perfil | null> {
  if (!/^[a-z0-9_]{3,20}$/.test(alias)) return null;
  const [p] = await leer<Perfil>(`perfiles_publicos?select=*&alias=eq.${alias}&limit=1`, 60);
  return p ?? null;
}

export async function generateMetadata({ params }: PageProps<"/u/[alias]">): Promise<Metadata> {
  const p = await cargar((await params).alias);
  return p ? { title: `@${p.alias}`, description: `Chollos para Tesla compartidos por @${p.alias} en Chollesla.`, robots: { index: false } } : {};
}

export default async function PerfilPublico({ params }: PageProps<"/u/[alias]">) {
  const p = await cargar((await params).alias);
  if (!p) notFound();
  const nivel = nivelDe(p);
  const insignias = insigniasDe(p);
  const chollos = await leer<CholloComunidad>(`chollos_publicos?select=${CAMPOS}&autor_alias=eq.${p.alias}&tipo=eq.comunidad&order=creado.desc&limit=24`, 60);
  const dato = (valor: number, texto: string) => (
    <div className="rounded-xl border border-borde bg-superficie px-4 py-3">
      <p className="text-2xl font-semibold">{valor.toLocaleString("es-ES")}</p>
      <p className="text-sm text-texto-suave">{texto}</p>
    </div>
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">@{p.alias}</h1>
        <p className="text-texto-suave">
          Nivel {nivel.nivel} · <strong className="text-texto">{nivel.nombre}</strong> · {nivel.puntos.toLocaleString("es-ES")} puntos
          {nivel.siguiente && ` (siguiente nivel a ${nivel.siguiente.toLocaleString("es-ES")})`} · en Chollesla desde{" "}
          {new Date(p.creado).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </p>
      </section>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Estadísticas">
        {dato(p.chollos, "chollos publicados")}
        {dato(p.grados, "grados recibidos")}
        {dato(p.votos_dados, "votos dados")}
        {dato(p.reportes_utiles, "reportes útiles")}
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Insignias</h2>
        {insignias.length === 0 ? (
          <p className="text-texto-suave">Todavía ninguna.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {insignias.map((i) => (
              <li key={i.id} title={i.descripcion} className="rounded-full border border-ambar/30 bg-ambar-claro px-3 py-1.5 text-sm font-medium text-ambar">
                {i.nombre}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Sus chollos</h2>
        {chollos.length === 0 ? (
          <p className="text-texto-suave">Aún no ha publicado chollos.</p>
        ) : (
          chollos.map((c) => <TarjetaChollo key={c.id} chollo={aTarjeta(c)} />)
        )}
      </section>
    </main>
  );
}
