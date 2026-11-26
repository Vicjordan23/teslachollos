/** Cálculos del panel de afiliados: periodos en días naturales de Madrid y tablas por día y por tienda. Funciones puras. */

export interface Clic {
  creado: string;
  tienda: string | null;
}

export interface Ingreso {
  id: number;
  fecha: string;
  tienda: string;
  clics_tienda: number;
  pedidos: number;
  ventas_cents: number;
  comision_cents: number;
  estado: string;
  origen: string;
  notas: string | null;
}

export interface Cifras {
  /** Clics en «Ir al chollo» contados por la web. */
  clics: number;
  /** Datos del programa de la tienda; null = todavía no hay dato cargado (no es un cero). */
  programa: { clics: number; pedidos: number; ventas: number; comision: number; incompleto: boolean } | null;
}

export const ZONA = "Europe/Madrid";

/** Fecha aaaa-mm-dd en Madrid de un instante. */
export const diaMadrid = (t: number) => new Date(t).toLocaleDateString("sv-SE", { timeZone: ZONA });

export const sumarDias = (dia: string, n: number) => new Date(Date.parse(`${dia}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

/** Instante (ms) en que empieza el día `dia` en Madrid: se prueba con UTC+1 y UTC+2 (horario de invierno y de verano). */
export function inicioDiaMadrid(dia: string): number {
  const medianocheUtc = Date.parse(`${dia}T00:00:00Z`);
  for (const h of [1, 2]) {
    const t = medianocheUtc - h * 3600_000;
    if (diaMadrid(t) === dia && diaMadrid(t - 1) !== dia) return t;
  }
  return medianocheUtc - 3600_000;
}

/**
 * Periodo pedido: «hoy», «ayer» o los últimos N días naturales (hoy incluido; por defecto 30).
 * `desde` (incluido) y `hasta` (excluido) son instantes ISO; `fechaDesde` y `fechaHasta`, días de Madrid (ambos incluidos).
 */
export function periodo(valor: string, ahora = Date.now()) {
  const hoy = diaMadrid(ahora);
  let fechaDesde = hoy;
  let fechaHasta = hoy;
  let etiqueta = valor;
  if (valor === "ayer") fechaDesde = fechaHasta = sumarDias(hoy, -1);
  else if (valor !== "hoy") {
    const n = Math.min(365, Math.max(1, Math.trunc(Number(valor)) || 30));
    etiqueta = String(n);
    fechaDesde = sumarDias(hoy, 1 - n);
  }
  return {
    etiqueta,
    fechaDesde,
    fechaHasta,
    desde: new Date(inicioDiaMadrid(fechaDesde)).toISOString(),
    hasta: new Date(inicioDiaMadrid(sumarDias(fechaHasta, 1))).toISOString(),
  };
}

/** Las cifras de varios días juntos (importadas como «RESUMEN…») no se pueden repartir por días ni sumarse con ellos. */
export const esResumen = (i: Ingreso) => /^\s*resumen/i.test(i.notas ?? "");

function sumar(c: Cifras, i: Ingreso): void {
  const t = c.programa ?? { clics: 0, pedidos: 0, ventas: 0, comision: 0, incompleto: false };
  c.programa = {
    clics: t.clics + i.clics_tienda,
    pedidos: t.pedidos + i.pedidos,
    ventas: t.ventas + i.ventas_cents,
    comision: t.comision + i.comision_cents,
    // La tienda no ha enseñado todas las cifras de algún día (Amazon, con poco tráfico).
    incompleto: t.incompleto || (i.notas ?? "").includes("[sin detalle]"),
  };
}

const vacia = (): Cifras => ({ clics: 0, programa: null });

/** Tablas por día (del más reciente al más antiguo; hasta 90 días salen todos, haya datos o no), por tienda y total. */
export function tablas(clics: Clic[], ingresos: Ingreso[], fechaDesde: string, fechaHasta: string) {
  const dias = new Map<string, Cifras>();
  const tiendas = new Map<string, Cifras>();
  const total = vacia();
  const en = (m: Map<string, Cifras>, k: string) => {
    let c = m.get(k);
    if (!c) m.set(k, (c = vacia()));
    return c;
  };
  for (let d = fechaHasta, n = 0; d >= fechaDesde && n < 90; d = sumarDias(d, -1), n++) en(dias, d);
  for (const c of clics) {
    en(dias, diaMadrid(Date.parse(c.creado))).clics++;
    en(tiendas, c.tienda ?? "sin tienda").clics++;
    total.clics++;
  }
  for (const i of ingresos) {
    if (esResumen(i) || i.fecha < fechaDesde || i.fecha > fechaHasta) continue;
    sumar(en(dias, i.fecha), i);
    sumar(en(tiendas, i.tienda), i);
    sumar(total, i);
  }
  return {
    dias: [...dias].map(([dia, c]) => ({ dia, ...c })).sort((a, b) => b.dia.localeCompare(a.dia)),
    tiendas: [...tiendas].map(([tienda, c]) => ({ tienda, ...c })).sort((a, b) => b.clics - a.clics || a.tienda.localeCompare(b.tienda)),
    total,
  };
}
