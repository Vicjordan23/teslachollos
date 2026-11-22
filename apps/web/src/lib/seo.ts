/** Recorta un texto a `max` caracteres sin partir palabras. */
export function acortar(texto: string, max: number): string {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max - 1);
  const ultimo = corte.lastIndexOf(" ");
  return `${(ultimo > max * 0.6 ? corte.slice(0, ultimo) : corte).replace(/[\s,.;:\-–]+$/, "")}…`;
}
