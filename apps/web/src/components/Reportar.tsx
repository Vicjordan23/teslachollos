"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChollo, useEstado } from "@/lib/interacciones";
import { CUENTAS_ACTIVAS, supabase } from "@/lib/supabase";

const MOTIVOS = [
  ["precio", "El precio no es correcto"],
  ["caducado", "Ya no está disponible o caducó"],
  ["no_tesla", "No es un accesorio para Tesla"],
  ["spam", "Spam o enlace engañoso"],
  ["ilegal", "Contenido ilegal (falsificación, peligroso…)"],
  ["otro", "Otro motivo"],
] as const;

/** Reportar un chollo (aviso de la comunidad y mecanismo de notificación del art. 16 de la DSA). */
export function Reportar({ slug }: { slug: string }) {
  const c = useChollo(slug);
  const { sesion, alias } = useEstado();
  const router = useRouter();
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState<string>("precio");
  const [detalle, setDetalle] = useState("");
  const [estado, setEstado] = useState<"" | "enviado" | "repetido" | "error">("");

  const abrir = () => {
    if (!sesion) return router.push(`/entrar?volver=${encodeURIComponent(ruta)}`);
    if (!alias) return router.push("/cuenta");
    setAbierto(true);
  };
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabase();
    if (!sb || !sesion || !c) return;
    const { error } = await sb
      .from("reportes")
      .insert({ chollo_id: c.id, usuario_id: sesion.user.id, motivo, detalle: detalle.trim().slice(0, 1000) || null });
    setEstado(error ? (error.code === "23505" ? "repetido" : "error") : "enviado");
  };

  if (!CUENTAS_ACTIVAS) return null;
  if (estado === "enviado" || estado === "repetido") {
    return (
      <p className="text-sm text-texto-suave">
        {estado === "enviado" ? "Gracias: lo revisaremos lo antes posible." : "Ya habías reportado este chollo por ese motivo."}
      </p>
    );
  }
  if (!abierto) {
    return (
      <button type="button" onClick={abrir} className="w-fit text-sm text-texto-suave underline hover:text-texto">
        Reportar un problema con este chollo
      </button>
    );
  }
  return (
    <form onSubmit={enviar} className="flex flex-col gap-2 rounded-xl border border-borde bg-white p-3 text-sm">
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-1 font-medium">¿Qué pasa con este chollo?</legend>
        {MOTIVOS.map(([id, texto]) => (
          <label key={id} className="flex items-center gap-2">
            <input type="radio" name="motivo" value={id} checked={motivo === id} onChange={() => setMotivo(id)} />
            {texto}
          </label>
        ))}
      </fieldset>
      <textarea
        value={detalle}
        onChange={(e) => setDetalle(e.target.value)}
        maxLength={1000}
        rows={3}
        placeholder="Detalles (opcional): precio real, enlace, etc."
        className="rounded-lg border border-borde p-2 outline-none focus:border-verde"
      />
      {estado === "error" && <p className="text-ambar">No se pudo enviar. Inténtalo de nuevo.</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={!c} className="rounded-full bg-verde-boton px-4 py-1.5 font-medium text-white disabled:opacity-50">
          Enviar
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="text-texto-suave underline">
          Cancelar
        </button>
      </div>
    </form>
  );
}
