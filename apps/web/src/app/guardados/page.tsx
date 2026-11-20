import type { Metadata } from "next";
import { MisGuardados } from "@/components/MisGuardados";

export const metadata: Metadata = { title: "Mis guardados", robots: { index: false } };

export default function Guardados() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">Mis guardados</h1>
      <MisGuardados />
    </main>
  );
}
