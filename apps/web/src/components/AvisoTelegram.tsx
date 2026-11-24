const TELEGRAM = "https://t.me/teslaaccesorios";

/** Llamada a la acción al canal de Telegram (fichas y guías). */
export function AvisoTelegram({ texto }: { texto?: string }) {
  return (
    <aside aria-label="Canal de Telegram" className="flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-xl border border-borde bg-superficie p-4">
      <p className="text-sm">
        <b>🔔 Alertas de chollos Tesla en Telegram.</b>{" "}
        {texto ?? "Un accesorio con su precio final cada 30 minutos, gratis y sin spam."}
      </p>
      <a
        href={TELEGRAM}
        target="_blank"
        rel="noopener"
        className="rounded-lg bg-verde-boton px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Unirme al canal
      </a>
    </aside>
  );
}
