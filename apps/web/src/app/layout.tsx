import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Barlow, Rajdhani } from "next/font/google";
import { AVISO_AMAZON, CATEGORIAS, MODELOS } from "@chollesla/core";
import { CajaBusqueda } from "@/components/CajaBusqueda";
import { BotonCuenta } from "@/components/Cuenta";
import { INDEXAR, SITIO } from "@/lib/sitio";
import "./globals.css";

const cuerpo = Barlow({ variable: "--font-cuerpo", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const display = Rajdhani({ variable: "--font-display-next", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Chollesla · Chollos en accesorios para tu Tesla",
    template: "%s · Chollesla",
  },
  description:
    "Chollos de accesorios para Tesla en España con el precio final después del código de descuento.",
  robots: INDEXAR ? undefined : { index: false, follow: false },
};

const TELEGRAM = "https://t.me/teslaaccesorios";

const MENU = [
  { href: "/buscar?orden=descuento", texto: "Ofertas" },
  { href: "/comunidad", texto: "Comunidad" },
  { href: "/alertas", texto: "Alertas" },
];

const DESPLEGABLE =
  "absolute left-0 top-full z-30 mt-1 flex max-h-96 w-60 flex-col overflow-y-auto rounded-xl border border-borde bg-superficie p-2 shadow-xl";
const ENLACE_MENU = "flex items-center gap-2 rounded px-3 py-2 text-texto hover:bg-fondo hover:text-verde-boton";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${cuerpo.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-borde border-t-2 border-t-verde-boton bg-superficie">
          <div className="mx-auto flex max-w-[1250px] items-center gap-3 px-4 py-3">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Chollesla, inicio">
              <Image src="/icon.svg" alt="" width={36} height={36} priority />
              <span className="font-display text-3xl font-bold uppercase tracking-[0.12em]">chollesla</span>
            </Link>
            <details className="group relative hidden shrink-0 md:block">
              <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded border border-white/35 bg-superficie px-4 text-sm font-bold marker:hidden">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                Menú
              </summary>
              <div className={DESPLEGABLE}>
                {MENU.map((m) => (
                  <Link key={m.href} href={m.href} className={ENLACE_MENU}>
                    {m.texto}
                  </Link>
                ))}
                <Link href="/publicar" className={ENLACE_MENU}>Publicar chollo</Link>
              </div>
            </details>
            <CajaBusqueda className="hidden min-w-0 flex-1 sm:block" />
            <div className="ml-auto flex items-center gap-3 sm:ml-0">
              <Link href="/alertas" className="hidden shrink-0 items-center gap-2 px-3 text-sm font-bold hover:text-verde-boton lg:flex">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4" />
                </svg>
                Crear alerta
              </Link>
              <BotonCuenta />
              <Link
                href="/publicar"
                className="hidden shrink-0 items-center gap-2 rounded border border-verde-boton px-5 py-2 text-sm font-bold text-verde-boton hover:bg-verde-boton hover:text-white sm:flex"
              >
                <span className="text-xl leading-none">+</span> Comparte
              </Link>
            </div>
          </div>
          <div className="mx-auto max-w-[1250px] px-4 pb-3 sm:hidden">
            <CajaBusqueda />
          </div>
          <nav aria-label="Menú principal" className="mx-auto flex max-w-[1250px] items-center gap-1 overflow-x-auto px-4 pb-3 text-sm font-bold">
            <details className="group relative shrink-0">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 font-bold marker:hidden hover:text-verde-boton">
                Categorías <span aria-hidden className="text-xs">▾</span>
              </summary>
              <div className={DESPLEGABLE}>
                {CATEGORIAS.map((c) => (
                  <Link key={c.id} href={`/categoria/${c.id}`} className={ENLACE_MENU}>
                    {c.nombre}
                  </Link>
                ))}
              </div>
            </details>
            <details className="group relative shrink-0">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg bg-superficie px-3 py-2 font-bold marker:hidden hover:text-verde-boton">
                Modelos <span aria-hidden className="text-xs">▾</span>
              </summary>
              <div className={DESPLEGABLE}>
                {MODELOS.map((m) => (
                  <Link key={m.id} href={`/modelo/${m.id}`} className={ENLACE_MENU}>
                    {m.nombre}
                  </Link>
                ))}
              </div>
            </details>
            {MENU.map((m) => (
              <Link key={m.href} href={m.href} className="shrink-0 rounded-lg px-3 py-2 font-bold hover:text-verde-boton">
                {m.texto}
              </Link>
            ))}
            <a href={TELEGRAM} target="_blank" rel="noopener" className="shrink-0 rounded-lg px-3 py-2 font-bold hover:text-verde-boton">
              Telegram
            </a>
          </nav>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>

        <footer className="border-t border-borde bg-superficie px-4 py-6 text-sm text-texto-suave">
          <div className="mx-auto flex max-w-[1250px] flex-col gap-2">
            <p>Chollesla no es una web oficial de Tesla ni está relacionada con Tesla, Inc.</p>
            <p>
              Los enlaces a tiendas son de afiliado: Chollesla puede ganar una comisión si compras, sin coste extra para
              ti. {AVISO_AMAZON}
            </p>
            <p>
              Más chollos en nuestro canal de Telegram:{" "}
              <a href={TELEGRAM} target="_blank" rel="noopener" className="font-medium text-texto hover:underline">
                t.me/teslaaccesorios
              </a>
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/aviso-legal" className="hover:text-texto hover:underline">Aviso legal</Link>
              <Link href="/privacidad" className="hover:text-texto hover:underline">Privacidad</Link>
              <Link href="/cookies" className="hover:text-texto hover:underline">Cookies</Link>
              <Link href="/condiciones" className="hover:text-texto hover:underline">Condiciones de uso</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
