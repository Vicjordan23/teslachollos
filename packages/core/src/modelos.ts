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
  const encontrados = modelosNombrados(texto);
  return encontrados.size > 0 ? MODELOS.map((m) => m.id).filter((id) => encontrados.has(id)) : MODELOS.map((m) => m.id);
}

const sinAcentos = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Modelos que el texto nombra de forma explícita (vacío si no nombra ninguno). */
function modelosNombrados(texto: string): Set<IdModelo> {
  const t = sinAcentos(texto);
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
  return encontrados;
}

/** Versiones (generaciones y acabados) de los dos modelos con filtro fino: Model 3 y Model Y. */
export type IdVersion =
  | "model-3-antiguo"
  | "model-3-highland"
  | "model-3-standard"
  | "model-y-antiguo"
  | "model-y-juniper"
  | "model-y-standard"
  | "model-y-l";

export const VERSIONES: { id: IdVersion; modelo: "model-3" | "model-y"; nombre: string; detalle: string }[] = [
  { id: "model-3-antiguo", modelo: "model-3", nombre: "Antiguo", detalle: "2017-2023" },
  { id: "model-3-highland", modelo: "model-3", nombre: "Highland", detalle: "2024 en adelante" },
  { id: "model-3-standard", modelo: "model-3", nombre: "Standard", detalle: "versión básica" },
  { id: "model-y-antiguo", modelo: "model-y", nombre: "Antiguo", detalle: "2020-2024" },
  { id: "model-y-juniper", modelo: "model-y", nombre: "Juniper", detalle: "2025 en adelante" },
  { id: "model-y-standard", modelo: "model-y", nombre: "Standard", detalle: "versión básica" },
  { id: "model-y-l", modelo: "model-y", nombre: "Model Y L", detalle: "6 plazas, más larga" },
];

export function versionesDeModelo(modelo: IdModelo) {
  return VERSIONES.filter((v) => v.modelo === modelo);
}

export function nombreVersion(id: IdVersion): string {
  const v = VERSIONES.find((x) => x.id === id)!;
  if (v.nombre.startsWith("Model")) return v.nombre;
  return `${v.modelo === "model-3" ? "Model 3" : "Model Y"} ${v.nombre}`;
}

// Año a partir del cual el coche es de la generación nueva.
const CORTE = { "model-3": 2024, "model-y": 2025 } as const;
const NO_STANDARD = /\bno\s+(?:es\s+)?(?:para\s+)?(?:la\s+)?(?:version\s+)?(?:new\s+)?standard\b/;

function anios(t: string): [number, number][] {
  const salida: [number, number][] = [];
  const completo = (n: string) => (n.length === 2 ? 2000 + Number(n) : Number(n));
  for (const m of t.matchAll(/\b(20\d{2})\s*[-–]\s*(\d{2,4})\b/g)) salida.push([Number(m[1]), completo(m[2]!)]);
  const sinRangos = t.replace(/\b20\d{2}\s*[-–]\s*\d{2,4}\b/g, " ");
  for (const m of sinRangos.matchAll(/\b(20\d{2})\s*(\+)?/g)) salida.push([Number(m[1]), m[2] ? 2099 : Number(m[1])]);
  return salida;
}

/**
 * Versiones compatibles a partir del texto «modelos» del chollo. Reglas:
 * - «Highland» / «Juniper» (o los años 2024+ en el Model 3, 2025+ en el Model Y) = generación nueva; el resto, antigua.
 * - La generación nueva incluye su versión Standard, salvo que el texto la excluya («no para New Standard»).
 * - Si nombra el modelo sin decir versión ni años, vale para todas (menos la Model Y L, que solo si se nombra).
 * - Si no nombra ningún modelo (universal), vale para todas las versiones.
 */
export function versionesDe(texto: string): IdVersion[] {
  const t = sinAcentos(texto);
  const nombrados = modelosNombrados(texto);
  if (nombrados.size === 0) return VERSIONES.map((v) => v.id);
  const segmentos = t.split(/[,;]|\s+y\s+(?=model|my\b|m3\b)|\s*\/\s*(?=model)/).map((s) => s.trim());
  const globales = anios(t);
  const salida = new Set<IdVersion>();
  const excluyeStandard = NO_STANDARD.test(t);

  for (const modelo of ["model-3", "model-y"] as const) {
    if (!nombrados.has(modelo)) continue;
    const es3 = modelo === "model-3";
    const nombra = es3 ? /\bmodel[o]?\s*3\b|\bm3\b|\b3\s+highland\b/ : /\bmodel[o]?\s*y\b|\bmy\b|\by\s+juniper\b/;
    const info = segmentos.filter((s) => nombra.test(s)).join(" ; ");
    const nueva = (es3 ? "model-3-highland" : "model-y-juniper") as IdVersion;
    const std = (es3 ? "model-3-standard" : "model-y-standard") as IdVersion;
    const antiguo = (es3 ? "model-3-antiguo" : "model-y-antiguo") as IdVersion;
    const v = new Set<IdVersion>();
    if (es3 ? /\bhighland\b|\bnew model 3\b/.test(info) : /\bjuniper\b/.test(info)) {
      v.add(nueva);
      if (!excluyeStandard) v.add(std);
    }
    if (/\bstandard\b/.test(info.replace(new RegExp(NO_STANDARD, "g"), ""))) v.add(std);
    if (!es3 && /\bmodel\s*y\s+l\b/.test(info)) v.add("model-y-l");
    if (/\bperformance\b/.test(info) && v.size === 0) v.add(nueva);
    // Años: los del propio texto del modelo o, si no tiene versión ni años, los generales del chollo.
    const propios = anios(info);
    const rangos = propios.length > 0 ? propios : v.size === 0 ? globales : [];
    for (const [desde, hasta] of rangos) {
      if (desde < CORTE[modelo]) v.add(antiguo);
      if (hasta >= CORTE[modelo]) {
        v.add(nueva);
        if (!excluyeStandard) v.add(std);
      }
    }
    if (v.size === 0) {
      v.add(antiguo);
      v.add(nueva);
      if (!excluyeStandard) v.add(std);
    }
    for (const x of v) salida.add(x);
  }
  return VERSIONES.map((v) => v.id).filter((id) => salida.has(id));
}

export interface EtiquetaModelo {
  /** Identificador estable (sirve para el color): «model-3», «model-y-juniper», «universal»… */
  id: string;
  texto: string;
  modelo: IdModelo | null;
  version: IdVersion | null;
}

/**
 * Cuadros de compatibilidad de un chollo, uno por modelo o versión: «Model Y» si vale para todas sus versiones,
 * «Model Y Juniper» si solo para algunas, y «Todos los Tesla» si es universal.
 */
export function etiquetasDe(texto: string): EtiquetaModelo[] {
  const modelos = modelosDe(texto);
  const versiones = versionesDe(texto);
  if (modelos.length === MODELOS.length && versiones.length === VERSIONES.length) {
    return [{ id: "universal", texto: "Todos los Tesla", modelo: null, version: null }];
  }
  const salida: EtiquetaModelo[] = [];
  for (const m of MODELOS) {
    if (!modelos.includes(m.id)) continue;
    const propias = VERSIONES.filter((v) => v.modelo === m.id && versiones.includes(v.id));
    if (propias.length === 0) {
      salida.push({ id: m.id, texto: m.nombre, modelo: m.id, version: null });
      continue;
    }
    const basicas = VERSIONES.filter((v) => v.modelo === m.id && v.id !== "model-y-l");
    if (basicas.every((v) => propias.some((p) => p.id === v.id))) {
      salida.push({ id: m.id, texto: m.nombre, modelo: m.id, version: null });
      for (const v of propias.filter((v) => v.id === "model-y-l")) salida.push({ id: v.id, texto: nombreVersion(v.id), modelo: m.id, version: v.id });
    } else {
      for (const v of propias) salida.push({ id: v.id, texto: nombreVersion(v.id), modelo: m.id, version: v.id });
    }
  }
  return salida;
}
