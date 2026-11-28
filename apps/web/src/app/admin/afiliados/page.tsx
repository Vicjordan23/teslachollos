import type { Metadata } from "next";
import Link from "next/link";
import { PanelAfiliados } from "@/components/PanelAfiliados";

export const metadata: Metadata = { title: "Afiliados", robots: { index: false, follow: false } };

export default function Afiliados() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">Afiliados</h1>
      <p className="text-sm">
        <Link href="/admin/redes" className="underline">
          Ir al panel de redes sociales
        </Link>
      </p>
      <PanelAfiliados />
    </main>
  );
}
