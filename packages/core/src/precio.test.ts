import { describe, expect, it } from "vitest";
import { formatoEuros, porcentajeAhorro, precioFinal } from "./precio";

describe("precioFinal", () => {
  it("aplica el descuento de cada tienda como el agente de Telegram", () => {
    expect(precioFinal(4199, "amazon")).toBe(4199);
    expect(precioFinal(10000, "hansshow")).toBe(8000);
    expect(precioFinal(2999, "jowua")).toBe(2849); // 2849,05 → 2849
    expect(precioFinal(1990, "tesery")).toBe(1891); // 1890,5 → 1891
    expect(precioFinal(5000, null)).toBe(5000);
  });
});

describe("formatoEuros", () => {
  it("usa coma decimal y punto de miles", () => {
    expect(formatoEuros(4199)).toBe("41,99 €");
    expect(formatoEuros(5)).toBe("0,05 €");
    expect(formatoEuros(123456)).toBe("1.234,56 €");
  });
});

describe("porcentajeAhorro", () => {
  it("calcula el % y devuelve 0 sin precio anterior válido", () => {
    expect(porcentajeAhorro(8000, 10000)).toBe(20);
    expect(porcentajeAhorro(8000, null)).toBe(0);
    expect(porcentajeAhorro(8000, 7000)).toBe(0);
  });
});
