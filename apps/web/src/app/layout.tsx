import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fredoka } from "next/font/google";
import { AVISO_AMAZON } from "@chollesla/core";
import { CajaBusqueda } from "@/components/CajaBusqueda";
import { BotonCuenta } from "@/components/Cuenta";
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
  { href: "/modelo/model-y", texto: "Model Y" },
  { href: "/modelo/model-3", texto: "Model 3" },
  { href: "/alertas", texto: "Alertas" },
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
            <nav aria-label="Menú principal" className="hidden items-center gap-1 text-sm md:flex">
              {MENU.map((m) => (
                <Link key={m.href} href={m.href} className="rounded-full px-3 py-1.5 text-texto-suave hover:bg-fondo hover:text-texto">
                  {m.texto}
                </Link>
              ))}
            </nav>
            <CajaBusqueda className="hidden min-w-0 flex-1 sm:block" />
            <div className="ml-auto flex items-center gap-2 text-sm">
              <Link href="/publicar" className="hidden shrink-0 rounded-full border border-borde px-3 py-1.5 hover:bg-fondo lg:inline-block">
                Publicar chollo
              </Link>
              <BotonCuenta />
            </div>
          </div>
          <div className="mx-auto max-w-4xl px-4 pb-2.5 sm:hidden">
            <CajaBusqueda />
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
            <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/aviso-legal" className="hover:text-texto hover:underline">Aviso legal</Link>
              <Link href="/privacidad" className="hover:text-texto hover:underline">Privacidad</Link>
              <Link href="/cookies" className="hover:text-texto hover:underline">Cookies</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
