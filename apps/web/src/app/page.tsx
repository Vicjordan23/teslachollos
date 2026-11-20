import Image from "next/image";
import Link from "next/link";
import { TarjetaChollo, type DatosChollo } from "@/components/TarjetaChollo";

// Ejemplos con productos reales del catálogo de Vic (precios.json e imagenes_ig.json del 16/11/2026).
// Se sustituirán por los datos de la base de datos en la fase 3.
const ejemplos: DatosChollo[] = [
  {
    titulo: "Protector de pantalla mate Spigen EZ Fit (15,4\")",
    modelos: "Model 3 2024-2026 y Model Y 2025-2026",
    enlace: "https://www.amazon.es/dp/B0GY6GB73J",
    foto: "https://m.media-amazon.com/images/I/61n8sLuvvrL._AC_SL1200_.jpg",
    precioTienda: 4199,
    fecha: "16/11/2026",
    oficial: true,
  },
  {
    titulo: "Soporte giratorio para la pantalla central",
    modelos: "Model 3 Highland",
    enlace: "https://www.hansshow.com/products/model-3-y-dashboard-touch-screen-swiveling-mount-kit",
    foto: "https://cdn.shopify.com/s/files/1/0632/8080/8148/products/hansshow-Model-3-Y-Dashboard-Touch-Screen-Swiveling-Mount-kit-1.jpg?v=1705888146",
    precioTienda: 11495,
    fecha: "16/11/2026",
    oficial: true,
  },
];

export default function Inicio() {
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

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Chollos">
          {ejemplos.map((c) => (
            <TarjetaChollo key={c.enlace} chollo={c} />
          ))}
        </section>
      </main>

      <footer className="border-t border-black/10 px-4 py-4 text-sm opacity-70 dark:border-white/10">
        <div className="mx-auto max-w-5xl">Chollesla no es una web oficial de Tesla ni está relacionada con Tesla, Inc.</div>
      </footer>
    </div>
  );
}
