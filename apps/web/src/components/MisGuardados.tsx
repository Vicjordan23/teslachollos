"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatoEuros } from "@chollesla/core";
import { Guardar } from "@/components/Interacciones";
import { useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";

interface Fila {
  slug: string;
  titulo: string;
  foto: string | null;
  precio_final: number;
  desde: boolean;
  estado: string;
}

/** Lista de chollos guardados (datos de Supabase, para no cargar el catálogo entero en el navegador). */
export function MisGuardados() {
  const { sesion, listo } = useEstado();
  const [filas, setFilas] = useState<Fila[] | null>(null);
  useEffect(() => {
    const sb = supabase();
    if (!sb || !sesion) return;
    void sb
      .from("guardados")
      .select("creado, chollos(slug, titulo, foto, precio_final, desde, estado)")
      .eq("usuario_id", sesion.user.id)
      .order("creado", { ascending: false })
      .then(({ data }) => setFilas((data ?? []).map((g) => g.chollos as unknown as Fila).filter(Boolean)));
  }, [sesion]);

  if (listo && !sesion) {
    return (
      <p className="text-texto-suave">
        <Link href="/entrar?volver=/guardados" className="text-verde underline">
          Entra
        </Link>{" "}
        para ver tus chollos guardados.
      </p>
    );
  }
  if (!filas) return <p className="text-texto-suave">Cargando…</p>;
  if (filas.length === 0) return <p className="text-texto-suave">Aún no has guardado ningún chollo. Pulsa el marcador de una ficha para guardarla.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {filas.map((f) => (
        <li key={f.slug} className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-2">
          {f.foto && (
            // eslint-disable-next-line @next/next/no-img-element -- miniatura de CDN de tienda, ya reducida
            <img src={f.foto} alt="" width={64} height={64} loading="lazy" className="size-16 shrink-0 rounded-lg object-contain" />
          )}
          <div className="min-w-0 flex-1">
            <Link href={`/chollo/${f.slug}`} className="line-clamp-2 font-medium hover:underline">
              {f.titulo}
            </Link>
            <p className="text-sm">
              <span className="font-semibold text-verde">
                {f.desde && "Desde "}
                {formatoEuros(f.precio_final)}
              </span>
              {f.estado !== "publicado" && <span className="ml-2 text-texto-suave">· ya no está disponible</span>}
            </p>
          </div>
          <Guardar slug={f.slug} claro />
        </li>
      ))}
    </ul>
  );
}
