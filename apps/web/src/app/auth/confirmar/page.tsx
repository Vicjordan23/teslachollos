import type { Metadata } from "next";
import { Confirmar } from "@/components/Cuenta";

export const metadata: Metadata = { title: "Entrando", robots: { index: false } };

export default function PaginaConfirmar() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start gap-4 px-4 py-16">
      <Confirmar />
    </main>
  );
}
