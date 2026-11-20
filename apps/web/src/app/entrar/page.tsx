import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default function Entrar() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">Muy pronto podrás crear tu cuenta</h1>
      <p className="text-texto-suave">
        Con tu cuenta gratuita podrás votar los chollos (temperatura), guardarlos, publicar los tuyos y crear alertas por
        email cuando aparezca lo que buscas.
      </p>
      <Link href="/" className="rounded-full bg-verde-boton px-5 py-2 font-medium text-white hover:bg-verde-boton-hover">
        Ver los chollos
      </Link>
    </main>
  );
}
