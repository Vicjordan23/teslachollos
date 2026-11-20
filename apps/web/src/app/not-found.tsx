import Link from "next/link";

export default function NoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">Este chollo ya no está</h1>
      <p className="text-texto-suave">Puede que haya caducado o que el enlace no sea correcto.</p>
      <Link href="/" className="rounded-full bg-verde-boton px-5 py-2 font-medium text-white">
        Ver todos los chollos
      </Link>
    </main>
  );
}
