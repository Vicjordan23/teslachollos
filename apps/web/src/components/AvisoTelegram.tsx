import { TIENDAS, type IdTienda } from "@chollesla/core";
import { CanalesMarca } from "@/components/CanalesMarca";
import { canalDe, TELEGRAM } from "@/lib/telegram";

const BOTON = "rounded-lg bg-verde-boton px-4 py-2 text-sm font-medium text-white hover:opacity-90";

/** Llamada a la acción a los canales de Telegram (fichas, guías y páginas de tienda). Con `tienda` destaca su canal. */
export function AvisoTelegram({ texto, tienda }: { texto?: string; tienda?: IdTienda }) {
  const nombre = tienda && TIENDAS[tienda].nombre.replace(".es", "");
  return (
    <aside aria-label="Canales de Telegram" className="flex max-w-3xl flex-col gap-3 rounded-xl border border-borde bg-superficie p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          <b>🔔 Alertas de chollos Tesla en Telegram.</b>{" "}
          {texto ?? "Un accesorio con su precio final cada 30 minutos, gratis y sin spam."}
        </p>
        <div className="flex flex-wrap gap-2">
          {tienda && (
            <a href={canalDe(tienda)} target="_blank" rel="noopener" className={BOTON}>
              Canal solo de {nombre}
            </a>
          )}
          <a href={TELEGRAM} target="_blank" rel="noopener" className={BOTON}>
            Canal con todo
          </a>
        </div>
      </div>
      <CanalesMarca />
    </aside>
  );
}
