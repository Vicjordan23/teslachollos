/**
 * Texto propio de cada ficha, generado en el momento (build/render) solo con datos reales del catálogo: título,
 * compatibilidad que declara la tienda, categoría, tienda, precio y código, estadísticas del propio catálogo y, si
 * existen, opiniones reales de compradores o un cambio de precio registrado. Función pura: nada se guarda en
 * oficiales.json (el importador diario lo reescribe).
 *
 * Reglas: no se inventan especificaciones, materiales, puntuaciones ni urgencia. Lo que sale del título se atribuye al
 * título de la tienda; los consejos de compra son comprobaciones genéricas («mira que…»), no afirmaciones sobre el producto.
 */
import { nombreCategoria, type IdCategoria } from "./categorias.js";
import { etiquetasDe, versionesDe, VERSIONES, nombreVersion, type IdVersion } from "./modelos.js";
import { formatoEuros, porcentajeAhorro, precioFinal } from "./precio.js";
import type { PreguntaFrecuente } from "./seo.js";
import { TIENDAS, type IdTienda } from "./tiendas.js";

export const MIN_PALABRAS = 120;
export const MAX_PALABRAS = 250;

/** Lo mínimo de una ficha que necesita el generador (un `CholloOficial` ya lo cumple). */
export interface EntradaFicha {
  id: string;
  slug: string;
  tienda: IdTienda;
  categoria: IdCategoria;
  titulo: string;
  modelos: string;
  /** Precio en tienda en céntimos, antes del código. */
  precioTienda: number;
  desde: boolean;
  /** Fecha del precio, aaaa-mm-dd. */
  fecha: string;
}

/** Datos opcionales que, si existen, añaden un bloque (nunca se inventan). */
export interface ExtrasFicha {
  /** Resumen real de opiniones de compradores de Amazon.es (opiniones.json). */
  opinion?: string;
  /** Cambio de precio registrado por el agente de precios (precios de tienda, sin código, en céntimos). */
  historial?: { anterior: number; fechaCambio: string };
}

export interface SeccionTexto {
  id: string;
  titulo: string;
  parrafos: string[];
  puntos: string[];
}

export interface TextoFicha {
  /** Primer párrafo: sirve de descripción del producto en el JSON-LD (se ve en la página). */
  resumen: string;
  secciones: SeccionTexto[];
  faq: PreguntaFrecuente[];
  /** Palabras del cuerpo (párrafos y puntos de las secciones; sin títulos ni FAQ). */
  palabras: number;
}

// ───────────────────────── utilidades ─────────────────────────

export function hash32(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function elegir<T>(opciones: readonly T[], clave: string): T {
  return opciones[hash32(clave) % opciones.length]!;
}

const sinAcentos = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const minuscula1 = (t: string) => (t.length > 0 ? t[0]!.toLowerCase() + t.slice(1) : t);

export function contarPalabras(texto: string): number {
  const t = texto.trim();
  return t ? t.split(/\s+/).length : 0;
}

function recortar(texto: string, max: number): string {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max);
  const ultimo = corte.lastIndexOf(" ");
  const limpiar = (x: string) => x.replace(/[\s,.;:\-–(\[/]+$/, "");
  let r = limpiar(ultimo > max * 0.5 ? corte.slice(0, ultimo) : corte);
  // Sin palabras sueltas al final («…para», «…con», «…mejor»).
  const colgantes = /\s+(?:de|del|la|el|los|las|para|con|y|e|en|a|al|por|un|una|sin|mejor|más|mas|the|for|with|and|of|to|in|on)$/i;
  while (colgantes.test(r)) r = limpiar(r.replace(colgantes, ""));
  return r;
}

/** Algunos títulos importados traen entidades HTML («&amp;»): se decodifican antes de usarlos en el texto. */
function decodificar(t: string): string {
  return t.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&(?:lt|gt);/g, " ");
}

/** Título para usarlo dentro de una frase: sin comillas dentro ni puntos suspensivos; las pulgadas se escriben. */
function tituloCorto(titulo: string): string {
  return recortar(
    decodificar(titulo)
      .replace(/(\d)\s?["″”]/g, "$1 pulgadas")
      .replace(/[«»"“”]/g, "")
      .replace(/\s*\(Jowua\)\s*$/i, ""),
    90,
  );
}

function lista(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

// ───────────────────── datos que cita el título ─────────────────────

const MATERIALES: [RegExp, string][] = [
  [/fibra de carbono|carbon fiber/, "fibra de carbono"],
  [/\bcarbono\b/, "carbono"],
  [/silicona/, "silicona"],
  [/\btpe\b/, "TPE"],
  [/\btpu\b/, "TPU"],
  [/\babs\b/, "ABS"],
  [/\bcuero\b|\bpiel\b/, "cuero o piel"],
  [/microfibra/, "microfibra"],
  [/alcantara/, "alcántara"],
  [/aluminio|aleacion de aluminio/, "aluminio"],
  [/acero inoxidable/, "acero inoxidable"],
  [/cristal templado|vidrio templado/, "cristal templado"],
  [/nailon|nylon/, "nailon"],
  [/\bmadera\b/, "madera"],
  [/neopreno/, "neopreno"],
  [/\bgoma\b|caucho/, "goma"],
  [/\bmetal\b/, "metal"],
];

const CARACTERISTICAS: [RegExp, string][] = [
  [/\bleds?\b/, "LED"],
  [/magnetic[oa]s?/, "magnético"],
  [/inalambric/, "inalámbrico"],
  [/wi-?fi/, "WiFi"],
  [/bluetooth/, "Bluetooth"],
  [/rfid/, "RFID"],
  [/usb-?\s?c\b|type-?\s?c\b|tipo\s?c\b/, "USB-C"],
  [/magsafe/, "MagSafe"],
  [/\bnfc\b/, "NFC"],
  [/antideslizante/, "antideslizante"],
  [/impermeable|waterproof/, "impermeable"],
  [/plegable/, "plegable"],
  [/giratori/, "giratorio"],
  [/ajustable/, "ajustable"],
  [/\brgb\b/, "RGB"],
  [/ambiental/, "luz ambiental"],
  [/trifasic/, "trifásico"],
  [/monofasic/, "monofásico"],
  [/schuko/, "Schuko"],
  [/tipo\s?2|type\s?2/, "conector Tipo 2"],
  [/\bcon app\b|control por app/, "control por app"],
];

const COLORES: [RegExp, string][] = [
  [/\bnegr[oa]s?\b|\bblack\b/, "negro"],
  [/\bblanc[oa]s?\b|\bwhite\b/, "blanco"],
  [/\brojo\b|\brojas?\b/, "rojo"],
  [/\bgris(es)?\b/, "gris"],
  [/\bazul(es)?\b/, "azul"],
  [/\bplata\b|plateado/, "plata"],
  [/\bdorado\b/, "dorado"],
  [/\bnaranja\b/, "naranja"],
  [/\bverde\b/, "verde"],
  [/\bmarron\b/, "marrón"],
  [/\bbeige\b/, "beige"],
];

function coincidencias(t: string, reglas: [RegExp, string][], max: number): string[] {
  const salida: string[] = [];
  for (const [re, etiqueta] of reglas) {
    if (re.test(t) && !salida.includes(etiqueta) && !(etiqueta === "carbono" && salida.includes("fibra de carbono"))) salida.push(etiqueta);
    if (salida.length >= max) break;
  }
  return salida;
}

/** Puntos del título que se pueden afirmar porque están escritos en él. Cada elemento es una línea ya redactada. */
export function datosDelTitulo(tituloOriginal: string): string[] {
  const titulo = decodificar(tituloOriginal);
  const salida: string[] = [];
  const t = sinAcentos(titulo);

  // Piezas
  const variantes = titulo.match(/(\d+(?:\s*\/\s*\d+)+)\s*(?:piezas|pcs|unidades|uds|pzas)/i);
  const piezas = titulo.match(/(\d+)\s*(?:piezas|pcs|unidades|uds|pzas)\b/i);
  const pack = titulo.match(/\bpack de (\d+)/i);
  if (variantes) {
    const n = variantes[1]!.split("/").map((x) => Number(x.trim()));
    salida.push(`Presentación: el título ofrece variantes de ${Math.min(...n)} a ${Math.max(...n)} piezas.`);
  } else if (piezas) salida.push(`Presentación: se vende en ${piezas[1]} ${piezas[1] === "1" ? "pieza" : "piezas"}.`);
  else if (pack) salida.push(`Presentación: pack de ${pack[1]} unidades.`);
  else {
    const conjunto = t.match(/\b(kit|juego|combo|bundle|set)\b/);
    if (conjunto) salida.push(`Presentación: el título lo describe como ${conjunto[1] === "set" ? "set" : conjunto[1]}.`);
  }

  // Medidas y potencias (el número no puede ser parte de «Model 3» ni un año)
  const medidas: string[] = [];
  const re = /(\d+(?:[.,]\d+)?)\s?(kWh|kW|mAh|Hz|mm|cm|pulgadas|"|″|”|W|A|V|m|L|litros)(?![A-Za-z0-9])/g;
  for (const m of titulo.matchAll(re)) {
    const antes = titulo.slice(0, m.index).trimEnd().toLowerCase();
    if (/model[o]?\s*$/.test(antes) || /\bmodelo?\s*$/.test(antes)) continue;
    if (/^(19|20)\d{2}$/.test(m[1]!)) continue;
    if (m.index === 0) continue; // «3W Alfombrilla…»: al principio del título es una marca, no una potencia
    const unidad = m[2] === '"' || m[2] === "″" || m[2] === "”" ? "pulgadas" : m[2] === "l" ? "L" : m[2]!;
    const texto = `${m[1]} ${unidad}`;
    if (!medidas.includes(texto)) medidas.push(texto);
    if (medidas.length >= 4) break;
  }
  if (medidas.length > 0) salida.push(`Medidas o potencia que cita: ${lista(medidas)}.`);

  const materiales = coincidencias(t, MATERIALES, 3);
  if (materiales.length > 0) salida.push(`Materiales que nombra: ${lista(materiales)}.`);
  const caracteristicas = coincidencias(t, CARACTERISTICAS, 4);
  if (caracteristicas.length > 0) salida.push(`Características que menciona: ${lista(caracteristicas)}.`);
  const colores = coincidencias(t, COLORES, 2);
  if (colores.length > 0) salida.push(`Color citado: ${lista(colores)}.`);
  return salida;
}

// ───────────────────── contexto del catálogo ─────────────────────

export interface Estadistica {
  n: number;
  minimo: number;
  mediana: number;
  maximo: number;
  /** Precios finales ordenados de menor a mayor. */
  precios: number[];
}

export interface ContextoFichas {
  porCategoria(categoria: IdCategoria): Estadistica | null;
  porCategoriaTienda(categoria: IdCategoria, tienda: IdTienda): Estadistica | null;
  porCategoriaVersion(categoria: IdCategoria, version: IdVersion): Estadistica | null;
  /** Tiendas con productos de la categoría, con su precio final mínimo y nº de productos. */
  tiendasDeCategoria(categoria: IdCategoria): { tienda: IdTienda; n: number; minimo: number }[];
}

function estadistica(precios: number[]): Estadistica | null {
  if (precios.length === 0) return null;
  const p = [...precios].sort((a, b) => a - b);
  const m = Math.floor(p.length / 2);
  const mediana = p.length % 2 ? p[m]! : Math.round((p[m - 1]! + p[m]!) / 2);
  return { n: p.length, minimo: p[0]!, mediana, maximo: p[p.length - 1]!, precios: p };
}

/** Estadísticas del catálogo (se calculan una vez por build). */
export function crearContexto(entradas: EntradaFicha[]): ContextoFichas {
  const cat = new Map<string, number[]>();
  const catTienda = new Map<string, number[]>();
  const catVersion = new Map<string, number[]>();
  const push = (m: Map<string, number[]>, k: string, v: number) => {
    const a = m.get(k);
    if (a) a.push(v);
    else m.set(k, [v]);
  };
  for (const e of entradas) {
    const f = precioFinal(e.precioTienda, e.tienda);
    push(cat, e.categoria, f);
    push(catTienda, `${e.categoria}|${e.tienda}`, f);
    const versiones = versionesDe(e.modelos);
    if (versiones.length < VERSIONES.length) for (const v of versiones) push(catVersion, `${e.categoria}|${v}`, f);
  }
  const cache = new Map<string, Estadistica | null>();
  const dame = (m: Map<string, number[]>, k: string, pref: string) => {
    const clave = `${pref}#${k}`;
    if (!cache.has(clave)) cache.set(clave, estadistica(m.get(k) ?? []));
    return cache.get(clave)!;
  };
  return {
    porCategoria: (c) => dame(cat, c, "c"),
    porCategoriaTienda: (c, t) => dame(catTienda, `${c}|${t}`, "t"),
    porCategoriaVersion: (c, v) => dame(catVersion, `${c}|${v}`, "v"),
    tiendasDeCategoria: (c) =>
      (Object.keys(TIENDAS) as IdTienda[])
        .map((t) => ({ tienda: t, e: dame(catTienda, `${c}|${t}`, "t") }))
        .filter((x) => x.e)
        .map((x) => ({ tienda: x.tienda, n: x.e!.n, minimo: x.e!.minimo })),
  };
}

// ───────────────────── consejos de compra por categoría ─────────────────────
// Comprobaciones genéricas (qué mirar antes de comprar), no afirmaciones sobre un producto concreto.

const CONSEJOS: Record<IdCategoria, string[]> = {
  alfombrillas: [
    "Si son alfombrillas o protectores del suelo, se cortan a medida de cada generación: lo primero es que el año y la versión del anuncio coincidan con tu Tesla. Mira también qué piezas incluye (plazas delanteras, traseras, maletero).",
    "Si el producto es un juego de alfombrillas, comprueba que sea para tu generación de Model 3 o Model Y y qué piezas incluye. Si dudas entre dos referencias, pregunta a la tienda por el encaje en tu año.",
    "En alfombrillas y protectores de suelo, el encaje depende de la generación del coche. Compara las piezas incluidas con las que necesitas (delanteras, traseras, maletero) y confirma el año y la versión en la ficha de la tienda.",
  ],
  pantalla: [
    "Un protector de pantalla solo sirve si corresponde a la pantalla de tu coche. Mira el tamaño y la generación que indica la tienda, si es para la pantalla central y si el acabado es mate o transparente.",
    "Antes de colocar un protector, limpia bien la pantalla y comprueba que el producto sea para tu generación de Tesla, porque las pantallas no son iguales entre generaciones. Revisa también si incluye utensilios de colocación.",
    "Para pantallas, fíjate en tres cosas: el tamaño exacto, la generación de tu coche y el acabado que indica el anuncio. Si falta alguno de esos datos, consúltalo con la tienda antes de pagar.",
  ],
  carga: [
    "Si es un cargador, un cable o un adaptador, importan el conector y la potencia. En Europa los Tesla cargan con conector Tipo 2 en corriente alterna; comprueba que el anuncio indique ese conector y los kW que admite.",
    "Si se trata de un cargador o un cable, revisa la potencia en kW, el tipo de conector que declara la tienda y la longitud del cable. Si vas a instalar algo fijo en casa, pide consejo a un instalador.",
    "Si es un accesorio para cargar el coche, compara su potencia con la que admite tu instalación eléctrica: la tienda suele indicar kW y amperios en el título o la ficha. Ante cualquier duda, consulta a un electricista.",
  ],
  iluminacion: [
    "En iluminación, comprueba si el producto se conecta al coche o funciona por su cuenta, qué color de luz da y si el anuncio lo indica para tu versión. Un kit que no encaje no se puede aprovechar.",
    "Antes de comprar luces, mira la versión de Tesla que indica la tienda y qué incluye el kit para instalarlo. Si no lo dice con claridad, pregunta antes de pagar.",
    "Para accesorios de luz, confirma la compatibilidad con tu año y versión y si el título habla de LED, luz ambiental u otro tipo. Revisa que el kit traiga todo lo necesario para colocarlo.",
  ],
  soportes: [
    "Con soportes, lo más importante es dónde se coloca y para qué dispositivo sirve. Comprueba que el anuncio indique tu generación de Tesla y el tipo de dispositivo que admite.",
    "Antes de elegir un soporte, mira si se fija en la consola, en la pantalla o en otra zona, y si es para móvil, tableta u otro aparato. Confirma también la versión de tu coche.",
    "Un soporte debe encajar con el sitio donde lo vas a poner. Revisa la generación que indica la tienda, el sistema de sujeción y los dispositivos compatibles antes de pagar.",
  ],
  volante: [
    "En volantes y cubiertas de volante, el encaje depende de la generación: el volante de un Model 3 Highland o de un Model Y Juniper no tiene por qué coincidir con el de generaciones anteriores. Verifica la versión en la ficha.",
    "Antes de comprar nada para el volante, confirma la generación de tu coche y qué incluye el producto: cubierta, volante completo o solo un embellecedor. Cambia mucho de una opción a otra.",
    "Para el volante, lo prudente es comprobar versión y año, y si el producto es una cubierta, un embellecedor o una pieza de repuesto. Si es una pieza que afecta al funcionamiento, informa a tu taller.",
  ],
  asientos: [
    "Las fundas y accesorios de asiento se fabrican para una configuración concreta del interior. Revisa la generación, si es para plazas delanteras o traseras y si el producto cubre solo una parte.",
    "Antes de comprar un accesorio de asiento o reposabrazos, comprueba que corresponda a tu generación de Tesla y a la plaza donde lo vas a colocar. Si no queda claro, pregunta a la tienda.",
    "Para asientos y reposabrazos, mira qué plaza cubre el producto, la generación que indica la tienda y si se vende por unidades o en juego. Eso evita comprar piezas que no necesitas.",
  ],
  organizacion: [
    "En organizadores, comprueba dónde van colocados (consola, maletero, bajo la pantalla…) y que la ficha indique tu generación. Mide el hueco si tienes dudas: el espacio útil depende de cada versión.",
    "Antes de comprar un organizador, mira dónde se coloca y si el anuncio lo indica para tu generación de Tesla. Si el hueco es importante para ti, compara las medidas de la ficha con las de tu coche.",
    "Para almacenaje, lo útil es saber en qué zona del coche entra y qué versión admite. Revisa si el título cita medidas o piezas y confirma que encajan con lo que quieres guardar.",
  ],
  electronica: [
    "En electrónica y complementos, confirma que el producto sea compatible con tu generación y qué conexión usa (USB, inalámbrica u otra). Revisa qué incluye la caja antes de pagar.",
    "Antes de comprar un accesorio electrónico, mira qué conexión necesita, si el título indica tu versión de Tesla y si se vende con cables o piezas adicionales.",
    "Con los accesorios electrónicos, comprueba la compatibilidad con tu año y versión, el tipo de conexión y si la tienda especifica qué viene en el pack. Ante la duda, escribe a la tienda.",
  ],
  interior: [
    "En accesorios de interior, el encaje es a medida de cada generación. Confirma año y versión en la ficha de la tienda y fíjate en qué zona del habitáculo se coloca.",
    "Antes de comprar una pieza de interior, mira para qué zona del coche es (consola, salpicadero, puertas…) y que el anuncio coincida con tu generación de Model 3 o Model Y.",
    "Los accesorios de interior suelen cambiar entre generaciones. Comprueba el año, la versión y las piezas que incluye el producto antes de pagar.",
  ],
  exterior: [
    "En piezas de exterior, la forma depende de cada generación. Comprueba año y versión en la ficha y mira si se pega, se atornilla o se sustituye una pieza original.",
    "Antes de comprar un accesorio de exterior, confirma que sea para tu generación de Tesla y averigua cómo se instala. Si hay que desmontar piezas, valora si te conviene un taller.",
    "Para el exterior del coche, revisa la generación que indica la tienda, el material que cita el título y si la pieza va pegada o fijada con tornillos. Eso condiciona la instalación.",
  ],
  otros: [
    "Antes de comprar, confirma la compatibilidad con tu generación de Tesla y lee la ficha de la tienda para saber qué incluye el producto.",
    "Comprueba el año y la versión de tu coche con la ficha de la tienda y fíjate en qué incluye el pedido antes de pagar.",
    "Revisa en la tienda la compatibilidad con tu versión y el contenido del paquete antes de pagar.",
  ],
};

// ───────────────────── generador ─────────────────────

function compatibilidad(e: EntradaFicha) {
  const etiquetas = etiquetasDe(e.modelos);
  const universal = etiquetas.length === 1 && etiquetas[0]!.id === "universal";
  const textoTienda = recortar(e.modelos.trim(), 110);
  const etiq = lista(etiquetas.slice(0, 3).map((x) => x.texto)) + (etiquetas.length > 3 ? " y otras versiones" : "");
  // Universal: se reutiliza la frase de la tienda sin su «Pensado para…» inicial, para que «vende para …» quede natural.
  const frase = universal ? (textoTienda ? minuscula1(textoTienda).replace(/^(?:pensado |valido |válido |ideal )?para /, "") : "los Tesla") : etiq;
  return { etiquetas, universal, textoTienda, frase };
}

function filaPrecio(e: EntradaFicha) {
  const t = TIENDAS[e.tienda];
  const final = precioFinal(e.precioTienda, e.tienda);
  return { t, final, ahorro: e.precioTienda - final, pct: Math.round(t.descuento * 100) };
}

function fechaLarga(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function rango(precios: number[], valor: number): { puesto: number; tramo: "tercio más barato" | "tramo medio" | "tercio más caro" } {
  const puesto = precios.filter((p) => p < valor).length + 1;
  const n = precios.length;
  const q = (puesto - 1) / Math.max(1, n - 1);
  return { puesto, tramo: q < 1 / 3 ? "tercio más barato" : q < 2 / 3 ? "tramo medio" : "tercio más caro" };
}

function versionDeReferencia(e: EntradaFicha, v: IdVersion[]): IdVersion | null {
  if (v.length >= VERSIONES.length) return null;
  const candidatas = (["model-y-juniper", "model-3-highland"] as IdVersion[]).filter((x) => v.includes(x));
  if (candidatas.length === 0) return v[0] ?? null;
  return elegir(candidatas, `${e.id}:ref`);
}

/** Genera el texto de una ficha. No lanza: los datos opcionales que falten simplemente omiten su bloque. */
export function generarTextoFicha(e: EntradaFicha, ctx: ContextoFichas, extras: ExtrasFicha = {}): TextoFicha {
  const { t, final, ahorro, pct } = filaPrecio(e);
  const nombreCat = nombreCategoria(e.categoria);
  const T = tituloCorto(e.titulo);
  const c = compatibilidad(e);
  const k = (slot: string) => `${e.id}:${slot}`;
  const precioTxt = `${e.desde ? "desde " : ""}${formatoEuros(final)}`;

  // 1 · Resumen
  const cod = t.codigo
    ? ` (con el código ${t.codigo} de ${pct} % ya aplicado; en la tienda figura a ${formatoEuros(e.precioTienda)})`
    : ` (precio de ${t.nombre}, sin código)`;
  const fecha = fechaLarga(e.fecha);
  const resumen = elegir(
    [
      `${T} es un producto de la categoría «${nombreCat}» que ${t.nombre} vende para ${c.frase}. Su precio final es ${precioTxt}${cod} y lo revisamos por última vez el ${fecha}.`,
      `Ficha de ${T}, de ${t.nombre}: pertenece a «${nombreCat}» y la tienda lo presenta para ${c.frase}. Cuesta ${precioTxt}${cod}; el precio es del ${fecha}.`,
      `En ${t.nombre} figura ${T} dentro de «${nombreCat}», con la compatibilidad que declara la tienda: ${c.frase}. El precio final que calculamos es ${precioTxt}${cod}, con revisión del ${fecha}.`,
    ],
    k("resumen"),
  );
  const parrafosResumen = [resumen];
  if (e.desde) parrafosResumen.push("Es un precio «desde»: cambia según la variante o la configuración que elijas en la tienda.");

  // 2 · Puntos del título
  const puntos = datosDelTitulo(e.titulo);

  // 3 · Compatibilidad
  const aMedida = ["alfombrillas", "pantalla", "asientos", "exterior", "interior", "volante", "organizacion"].includes(e.categoria);
  const notaCompat = c.universal
    ? "Al no nombrar un modelo concreto, la tienda lo plantea como universal; aun así, comprueba que el conector o el encaje sirva para tu coche."
    : aMedida
      ? elegir(
          ["Los accesorios a medida cambian entre generaciones: confirma el año y la versión de tu coche antes de pagar.", "Como es una pieza a medida, verifica año y versión en la tienda antes de comprarla."],
          k("compat"),
        )
      : elegir(["Confirma igualmente el año y la versión de tu coche antes de pagar.", "Antes de comprar, comprueba en la tienda que tu año y versión estén incluidos."], k("compat"));
  const compat = !c.textoTienda
    ? `${t.nombre} no detalla para qué modelos es este producto. ${notaCompat}`
    : c.universal
    ? `${t.nombre} lo describe así: «${c.textoTienda}». ${notaCompat}`
    : `${t.nombre} indica esta compatibilidad: «${c.textoTienda}». En Chollesla lo clasificamos para ${c.frase}. ${notaCompat}`;

  // 4 · Precio frente al catálogo
  const frasesPrecio: string[] = [];
  const global = ctx.porCategoria(e.categoria);
  if (global && global.n >= 5) {
    const r = rango(global.precios, final);
    const dif = Math.round((final / global.mediana - 1) * 100);
    const relativo =
      Math.abs(dif) < 3
        ? `prácticamente igual que la mediana (${formatoEuros(global.mediana)})`
        : dif >= 100
          ? `unas ${(final / global.mediana).toFixed(1).replace(".", ",")} veces la mediana (${formatoEuros(global.mediana)})`
          : `un ${Math.abs(dif)} % ${dif > 0 ? "por encima" : "por debajo"} de la mediana (${formatoEuros(global.mediana)})`;
    frasesPrecio.push(
      elegir(
        [
          `De los ${global.n} productos de la categoría «${nombreCat}» que tenemos, este ocupa el puesto ${r.puesto} por precio final (de menor a mayor); el más barato cuesta ${formatoEuros(global.minimo)} y el más caro ${formatoEuros(global.maximo)}.`,
          `Para situar el precio: en «${nombreCat}» hay ${global.n} productos entre ${formatoEuros(global.minimo)} y ${formatoEuros(global.maximo)}, y este queda en el ${r.tramo} de esa lista, ${relativo}.`,
          `Dentro de «${nombreCat}» (${global.n} productos), su precio final está ${relativo}; por precio ocupa el puesto ${r.puesto} de ${global.n}, en el ${r.tramo}.`,
        ],
        k("precio"),
      ),
    );
    const ref = versionDeReferencia(e, versionesDe(e.modelos));
    const sv = ref ? ctx.porCategoriaVersion(e.categoria, ref) : null;
    if (ref && sv && sv.n >= 5) {
      const rv = rango(sv.precios, final);
      frasesPrecio.push(`Entre los ${sv.n} de esta categoría compatibles con ${nombreVersion(ref)}, es el número ${rv.puesto} por precio y la mediana está en ${formatoEuros(sv.mediana)}.`);
    }
    const st = ctx.porCategoriaTienda(e.categoria, e.tienda);
    if (st && st.n >= 2) {
      frasesPrecio.push(`En ${t.nombre} hay ${st.n} productos de esta categoría, desde ${formatoEuros(st.minimo)} hasta ${formatoEuros(st.maximo)}.`);
    }
    const otras = ctx
      .tiendasDeCategoria(e.categoria)
      .filter((x) => x.tienda !== e.tienda && x.n >= 2)
      .sort((a, b) => a.minimo - b.minimo)
      .slice(0, 2);
    if (otras.length > 0) {
      frasesPrecio.push(`En otras tiendas del catálogo: ${otras.map((x) => `${TIENDAS[x.tienda].nombre} (${x.n} productos, desde ${formatoEuros(x.minimo)})`).join(" y ")}.`);
    }
    frasesPrecio.push("Son productos distintos, así que sirve como referencia de rango y no como comparación de calidad.");
  } else {
    frasesPrecio.push(`El precio final de este producto es ${formatoEuros(final)}. Hay pocos productos de esta categoría en el catálogo, así que no hacemos comparativa de rango.`);
  }

  // 5 · Antes de comprar
  const consejo = elegir(CONSEJOS[e.categoria] ?? CONSEJOS.otros, k("consejo"));

  // 6 · Cómo comprar
  const comision = "Si compras desde el botón de la ficha, Chollesla puede recibir una comisión sin coste extra para ti.";
  let comprar: string;
  if (t.codigo) {
    comprar = elegir(
      [
        `El precio de esta ficha ya descuenta el ${pct} % del código ${t.codigo}: ${formatoEuros(ahorro)} menos que los ${formatoEuros(e.precioTienda)} de la tienda. Pulsa «Ir al chollo», añade el producto al carrito de ${t.nombre} y, si no ves el descuento reflejado, escribe ${t.codigo} en el campo de código antes de pagar. ${comision}`,
        `Con el código ${t.codigo} (${pct} %) pagarías ${formatoEuros(final)} en lugar de ${formatoEuros(e.precioTienda)}, un ahorro de ${formatoEuros(ahorro)}. Entra en ${t.nombre} desde el botón de la ficha y, si el descuento no aparece solo, introduce el código al pagar. ${comision}`,
        `${t.nombre} aplica el ${pct} % con el código ${t.codigo}, así que de ${formatoEuros(e.precioTienda)} se queda en ${formatoEuros(final)}. Abre la tienda con el botón de la ficha y comprueba en el resumen del pedido que el descuento se ha restado. ${comision}`,
      ],
      k("comprar"),
    );
  } else if (e.tienda === "aliexpress") {
    comprar = elegir(
      [
        `En AliExpress no hay código de Chollesla: el precio de ${formatoEuros(final)} es el que figuraba el ${fecha}. Antes de pagar revisa en la página del producto el plazo y los gastos de envío. ${comision}`,
        `Esta ficha enlaza con AliExpress, donde el precio no lleva código de descuento (${formatoEuros(final)} el ${fecha}). Mira el envío, el plazo de entrega y las condiciones de devolución del vendedor en la propia página. ${comision}`,
      ],
      k("comprar"),
    );
  } else {
    comprar = elegir(
      [
        `Esta ficha enlaza con Amazon.es y el precio (${formatoEuros(final)} el ${fecha}) es el de Amazon, sin código de Chollesla. El envío, la entrega y las devoluciones son los que indique Amazon al hacer el pedido. ${comision}`,
        `En Amazon.es el precio no lleva código: ${formatoEuros(final)} según la última revisión, del ${fecha}. Antes de confirmar el pedido, comprueba en Amazon el plazo de entrega y las condiciones de devolución. ${comision}`,
      ],
      k("comprar"),
    );
  }
  if (e.tienda === "evdance") {
    comprar += " Ojo: EVDANCE envía desde la UE y suele cobrar gastos de envío a España aparte del precio; confirma el importe al pagar.";
  }

  // 7 · Opcionales
  const opcionales: SeccionTexto[] = [];
  if (extras.opinion && extras.opinion.trim().length > 20) {
    opcionales.push({
      id: "opiniones",
      titulo: "Lo que cuentan los compradores",
      parrafos: [`Resumen de opiniones publicadas por compradores en Amazon.es, no una valoración de Chollesla: ${extras.opinion.trim()}`],
      puntos: [],
    });
  }
  if (extras.historial && extras.historial.anterior > 0 && extras.historial.anterior !== e.precioTienda) {
    const h = extras.historial;
    const baja = h.anterior > e.precioTienda;
    opcionales.push({
      id: "historial",
      titulo: "Cambio de precio registrado",
      parrafos: [`El ${fechaLarga(h.fechaCambio)} registramos que el precio en la tienda ${baja ? "bajó" : "subió"} de ${formatoEuros(h.anterior)} a ${formatoEuros(e.precioTienda)} (sin código)${baja ? `, un ${porcentajeAhorro(e.precioTienda, h.anterior)} % menos` : ""}.`],
      puntos: [],
    });
  }

  // Ensamblado por prioridad: si se pasa de longitud se quitan los bloques menos importantes.
  type Candidato = { prioridad: number; seccion: SeccionTexto };
  const candidatos: Candidato[] = [
    { prioridad: 100, seccion: { id: "resumen", titulo: "Resumen", parrafos: parrafosResumen, puntos: [] } },
    { prioridad: 90, seccion: { id: "compra", titulo: t.codigo ? "Cómo comprar con el descuento" : "Cómo comprar", parrafos: [comprar], puntos: [] } },
    { prioridad: 80, seccion: { id: "compatibilidad", titulo: "Compatibilidad", parrafos: [compat], puntos: [] } },
    { prioridad: 70, seccion: { id: "precio", titulo: "Cómo se compara el precio", parrafos: [frasesPrecio.join(" ")], puntos: [] } },
    { prioridad: 60, seccion: { id: "consejo", titulo: "Antes de comprar", parrafos: [consejo], puntos: [] } },
    ...(puntos.length > 0 ? [{ prioridad: 65, seccion: { id: "titulo", titulo: "Lo que indica el título de la tienda", parrafos: [], puntos } }] : []),
    ...opcionales.map((s, i) => ({ prioridad: 75 - i, seccion: s })),
  ];
  const total = (cs: Candidato[]) => cs.reduce((n, x) => n + x.seccion.parrafos.concat(x.seccion.puntos).reduce((m, p) => m + contarPalabras(p), 0), 0);
  let elegidos = candidatos;
  // Primero se acorta el bloque de precio (frases extra), luego se quitan bloques enteros.
  while (total(elegidos) > MAX_PALABRAS) {
    const precio = elegidos.find((x) => x.seccion.id === "precio")!;
    const frases = precio.seccion.parrafos[0]!.split(/(?<=\.)\s+/);
    if (frases.length > 2) {
      frases.splice(frases.length - 2, 1);
      precio.seccion.parrafos = [frases.join(" ")];
      continue;
    }
    const quitable = [...elegidos].filter((x) => x.prioridad < 90).sort((a, b) => a.prioridad - b.prioridad)[0];
    if (!quitable) break;
    elegidos = elegidos.filter((x) => x !== quitable);
  }
  // Orden de lectura: el de prioridad salvo que «título» y «consejo» se mueven según la ficha (variación estructural).
  const orden = hash32(k("orden")) % 2 === 0 ? ["resumen", "titulo", "compatibilidad", "precio", "opiniones", "historial", "compra", "consejo"] : ["resumen", "compatibilidad", "titulo", "consejo", "precio", "opiniones", "historial", "compra"];
  const secciones = orden.map((id) => elegidos.find((x) => x.seccion.id === id)?.seccion).filter((s): s is SeccionTexto => Boolean(s));

  // FAQ
  const sujeto = c.universal ? "cualquier Tesla" : (c.etiquetas[0]?.texto ?? "mi Tesla");
  const faq: PreguntaFrecuente[] = [
    {
      pregunta: c.universal ? `¿Vale para cualquier Tesla este producto de ${t.nombre}?` : `¿Sirve para el ${sujeto}?`,
      respuesta: !c.textoTienda
        ? `${t.nombre} no detalla para qué modelos es este producto, así que confirma con la tienda el año y la versión de tu coche antes de pagar.`
        : c.universal
        ? `${t.nombre} lo describe como «${c.textoTienda}». Comprueba que el conector o el encaje coincida con tu coche y consulta la ficha de la tienda antes de pagar.`
        : `Según la ficha de ${t.nombre}, el producto figura para «${c.textoTienda}». Chollesla lo clasifica como compatible con ${c.frase}, pero conviene confirmar el año exacto y la versión de tu coche en la tienda.`,
    },
    {
      pregunta: `¿Cuánto cuesta ${recortar(T, 60)}${t.codigo ? " con el descuento" : ""}?`,
      respuesta: t.codigo
        ? `${e.desde ? "Desde " : ""}${formatoEuros(final)} con el código ${t.codigo} (${pct} %), frente a ${formatoEuros(e.precioTienda)} sin código. Precio revisado el ${fecha}; puede variar.`
        : `${e.desde ? "Desde " : ""}${formatoEuros(final)} en ${t.nombre}, sin código de descuento. Precio revisado el ${fecha}; puede variar.`,
    },
    e.tienda === "evdance"
      ? { pregunta: "¿Cobra EVDANCE gastos de envío a España?", respuesta: "EVDANCE envía desde la UE y, cuando lo comprobamos, cobraba gastos de envío a España aparte del precio. Confirma el importe al pagar, porque puede cambiar." }
      : e.tienda === "amazon"
        ? { pregunta: "¿Cómo se compra y qué condiciones de envío tiene?", respuesta: "Se compra en Amazon.es desde el botón de la ficha. El envío, la entrega y las devoluciones son los que indique Amazon en el pedido; Chollesla solo enlaza." }
        : e.tienda === "aliexpress"
          ? { pregunta: "¿Hay código de descuento en AliExpress?", respuesta: `No: el precio de ${formatoEuros(final)} es el de AliExpress sin código. Revisa en la página del producto el envío y el plazo antes de pagar.` }
          : { pregunta: `¿Cómo se usa el código ${t.codigo} en ${t.nombre}?`, respuesta: `Entra en la tienda desde el botón de la ficha, añade el producto al carrito y, si el descuento del ${pct} % no se aplica solo, escribe ${t.codigo} en el campo de código antes de pagar.` },
  ];

  const palabras = total(secciones.map((s) => ({ prioridad: 0, seccion: s })));
  return { resumen: parrafosResumen[0]!, secciones, faq, palabras };
}

// ───────────────────── validación y similitud ─────────────────────

/** Texto plano de todo lo que se ve (cuerpo + FAQ). */
export function textoPlano(t: TextoFicha): string {
  return [...t.secciones.flatMap((s) => [...s.parrafos, ...s.puntos]), ...t.faq.flatMap((f) => [f.pregunta, f.respuesta])].join(" ");
}

/** Problemas que impiden indexar la ficha: texto vacío, valores rotos, HTML, longitud fuera de rango, FAQ incompletas. */
export function validarTextoFicha(t: TextoFicha): string[] {
  const p: string[] = [];
  const plano = textoPlano(t);
  if (t.palabras < MIN_PALABRAS) p.push(`pocas palabras (${t.palabras})`);
  if (t.palabras > MAX_PALABRAS) p.push(`demasiadas palabras (${t.palabras})`);
  if (/undefined|NaN|\bnull\b|\[object|Infinity/.test(plano)) p.push("valor roto (undefined/NaN/null)");
  if (/[<>]|&[a-z]+;|\{|\}/.test(plano)) p.push("HTML o llaves en el texto");
  if (/ {2,}| ,| \.|\.\.|\(\s|\s\)|«\s*»|«»/.test(plano)) p.push("puntuación o espacios rotos");
  for (const s of t.secciones) {
    if (s.parrafos.length === 0 && s.puntos.length === 0) p.push(`sección vacía: ${s.id}`);
    for (const x of [...s.parrafos, ...s.puntos]) if (!x.trim()) p.push(`párrafo vacío en ${s.id}`);
  }
  if (t.faq.length < 2 || t.faq.length > 3) p.push(`FAQ: ${t.faq.length} preguntas`);
  for (const f of t.faq) if (!f.pregunta.trim() || !f.respuesta.trim()) p.push("FAQ vacía");
  return p;
}

/** Conjunto de «shingles» (secuencias de `k` palabras) como números, para medir similitud. */
export function shingles(texto: string, k = 5): Set<number> {
  const palabras = sinAcentos(texto)
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  const s = new Set<number>();
  for (let i = 0; i + k <= palabras.length; i++) s.add(hash32(palabras.slice(i, i + k).join(" ")));
  return s;
}

export function jaccard(a: Set<number>, b: Set<number>): number {
  if (a.size === 0 && b.size === 0) return 1;
  const [pequeño, grande] = a.size <= b.size ? [a, b] : [b, a];
  let comunes = 0;
  for (const x of pequeño) if (grande.has(x)) comunes++;
  return comunes / (a.size + b.size - comunes);
}

/** Umbral por encima del cual dos fichas se consideran contenido duplicado. */
export const UMBRAL_DUPLICADO = 0.8;
