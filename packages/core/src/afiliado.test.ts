import { describe, expect, it } from "vitest";
import { aplicarAfiliado, avisoAfiliado, AVISO_AMAZON } from "./afiliado";

function url(enlace: string): string {
  const r = aplicarAfiliado(enlace);
  if (r.estado !== "ok") throw new Error(`esperaba ok y llegó ${r.estado}`);
  return r.url;
}

describe("aplicarAfiliado", () => {
  it("Amazon: deja /dp/ASIN con el tag de Vic y quita el afiliado ajeno", () => {
    expect(url("https://www.amazon.es/Spigen-Protector/dp/B0GY6GB73J/ref=sr_1_3?tag=otro-21&keywords=x")).toBe(
      "https://www.amazon.es/dp/B0GY6GB73J?tag=teslaaccesorios-21",
    );
    expect(url("https://amazon.es/gp/product/b0fc21dngx")).toBe("https://www.amazon.es/dp/B0FC21DNGX?tag=teslaaccesorios-21");
  });

  it("Amazon sin ASIN: limpia parámetros y pone el tag", () => {
    expect(url("https://www.amazon.es/s?k=tesla&tag=otro-21")).toBe("https://www.amazon.es/s?k=tesla&tag=teslaaccesorios-21");
  });

  it("Hansshow: sustituye bg_ref", () => {
    expect(url("https://www.hansshow.com/products/volante?bg_ref=AJENO&variant=1")).toBe(
      "https://www.hansshow.com/products/volante?variant=1&bg_ref=nBeGMuizu9",
    );
  });

  it("Jowua: pone ghref y código de descuento", () => {
    expect(url("https://www.jowua-life.com/products/parasol?ghref=1:2")).toBe(
      "https://www.jowua-life.com/products/parasol?ghref=5866%3A1343863&discount=accesoriostesla",
    );
  });

  it("Tesery: pasa a /es-es/ y añade GoAffPro", () => {
    expect(url("https://www.tesery.com/products/gancho?ref=OTRO&utm_source=x")).toBe(
      "https://www.tesery.com/es-es/products/gancho?ref=AccesoriosTesla&utm_medium=affiliate&utm_source=goaffpro",
    );
    expect(url("https://www.tesery.com/fr-fr/products/gancho")).toContain("/es-es/products/gancho?");
  });

  it("EVDANCE: envuelve en Awin con el afiliado de Vic, también si ya venía de otro Awin", () => {
    const esperado =
      "https://www.awin1.com/cread.php?awinmid=67740&awinaffid=3115223&ued=https%3A%2F%2Feu.evdances.com%2Fes%2Fproducts%2Fwallbox";
    expect(url("https://eu.evdances.com/es/products/wallbox?utm_source=x")).toBe(esperado);
    expect(
      url("https://www.awin1.com/cread.php?awinmid=67740&awinaffid=999&ued=https%3A%2F%2Feu.evdances.com%2Fes%2Fproducts%2Fwallbox"),
    ).toBe(esperado);
  });

  it("Tienda fuera del programa: enlace limpio sin afiliados ni utm", () => {
    const r = aplicarAfiliado("http://tienda-ejemplo.com/p/alfombrillas?ref=yo&utm_campaign=z&color=negro#opiniones");
    expect(r).toEqual({ estado: "ok", url: "https://tienda-ejemplo.com/p/alfombrillas?color=negro", tienda: null });
  });

  it("Acortadores: hay que resolverlos antes", () => {
    expect(aplicarAfiliado("https://amzn.eu/d/abc")).toEqual({ estado: "resolver", motivo: "acortador" });
    expect(aplicarAfiliado("https://is.gd/BLRtGY").estado).toBe("resolver");
  });

  it("Rechaza lo que no es un enlace web normal", () => {
    expect(aplicarAfiliado("javascript:alert(1)").estado).toBe("invalido");
    expect(aplicarAfiliado("no es url").estado).toBe("invalido");
    expect(aplicarAfiliado("https://user:pass@amazon.es/dp/B0GY6GB73J").estado).toBe("invalido");
  });

  it("No confunde dominios parecidos", () => {
    const r = aplicarAfiliado("https://amazon.es.estafa.com/dp/B0GY6GB73J");
    expect(r.estado === "ok" && r.tienda).toBe(null);
  });
});

describe("avisoAfiliado", () => {
  it("Amazon lleva el texto obligatorio literal", () => {
    expect(avisoAfiliado("amazon")).toBe(AVISO_AMAZON);
    expect(AVISO_AMAZON).toBe("En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos.");
  });
  it("Otras tiendas del programa llevan aviso general; fuera del programa, ninguno", () => {
    expect(avisoAfiliado("tesery")).toMatch(/comisión/);
    expect(avisoAfiliado(null)).toBeNull();
  });
});
