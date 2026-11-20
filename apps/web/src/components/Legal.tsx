import type { ReactNode } from "react";
import { ACTUALIZADO } from "@/lib/titular";

/** Contenedor de las páginas legales (texto largo, legible). */
export function Legal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8 leading-relaxed [&_a]:text-verde [&_a]:underline [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc">
      <h1 className="text-3xl font-semibold">{titulo}</h1>
      <p className="text-sm text-texto-suave">Última actualización: {ACTUALIZADO}</p>
      {children}
    </main>
  );
}

/** Dato del titular o aviso de que falta. */
export function Dato({ valor }: { valor: string | null }) {
  return valor ? <>{valor}</> : <span className="rounded bg-ambar-claro px-1 text-ambar">pendiente</span>;
}
