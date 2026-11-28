import type { Metadata } from "next";
import Link from "next/link";
import { PanelRedes } from "@/components/PanelRedes";

export const metadata: Metadata = { title: "Redes sociales", robots: { index: false, follow: false } };

export default function Redes() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">Redes sociales</h1>
      <p className="text-sm">
        <Link href="/admin/afiliados" className="underline">
          Ir al panel de afiliados
        </Link>
      </p>
      <PanelRedes />
    </main>
  );
}
