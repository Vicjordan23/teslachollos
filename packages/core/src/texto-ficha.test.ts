import { describe, expect, it } from "vitest";
import { CATEGORIAS } from "./categorias.js";
import { TIENDAS, type IdTienda } from "./tiendas.js";
import {
  contarPalabras,
  crearContexto,
  datosDelTitulo,
  generarTextoFicha,
  jaccard,
  MAX_PALABRAS,
  MIN_PALABRAS,
  shingles,
  textoPlano,
  UMBRAL_DUPLICADO,
  validarTextoFicha,
  type EntradaFicha,
} from "./texto-ficha.js";

const TIENDAS_IDS = Object.keys(TIENDAS) as IdTienda[];
const MODELOS = ["Model Y Juniper", "Model 3 Highland 2024-2026 y Model Y 2025-2026", "Model 3 y Model Y", "Pensado para coches Tesla", "Coches con conector Tipo 2 (el de Tesla en Europa)", "Model Y 2020-2024"];
const TITULOS = [
  "Alfombrillas de todo tiempo para Model Y Juniper",
  "Cable de carga Tipo 2 de 7,5 m y 32 A para coches eléctricos",
  'Protector de pantalla mate de cristal templado (15,4")',
  "Kit de 4 piezas de luz LED ambiental con control por app",
  "Soporte magnético para teléfono con MagSafe",
  "Funda de silicona negra para la llave",
  "TEKSY 1/2/3/4/6/7/8 piezas para Tesla Nuevo Modelo Y 2025 2026 Juniper ABS antideslizante",
  "Organizador de maletero",
];

/** Catálogo sintético: todas las combinaciones de tienda × categoría, con títulos, modelos y precios distintos. */
function catalogo(): EntradaFicha[] {
  const salida: EntradaFicha[] = [];
  let n = 0;
  for (const tienda of TIENDAS_IDS)
    for (const cat of CATEGORIAS)
      for (let i = 0; i < 6; i++) {
        n++;
        salida.push({
          id: `id${n}`,
          slug: `ficha-${n}`,
          tienda,
          categoria: cat.id,
          titulo: `${TITULOS[(n + i) % TITULOS.length]} ${n}`,
          modelos: MODELOS[(n + i) % MODELOS.length]!,
          precioTienda: 500 + ((n * 7919) % 30000),
          desde: n % 5 === 0,
          fecha: "2026-11-19",
        });
      }
  return salida;
}

describe("generarTextoFicha", () => {
  const entradas = catalogo();
  const ctx = crearContexto(entradas);
  const textos = entradas.map((e) => ({ e, t: generarTextoFicha(e, ctx) }));

  it("genera texto válido (120-250 palabras, sin vacíos, sin undefined/NaN ni HTML) para toda tienda y categoría", () => {
    for (const { e, t } of textos) {
      expect(validarTextoFicha(t), `${e.tienda}/${e.categoria}/${e.slug}`).toEqual([]);
      expect(t.palabras).toBeGreaterThanOrEqual(MIN_PALABRAS);
      expect(t.palabras).toBeLessThanOrEqual(MAX_PALABRAS);
      expect(t.faq.length).toBeGreaterThanOrEqual(2);
      expect(t.faq.length).toBeLessThanOrEqual(3);
    }
  });

  it("el recuento de palabras coincide con el texto de las secciones", () => {
    for (const { t } of textos.slice(0, 50)) {
      const real = t.secciones.flatMap((s) => [...s.parrafos, ...s.puntos]).reduce((n, p) => n + contarPalabras(p), 0);
      expect(t.palabras).toBe(real);
    }
  });

  it("es determinista", () => {
    const e = entradas[3]!;
    expect(generarTextoFicha(e, ctx)).toEqual(generarTextoFicha(e, ctx));
  });

  it("no usa urgencia, estrellas ni cupones inventados", () => {
    for (const { t } of textos) expect(textoPlano(t)).not.toMatch(/solo hoy|últimas unidades|oferta limitada|estrellas|⭐|garantizado|el mejor/i);
  });

  it("solo menciona el código de la tienda cuando la tienda lo tiene", () => {
    for (const { e, t } of textos) {
      const plano = textoPlano(t);
      const codigo = TIENDAS[e.tienda].codigo;
      if (codigo) expect(plano).toContain(codigo);
      else expect(plano).not.toMatch(/ACCESORIOSTESLA|VICTOR/);
    }
  });

  it("los precios del texto son el precio final calculado", () => {
    const e: EntradaFicha = { ...entradas[0]!, tienda: "hansshow", precioTienda: 10000, desde: false };
    const plano = textoPlano(generarTextoFicha(e, ctx));
    expect(plano).toContain("80,00 €");
    expect(plano).toContain("100,00 €");
    expect(plano).toContain("VICTOR");
  });

  it("un precio «desde» lo dice", () => {
    const e: EntradaFicha = { ...entradas[0]!, desde: true };
    expect(textoPlano(generarTextoFicha(e, ctx))).toMatch(/desde .*€/);
  });

  it("los datos opcionales ausentes no rompen el texto (sin contexto, título corto, modelos vacíos)", () => {
    const e: EntradaFicha = { id: "x", slug: "x", tienda: "amazon", categoria: "otros", titulo: "Algo", modelos: "", precioTienda: 999, desde: false, fecha: "2026-11-19" };
    const t = generarTextoFicha(e, crearContexto([e]));
    expect(validarTextoFicha(t)).toEqual([]);
    expect(textoPlano(t)).not.toMatch(/undefined|NaN|null/);
  });

  it("las opiniones y el cambio de precio añaden un bloque y no pasan de 250 palabras", () => {
    const e = entradas.find((x) => x.tienda === "amazon")!;
    const t = generarTextoFicha(e, ctx, {
      opinion: "Los compradores destacan lo fácil que es de poner y el buen encaje. Hay opiniones divididas sobre el precio.",
      historial: { anterior: e.precioTienda + 500, fechaCambio: "2026-11-18" },
    });
    expect(t.secciones.map((s) => s.id)).toContain("opiniones");
    expect(t.palabras).toBeLessThanOrEqual(MAX_PALABRAS);
    expect(validarTextoFicha(t)).toEqual([]);
    expect(textoPlano(t)).toContain("no una valoración de Chollesla");
  });

  it("sin opinión ni historial no hay esos bloques", () => {
    const t = generarTextoFicha(entradas[0]!, ctx);
    expect(t.secciones.map((s) => s.id)).not.toContain("opiniones");
    expect(t.secciones.map((s) => s.id)).not.toContain("historial");
  });

  it("decodifica entidades HTML del título", () => {
    const e: EntradaFicha = { ...entradas[0]!, titulo: "Logo Front &amp; Rear para Model 3" };
    const t = generarTextoFicha(e, ctx);
    expect(textoPlano(t)).not.toContain("&amp;");
    expect(validarTextoFicha(t)).toEqual([]);
  });

  it("fichas de la misma categoría y tienda no son casi iguales (Jaccard de shingles < 0,8) y la media es baja", () => {
    const grupos = new Map<string, Set<number>[]>();
    for (const { e, t } of textos) {
      const k = `${e.tienda}|${e.categoria}`;
      grupos.set(k, [...(grupos.get(k) ?? []), shingles(textoPlano(t))]);
    }
    let suma = 0;
    let pares = 0;
    for (const g of grupos.values())
      for (let i = 0; i < g.length; i++)
        for (let j = i + 1; j < g.length; j++) {
          const s = jaccard(g[i]!, g[j]!);
          expect(s).toBeLessThan(UMBRAL_DUPLICADO);
          suma += s;
          pares++;
        }
    expect(suma / pares).toBeLessThan(0.5);
  });
});

describe("datosDelTitulo", () => {
  it("extrae potencia, medidas, piezas, materiales y características solo si el título las dice", () => {
    expect(datosDelTitulo("Wallbox 11 kW Tipo 2 trifásica 16 A con WiFi")).toEqual([
      "Medidas o potencia que cita: 11 kW y 16 A.",
      "Características que menciona: WiFi, trifásico y conector Tipo 2.",
    ]);
    expect(datosDelTitulo('Protector de pantalla de cristal templado (15,4")')).toContain("Medidas o potencia que cita: 15,4 pulgadas.");
    expect(datosDelTitulo("Juego de 4 piezas de silicona")).toContain("Presentación: se vende en 4 piezas.");
    expect(datosDelTitulo("TEKSY 1/2/3/4/6/7/8 piezas ABS")).toContain("Presentación: el título ofrece variantes de 1 a 8 piezas.");
  });

  it("no confunde «Model 3», «Model Y 2025» ni años con medidas", () => {
    expect(datosDelTitulo("Alfombrillas para Tesla Model 3 Highland 2024 m")).toEqual([]);
    expect(datosDelTitulo("Funda para Model 3 L")).toEqual([]);
    expect(datosDelTitulo("Soporte para Model Y 2025 V2")).toEqual([]);
  });

  it("una marca al principio como «3W» no es una potencia", () => {
    expect(datosDelTitulo("3W Alfombrilla de Coche para Tesla Model 3 Highland")).toEqual([]);
  });

  it("no inventa nada con un título sin datos", () => {
    expect(datosDelTitulo("Organizador de maletero")).toEqual([]);
  });
});

describe("similitud", () => {
  it("jaccard: idénticos = 1, disjuntos = 0", () => {
    const a = shingles("uno dos tres cuatro cinco seis siete ocho");
    expect(jaccard(a, a)).toBe(1);
    expect(jaccard(a, shingles("alfa beta gamma delta epsilon zeta eta theta"))).toBe(0);
  });
});
