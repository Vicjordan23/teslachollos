import type { Metadata } from "next";
import { PanelAdmin } from "@/components/PanelAdmin";

export const metadata: Metadata = { title: "Moderación", robots: { index: false, follow: false } };

export default function Admin() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">Moderación</h1>
      <PanelAdmin />
    </main>
  );
}
