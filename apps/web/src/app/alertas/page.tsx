import type { Metadata } from "next";
import { Suspense } from "react";
import { MisAlertas } from "@/components/MisAlertas";

export const metadata: Metadata = { title: "Alertas", robots: { index: false } };

export default function Alertas() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">Alertas de chollos</h1>
      <Suspense>
        <MisAlertas />
      </Suspense>
    </main>
  );
}
