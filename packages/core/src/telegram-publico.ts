/** En cada canal se restan Vic y el bot: no cuentan como suscriptores. */
export const NO_CUENTAN = 2;

export function leerSuscriptores(html: string): number | null {
  const m = html.match(/tgme_page_extra">\s*(\d[\d\s,.]*?)\s*(?:subscribers?|members?)/i);
  if (!m) return null;
  return Math.max(0, Number(m[1]!.replace(/\D/g, "")) - NO_CUENTAN);
}

/** «850», «1.2K», «3M» → número. */
export function leerVistas(html: string): number[] {
  return [...html.matchAll(/tgme_widget_message_views">\s*([\d.]+)([KM]?)\s*</g)].map((m) =>
    Math.round(Number(m[1]) * (m[2] === "M" ? 1e6 : m[2] === "K" ? 1e3 : 1)),
  );
}
