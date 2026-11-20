import Image from "next/image";
import Link from "next/link";
import { aplicarAfiliado, avisoAfiliado, formatoEuros, precioFinal } from "@chollesla/core";

// Ficha de ejemplo con un producto real del catálogo de Vic (precio de precios.json del 16/11/2026).
// Se sustituirá por los datos de la base de datos en la fase 3.
const ejemplo = {
  titulo: "Protector de pantalla mate Spigen EZ Fit (15,4\")",
  modelos: "Model 3 2024-2026 y Model Y 2025-2026",
  enlace: "https://www.amazon.es/dp/B0GY6GB73J",
  precioTienda: 4199,
  fecha: "16/11/2026",
};

export default function Inicio() {
  const enlace = aplicarAfiliado(ejemplo.enlace);
  const tienda = enlace.estado === "ok" ? enlace.tienda : null;
  const aviso = avisoAfiliado(tienda);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/10 px-4 py-3 dark:border-white/10">
        <Link href="/" className="mx-auto flex max-w-5xl items-center gap-2" aria-label="Chollesla, inicio">
          <Image src="/icon.svg" alt="" width={44} height={44} priority />
          <span className="text-3xl font-semibold tracking-tight">chollesla</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">Chollos en accesorios para tu Tesla</h1>
          <p className="max-w-2xl text-lg opacity-80">
            Ofertas compartidas por la comunidad, con el precio final después del código de descuento. Vota las mejores y
            crea alertas para no perderte nada. Muy pronto.
          </p>
        </section>

        <article className="flex max-w-md flex-col gap-2 rounded-2xl border-2 border-rojo bg-suave p-5">
          <span className="w-fit rounded-full bg-rojo px-3 py-0.5 text-sm font-medium text-white">Chollo oficial</span>
          <h2 className="text-xl font-medium">{ejemplo.titulo}</h2>
          <p className="text-sm opacity-70">{ejemplo.modelos}</p>
          <p className="text-2xl font-semibold text-rojo">{formatoEuros(precioFinal(ejemplo.precioTienda, tienda))}</p>
          <p className="text-xs opacity-60">Precio del {ejemplo.fecha}; puede variar.</p>
          {enlace.estado === "ok" && (
            <a
              href={enlace.url}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="mt-2 w-fit rounded-full bg-negro px-5 py-2 font-medium text-white dark:bg-white dark:text-negro"
            >
              Ir al chollo
            </a>
          )}
          {aviso && <p className="text-xs opacity-60">{aviso}</p>}
        </article>
      </main>

      <footer className="border-t border-black/10 px-4 py-4 text-sm opacity-70 dark:border-white/10">
        <div className="mx-auto max-w-5xl">Chollesla no es una web oficial de Tesla ni está relacionada con Tesla, Inc.</div>
      </footer>
    </div>
  );
}
