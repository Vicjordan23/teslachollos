"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";

interface Fila {
  id: number;
  slug: string;
  titulo: string;
  estado: string;
  moderacion: { decision: string; motivo: string; creado: string }[];
}

const ESTADOS: Record<string, string> = { pendiente: "En revisión", publicado: "Publicado", caducado: "Caducado", retirado: "Retirado" };

/** Chollos que ha publicado la persona, con su estado y el motivo de cada decisión de moderación (DSA art. 17). */
export function MisChollos() {
  const { sesion } = useEstado();
  const [filas, setFilas] = useState<Fila[] | null>(null);
  useEffect(() => {
    const sb = supabase();
    if (!sb || !sesion) return;
    void sb
      .from("chollos")
      .select("id, slug, titulo, estado, moderacion(decision, motivo, creado)")
      .eq("autor", sesion.user.id)
      .order("creado", { ascending: false })
      .limit(50)
      .then(({ data }) => setFilas((data as unknown as Fila[]) ?? []));
  }, [sesion]);
  if (!filas || filas.length === 0) return null;
  return (
    <section className="flex w-full flex-col gap-2">
      <h2 className="text-lg font-semibold">Mis chollos</h2>
      <ul className="flex flex-col gap-2">
        {filas.map((f) => {
          const ultima = [...f.moderacion].sort((a, b) => b.creado.localeCompare(a.creado))[0];
          return (
            <li key={f.id} className="rounded-xl border border-borde bg-superficie px-4 py-3">
              {f.estado === "publicado" || f.estado === "caducado" ? (
                <Link href={`/c/${f.slug}`} className="font-medium hover:underline">
                  {f.titulo}
                </Link>
              ) : (
                <span className="font-medium">{f.titulo}</span>
              )}
              <p className="text-sm text-texto-suave">
                {ESTADOS[f.estado] ?? f.estado}
                {ultima && f.estado !== "publicado" && ` · Motivo: ${ultima.motivo}`}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-texto-suave">Si no estás de acuerdo con una decisión, responde escribiendo al contacto del aviso legal.</p>
    </section>
  );
}
