"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MisChollos } from "@/components/MisChollos";
import { aliasCreado, useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";

/** Botón de la cabecera: «Entrar» o el alias. */
export function BotonCuenta() {
  const { sesion, alias } = useEstado();
  const clase = "flex shrink-0 items-center gap-2 px-2 py-1.5 font-semibold hover:text-verde-boton";
  if (!sesion) {
    return (
      <Link href="/entrar" className={clase}>
        Regístrate / Inicia sesión
      </Link>
    );
  }
  return (
    <Link href="/cuenta" className={`${clase} max-w-32 truncate`} title="Mi cuenta">
      {alias ? `@${alias}` : "Mi cuenta"}
    </Link>
  );
}

/** Formulario para elegir el alias público (obligatorio antes de votar). */
export function ElegirAlias({ alTerminar }: { alTerminar?: () => void }) {
  const { sesion } = useEstado();
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const valido = /^[a-z0-9_]{3,20}$/.test(alias);
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabase();
    if (!sb || !sesion || !valido) return;
    const { error } = await sb.from("perfiles").insert({ id: sesion.user.id, alias });
    if (error) setError(error.code === "23505" ? "Ese alias ya está cogido. Prueba con otro." : "No se pudo guardar. Inténtalo de nuevo.");
    else {
      aliasCreado(alias);
      alTerminar?.();
    }
  };
  return (
    <form onSubmit={enviar} className="flex w-full flex-col gap-2">
      <label htmlFor="alias" className="font-medium">
        Elige tu alias público
      </label>
      <p className="text-sm text-texto-suave">De 3 a 20 letras minúsculas, números o «_». Es lo que verán los demás.</p>
      <div className="flex gap-2">
        <input
          id="alias"
          value={alias}
          onChange={(e) => {
            setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20));
            setError("");
          }}
          placeholder="tu_alias"
          className="min-w-0 flex-1 rounded-full border border-borde bg-superficie px-4 py-2.5 outline-none focus:border-verde"
        />
        <button type="submit" disabled={!valido} className="rounded-full bg-verde-boton px-5 py-2.5 font-medium text-white disabled:opacity-50">
          Guardar
        </button>
      </div>
      {error && <p className="text-ambar">{error}</p>}
    </form>
  );
}

/** Tras pulsar el enlace del email: Supabase canjea el código y se vuelve a donde estaba. */
export function Confirmar() {
  const { sesion, listo, alias } = useEstado();
  const router = useRouter();
  const [tarde, setTarde] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTarde(true), 8000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!sesion || !alias) return;
    let volver = "/";
    try {
      volver = localStorage.getItem("chollesla:volver") ?? "/";
      localStorage.removeItem("chollesla:volver");
    } catch {
      /* nada */
    }
    router.replace(volver.startsWith("/") && !volver.startsWith("//") ? volver : "/");
  }, [sesion, alias, router]);

  if (sesion && alias === undefined) return <p className="text-texto-suave">Entrando…</p>;
  if (sesion && alias === null) {
    return (
      <>
        <h1 className="text-3xl font-semibold">¡Ya estás dentro!</h1>
        <ElegirAlias />
      </>
    );
  }
  if (listo && !sesion && tarde) {
    return (
      <>
        <h1 className="text-3xl font-semibold">El enlace no ha funcionado</h1>
        <p className="text-texto-suave">Puede que haya caducado o que lo hayas abierto en otro navegador. Pide uno nuevo.</p>
        <Link href="/entrar" className="rounded-full bg-verde-boton px-5 py-2 font-medium text-white">
          Volver a entrar
        </Link>
      </>
    );
  }
  return <p className="text-texto-suave">Entrando…</p>;
}

/** Página de la cuenta: alias, accesos y cerrar sesión. */
export function MiCuenta() {
  const { sesion, alias, listo } = useEstado();
  const router = useRouter();
  useEffect(() => {
    if (listo && !sesion) router.replace("/entrar?volver=/cuenta");
  }, [listo, sesion, router]);
  if (!sesion) return <p className="text-texto-suave">Cargando…</p>;
  return (
    <>
      <h1 className="text-3xl font-semibold">{alias ? `@${alias}` : "Mi cuenta"}</h1>
      <p className="text-texto-suave">{sesion.user.email}</p>
      {alias === null && <ElegirAlias />}
      <nav className="flex flex-wrap gap-2">
        {[
          ["/guardados", "Mis guardados"],
          ["/alertas", "Mis alertas"],
          ["/publicar", "Publicar un chollo"],
          ...(alias ? [[`/u/${alias}`, "Mi perfil público"]] : []),
        ].map(([href, texto]) => (
          <Link key={href} href={href} className="rounded-full border border-borde bg-superficie px-4 py-2 hover:border-verde/40">
            {texto}
          </Link>
        ))}
      </nav>
      <MisChollos />
      <button
        type="button"
        onClick={async () => {
          await supabase()?.auth.signOut();
          router.replace("/");
        }}
        className="text-sm text-texto-suave underline"
      >
        Cerrar sesión
      </button>
      <p className="text-sm text-texto-suave">
        Para borrar tu cuenta y tus datos, escríbenos desde este email al contacto del <Link href="/aviso-legal" className="underline">aviso legal</Link>.
      </p>
    </>
  );
}
