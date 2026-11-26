import type { Metadata } from "next";
import Link from "next/link";
import { AvisoTelegram } from "@/components/AvisoTelegram";
import { TiraChollos } from "@/components/TiraChollos";
import { cholloPorSlug } from "@/datos/chollos";
import { metaPagina } from "@/lib/seo";

/** Página para el enlace de la bio (TikTok, Instagram, YouTube): los productos de cada vídeo, el más reciente primero. */
const VIDEOS = [
  "swiveling-mount-kit-2-0-for-model-y-y-juniper-model-3-3-highland-cente",
  "model-3-highland-backseat-ambient-light-seat-back-ambient-lighting-int",
  "protector-de-maletero-de-todo-tiempo-para-model-3-highland-jowua",
];

const GUIAS_DESTACADAS = [
  { slug: "black-friday-tesla-2026-hansshow-codigo-victor", texto: "Black Friday: 20 % en Hansshow con VICTOR" },
  { slug: "primera-semana-con-tu-tesla-checklist", texto: "Tu primera semana con un Tesla" },
  { slug: "accesorios-imprescindibles-model-y-juniper", texto: "Imprescindibles para el Model Y Juniper" },
  { slug: "accesorios-imprescindibles-model-3-highland", texto: "Imprescindibles para el Model 3 Highland" },
  { slug: "alfombrillas-de-maletero-tesla", texto: "Alfombrillas de maletero" },
];

export const metadata: Metadata = metaPagina({
  titulo: "Lo que sale en nuestros vídeos",
  descripcion: "Los accesorios para Tesla de los vídeos de Chollesla, con precio final, y las guías más útiles.",
  ruta: "/enlaces",
  noindex: true,
});

export default function Enlaces() {
  const productos = VIDEOS.flatMap((s) => cholloPorSlug(s) ?? []);
  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-1 flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">Lo que sale en nuestros vídeos</h1>
      <TiraChollos titulo="Productos de los vídeos" etiqueta="Productos de los vídeos" lista={productos} prioridad={2} />
      <AvisoTelegram />
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">Guías de compra</h2>
        <ul className="flex flex-col gap-2">
          {GUIAS_DESTACADAS.map((g) => (
            <li key={g.slug}>
              <Link href={`/guias/${g.slug}`} className="block rounded-xl border border-tarjeta-borde bg-tarjeta p-4 font-medium hover:border-verde-boton">
                {g.texto}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm text-texto-suave">Enlaces de afiliado: si compras desde ellos, podemos recibir una comisión sin coste extra para ti.</p>
    </main>
  );
}
