import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import { AVISO_AMAZON } from "@chollesla/core";
import { INDEXAR, SITIO } from "@/lib/sitio";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

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

const MENU = [
  { href: "/", texto: "Chollos" },
  { href: "/categoria/carga", texto: "Carga" },
  { href: "/categoria/alfombrillas", texto: "Alfombrillas" },
  { href: "/entrar", texto: "Alertas" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-10 border-b border-borde bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-2.5">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Chollesla, inicio">
              <Image src="/icon.svg" alt="" width={36} height={36} priority />
              <span className="text-2xl font-semibold tracking-tight">chollesla</span>
            </Link>
            <nav aria-label="Menú principal" className="hidden flex-1 items-center gap-1 text-sm sm:flex">
              {MENU.map((m) => (
                <Link key={m.href} href={m.href} className="rounded-full px-3 py-1.5 text-texto-suave hover:bg-fondo hover:text-texto">
                  {m.texto}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <Link href="/entrar" className="hidden rounded-full border border-borde px-3 py-1.5 hover:bg-fondo sm:inline-block">
                Publicar chollo
              </Link>
              <Link href="/entrar" className="rounded-full bg-verde-boton px-4 py-1.5 font-medium text-white hover:bg-verde-boton-hover">
                Entrar
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>

        <footer className="border-t border-borde bg-white px-4 py-6 text-sm text-texto-suave">
          <div className="mx-auto flex max-w-4xl flex-col gap-2">
            <p>Chollesla no es una web oficial de Tesla ni está relacionada con Tesla, Inc.</p>
            <p>
              Los enlaces a tiendas son de afiliado: Chollesla puede ganar una comisión si compras, sin coste extra para
              ti. {AVISO_AMAZON}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
