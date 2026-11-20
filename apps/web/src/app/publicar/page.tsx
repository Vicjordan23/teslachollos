import type { Metadata } from "next";
import { FormPublicar } from "@/components/FormPublicar";

export const metadata: Metadata = { title: "Publicar un chollo", robots: { index: false } };

export default function Publicar() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">Publicar un chollo</h1>
      <p className="text-texto-suave">¿Has visto una oferta buena para tu Tesla? Compártela con la comunidad. Es gratis.</p>
      <FormPublicar />
    </main>
  );
}
