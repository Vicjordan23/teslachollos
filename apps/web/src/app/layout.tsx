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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 px-4 py-3 dark:border-white/10">
          <Link href="/" className="mx-auto flex max-w-5xl items-center gap-2" aria-label="Chollesla, inicio">
            <Image src="/icon.svg" alt="" width={44} height={44} priority />
            <span className="text-3xl font-semibold tracking-tight">chollesla</span>
          </Link>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>

        <footer className="border-t border-black/10 px-4 py-6 text-sm opacity-70 dark:border-white/10">
          <div className="mx-auto flex max-w-5xl flex-col gap-2">
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
