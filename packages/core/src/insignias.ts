/** Insignias y niveles de la comunidad, calculados con datos reales (nada inventado). */
export interface Estadisticas {
  chollos: number;
  /** Suma de la temperatura de sus chollos. */
  grados: number;
  votos_dados: number;
  reportes_utiles: number;
  /** Alta de la cuenta (ISO). */
  creado: string;
}

export interface Insignia {
  id: string;
  nombre: string;
  descripcion: string;
}

const INSIGNIAS: (Insignia & { cumple: (e: Estadisticas, ahora: number) => boolean })[] = [
  { id: "primer-chollo", nombre: "Primer chollo", descripcion: "Ha publicado su primer chollo", cumple: (e) => e.chollos >= 1 },
  { id: "cazachollos", nombre: "Cazachollos", descripcion: "10 chollos publicados", cumple: (e) => e.chollos >= 10 },
  { id: "leyenda", nombre: "Leyenda", descripcion: "50 chollos publicados", cumple: (e) => e.chollos >= 50 },
  { id: "en-llamas", nombre: "En llamas", descripcion: "Sus chollos suman 100°", cumple: (e) => e.grados >= 100 },
  { id: "volcan", nombre: "Volcán", descripcion: "Sus chollos suman 1.000°", cumple: (e) => e.grados >= 1000 },
  { id: "votante", nombre: "Votante", descripcion: "Ha votado 50 chollos", cumple: (e) => e.votos_dados >= 50 },
  { id: "guardian", nombre: "Guardián", descripcion: "5 reportes útiles para la comunidad", cumple: (e) => e.reportes_utiles >= 5 },
  {
    id: "veterano",
    nombre: "Veterano",
    descripcion: "Más de un año en Chollesla",
    cumple: (e, ahora) => ahora - Date.parse(e.creado) >= 365 * 86_400_000,
  },
];

export function insigniasDe(e: Estadisticas, ahora = Date.now()): Insignia[] {
  return INSIGNIAS.filter((i) => i.cumple(e, ahora)).map(({ id, nombre, descripcion }) => ({ id, nombre, descripcion }));
}

const NIVELES = [
  { minimo: 0, nombre: "Novato" },
  { minimo: 50, nombre: "Aficionado" },
  { minimo: 250, nombre: "Experto" },
  { minimo: 1000, nombre: "Maestro" },
  { minimo: 5000, nombre: "Leyenda" },
];

/** Nivel según puntos: 10 por chollo, 1 por grado, 1 cada 5 votos dados y 5 por reporte útil. */
export function nivelDe(e: Estadisticas): { nivel: number; nombre: string; puntos: number; siguiente: number | null } {
  const puntos = Math.max(0, e.chollos * 10 + e.grados + Math.floor(e.votos_dados / 5) + e.reportes_utiles * 5);
  const i = NIVELES.reduce((ultimo, n, j) => (puntos >= n.minimo ? j : ultimo), 0);
  return { nivel: i + 1, nombre: NIVELES[i]!.nombre, puntos, siguiente: NIVELES[i + 1]?.minimo ?? null };
}
