import { TELEGRAM } from "@/lib/telegram";

/** Llamada a la acción a la comunidad de Telegram: un solo enlace (el canal principal), desde donde se ven los canales por tienda. */
export function AvisoTelegram({ texto }: { texto?: string }) {
  return (
    <aside aria-label="Comunidad de Telegram" className="flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-xl border border-borde bg-superficie p-4">
      <p className="max-w-xl text-sm">
        <b>🔔 Comunidad Chollesla en Telegram.</b>{" "}
        {texto ?? "Un accesorio con su precio final cada 30 minutos, gratis y sin spam."} Dentro tienes también un canal por tienda.
      </p>
      <a href={TELEGRAM} target="_blank" rel="noopener" className="rounded-lg bg-verde-boton px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        Unirme a la comunidad
      </a>
    </aside>
  );
}
