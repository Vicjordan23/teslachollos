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
        <Link href="/" className="rounded bg-verde-boton px-5 py-2 font-medium text-white hover:bg-verde-boton-hover">
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
          className="min-w-0 flex-1 rounded border border-borde bg-superficie px-4 py-2.5 outline-none focus:border-verde"
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="rounded bg-verde-boton px-6 py-2.5 font-medium text-white hover:bg-verde-boton-hover disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>
      {estado === "error" && <p className="text-ambar">{error}</p>}
      {process.env.NEXT_PUBLIC_LOGIN_GOOGLE === "si" && (
        <button
          type="button"
          onClick={async () => {
            try {
              localStorage.setItem("chollesla:volver", volver);
            } catch {
              /* nada */
            }
            await supabase()?.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/confirmar` } });
          }}
          className="flex items-center gap-2 rounded border border-borde bg-superficie px-5 py-2.5 font-medium hover:border-verde/40"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
            <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8z" />
            <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
          </svg>
          Entrar con Google
        </button>
      )}
      <p className="text-sm text-texto-suave">
        Al crear la cuenta aceptas las <Link href="/condiciones" className="underline">condiciones de uso</Link> y la{" "}
        <Link href="/privacidad" className="underline">política de privacidad</Link>.
      </p>
    </>
  );
}
