"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEstado } from "@/lib/interacciones";
import { CUENTAS_ACTIVAS, supabase } from "@/lib/supabase";

/** Ruta interna segura a la que volver tras entrar (nada de URLs externas). */
export function rutaSegura(v: string | null): string {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

export function FormEntrar() {
  const params = useSearchParams();
  const volver = rutaSegura(params.get("volver"));
  const router = useRouter();
  const { sesion } = useEstado();
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "enviado" | "error">("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sesion) router.replace(volver === "/" ? "/cuenta" : volver);
  }, [sesion, volver, router]);

  if (!CUENTAS_ACTIVAS) {
    return (
      <>
        <h1 className="text-3xl font-semibold">Muy pronto podrás crear tu cuenta</h1>
        <p className="text-texto-suave">
          Con tu cuenta gratuita podrás votar los chollos (temperatura), guardarlos, publicar los tuyos y crear alertas.
        </p>
        <Link href="/" className="rounded-full bg-verde-boton px-5 py-2 font-medium text-white hover:bg-verde-boton-hover">
          Ver los chollos
        </Link>
      </>
    );
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabase();
    if (!sb) return;
    setEstado("enviando");
    try {
      localStorage.setItem("chollesla:volver", volver);
    } catch {
      /* sin almacenamiento: se vuelve a /cuenta */
    }
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${location.origin}/auth/confirmar`, shouldCreateUser: true },
    });
    if (error) {
      setError(error.status === 429 ? "Demasiados intentos. Espera unos minutos." : "No se pudo enviar el email. Revisa la dirección.");
      setEstado("error");
    } else setEstado("enviado");
  };

  if (estado === "enviado") {
    return (
      <>
        <h1 className="text-3xl font-semibold">Revisa tu correo</h1>
        <p className="text-texto-suave">
          Te hemos enviado un enlace a <strong className="text-texto">{email}</strong>. Ábrelo en este mismo navegador para
          entrar. Si no llega en un par de minutos, mira en spam.
        </p>
        <button type="button" onClick={() => setEstado("")} className="text-verde underline">
          Usar otro email
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-semibold">Entra o crea tu cuenta</h1>
      <p className="text-texto-suave">
        Gratis y sin contraseña: te enviamos un enlace por email. Con tu cuenta puedes votar la temperatura, guardar
        chollos, crear alertas y publicar los tuyos.
      </p>
      <form onSubmit={enviar} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          aria-label="Email"
          className="min-w-0 flex-1 rounded-full border border-borde bg-white px-4 py-2.5 outline-none focus:border-verde"
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="rounded-full bg-verde-boton px-6 py-2.5 font-medium text-white hover:bg-verde-boton-hover disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>
      {estado === "error" && <p className="text-ambar">{error}</p>}
      <p className="text-sm text-texto-suave">
        Al crear la cuenta aceptas las <Link href="/condiciones" className="underline">condiciones de uso</Link> y la{" "}
        <Link href="/privacidad" className="underline">política de privacidad</Link>.
      </p>
    </>
  );
}
