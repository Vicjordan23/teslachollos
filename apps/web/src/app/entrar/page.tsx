import type { Metadata } from "next";
import { Suspense } from "react";
import { FormEntrar } from "@/components/FormEntrar";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default function Entrar() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start gap-4 px-4 py-16">
      <Suspense>
        <FormEntrar />
      </Suspense>
    </main>
  );
}
