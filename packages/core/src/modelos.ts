/** Modelos de Tesla para filtrar chollos. «Universal» (p. ej. cables Tipo 2) vale para todos. */
export type IdModelo = "model-3" | "model-y" | "model-s" | "model-x" | "cybertruck";

export const MODELOS: { id: IdModelo; nombre: string }[] = [
  { id: "model-y", nombre: "Model Y" },
  { id: "model-3", nombre: "Model 3" },
  { id: "model-s", nombre: "Model S" },
  { id: "model-x", nombre: "Model X" },
  { id: "cybertruck", nombre: "Cybertruck" },
];

export function nombreModelo(id: IdModelo): string {
  return MODELOS.find((m) => m.id === id)!.nombre;
}

/**
 * Modelos compatibles a partir del texto «modelos» del chollo («Model 3 Highland 2024-2026 y Model Y Juniper»,
 * «Model 3, Y, X y S», «Model 3/Y»…). Si no nombra ningún modelo («Cualquier coche con conector Tipo 2»), devuelve
 * todos: es universal.
 */
export function modelosDe(texto: string): IdModelo[] {
  const t = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const encontrados = new Set<IdModelo>();
  // «model 3, y, x y s», «model 3/y», «model y / y juniper», «modelo s y x»
  for (const m of t.matchAll(/\bmodel[o]?\s*([3syx]\b(?:\s*(?:[\/,]|\by\b|\be\b)\s*[3syx]\b)*)/g)) {
    // «3 y x»: esa «y» es la conjunción (va seguida de otro modelo); «3, y» o «3/y» sí es el Model Y.
    const grupo = m[1]!.replace(/\s+[ye]\s+(?=[3sx]\b)/g, ",");
    for (const letra of grupo.match(/(?<![a-z])[3syx](?![a-z])/g) ?? []) encontrados.add(`model-${letra}` as IdModelo);
  }
  if (/\b(cybertruck|cyber truck)\b/.test(t)) encontrados.add("cybertruck");
  if (/\bmy\b/.test(t)) encontrados.add("model-y");
  if (/\bm3\b/.test(t)) encontrados.add("model-3");
  return encontrados.size > 0 ? MODELOS.map((m) => m.id).filter((id) => encontrados.has(id)) : MODELOS.map((m) => m.id);
}
