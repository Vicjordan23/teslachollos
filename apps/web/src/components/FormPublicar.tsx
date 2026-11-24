"use client";

import Link from "next/link";
import { useState } from "react";
import { useEstado } from "@/lib/interacciones";
import { CUENTAS_ACTIVAS, supabase } from "@/lib/supabase";

const campo = "w-full rounded-xl border border-borde bg-superficie px-4 py-2.5 outline-none focus:border-verde";

/** Formulario para que la comunidad publique un chollo (gratis, con el afiliado de Chollesla). */
export function FormPublicar() {
  const { sesion, alias, listo } = useEstado();
  const [datos, setDatos] = useState({ enlace: "", titulo: "", precio: "", modelos: "", descripcion: "", foto: "", caduca: "" });
  const [acepto, setAcepto] = useState(false);
  const [estado, setEstado] = useState<"" | "enviando" | "error">("");
  const [mensaje, setMensaje] = useState("");
  const [hecho, setHecho] = useState<{ slug: string; estado: string } | null>(null);

  if (!CUENTAS_ACTIVAS) return <p className="text-texto-suave">Muy pronto podrás publicar chollos.</p>;
  if (listo && !sesion) {
    return (
      <p className="text-texto-suave">
        <Link href="/entrar?volver=/publicar" className="text-verde underline">
          Entra
        </Link>{" "}
        para publicar un chollo. Es gratis.
      </p>
    );
  }
  if (alias === null) {
    return (
      <p className="text-texto-suave">
        Antes, elige tu alias en <Link href="/cuenta" className="text-verde underline">tu cuenta</Link>.
      </p>
    );
  }
  if (hecho) {
    return hecho.estado === "publicado" ? (
      <p>
        ¡Publicado!{" "}
        <Link href={`/c/${hecho.slug}`} className="text-verde underline">
          Ver tu chollo
        </Link>
      </p>
    ) : (
      <p>¡Gracias! Lo revisamos antes de publicarlo (los primeros chollos de cada persona pasan revisión). Suele ser en menos de un día.</p>
    );
  }

  const cambiar = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDatos({ ...datos, [k]: e.target.value });
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = (await supabase()?.auth.getSession())?.data.session?.access_token;
    if (!token) return;
    setEstado("enviando");
    const r = await fetch("/api/publicar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(datos),
    }).catch(() => null);
    const j = (await r?.json().catch(() => null)) as { error?: string; slug?: string; estado?: string } | null;
    if (r?.ok && j?.slug && j.estado) return setHecho({ slug: j.slug, estado: j.estado });
    setMensaje(j?.error ?? "No se pudo publicar. Inténtalo de nuevo.");
    setEstado("error");
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="font-medium">Enlace del producto</span>
        <input required type="url" value={datos.enlace} onChange={cambiar("enlace")} placeholder="https://www.amazon.es/dp/…" className={campo} />
        <span className="text-sm text-texto-suave">Amazon.es, Jowua, Hansshow, Tesery, Tesla o AliExpress. Se publica con el enlace de afiliado de Chollesla.</span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-medium">Título</span>
        <input required minLength={5} maxLength={200} value={datos.titulo} onChange={cambiar("titulo")} placeholder="Alfombrillas 3D para Model Y Juniper" className={campo} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Precio en la tienda (€)</span>
          <input required inputMode="decimal" value={datos.precio} onChange={cambiar("precio")} placeholder="39,99" className={campo} />
          <span className="text-sm text-texto-suave">El que ves ahora en la tienda. Si hay código de Chollesla, lo aplicamos nosotros.</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Modelos compatibles</span>
          <input maxLength={200} value={datos.modelos} onChange={cambiar("modelos")} placeholder="Model Y 2025-2026" className={campo} />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="font-medium">Descripción (opcional)</span>
        <textarea rows={4} maxLength={2000} value={datos.descripcion} onChange={cambiar("descripcion")} placeholder="¿Por qué es un chollo? Envío, garantía, experiencia…" className={campo} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-medium">Foto (opcional)</span>
        <input type="url" value={datos.foto} onChange={cambiar("foto")} placeholder="Dirección de la imagen del producto en la tienda" className={campo} />
        <span className="text-sm text-texto-suave">Solo fotos de la propia tienda (Amazon, Shopify o AliExpress). Clic derecho en la foto → «Copiar dirección de imagen».</span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-medium">¿Hasta cuándo dura la oferta? (opcional)</span>
        <input type="date" value={datos.caduca} onChange={cambiar("caduca")} className={`${campo} sm:w-60`} />
        <span className="text-sm text-texto-suave">Si no lo sabes, déjalo vacío: caduca solo a los 30 días o si la comunidad lo reporta.</span>
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" required checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-1" />
        <span>
          Confirmo que el precio es real y acepto las <Link href="/condiciones" className="underline">condiciones de uso</Link>.
        </span>
      </label>
      {estado === "error" && <p className="text-ambar">{mensaje}</p>}
      <button type="submit" disabled={estado === "enviando"} className="w-fit rounded bg-verde-boton px-6 py-2.5 font-medium text-white hover:bg-verde-boton-hover disabled:opacity-60">
        {estado === "enviando" ? "Publicando…" : "Publicar chollo"}
      </button>
    </form>
  );
}
