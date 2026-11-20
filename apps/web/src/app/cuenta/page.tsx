import type { Metadata } from "next";
import { MiCuenta } from "@/components/Cuenta";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };

export default function PaginaCuenta() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start gap-4 px-4 py-12">
      <MiCuenta />
    </main>
  );
}
