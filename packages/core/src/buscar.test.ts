import { describe, expect, it } from "vitest";
import { buscar, normalizar, terminos } from "./buscar";

const LISTA = [
  { titulo: "Alfombrillas de todo tiempo (Jowua)", modelos: "Model Y Juniper", descripcion: "Goma TPE" },
  { titulo: "Protector de pantalla mate", modelos: "Model 3/Y 2024-2026", descripcion: "Cristal templado" },
  { titulo: "Cargador inalámbrico", modelos: "Model S y Model X", descripcion: "Carga rápida para la consola" },
  { titulo: "Organizador de consola central", modelos: "Model 3", descripcion: "Con alfombrilla de silicona" },
];

describe("normalizar", () => {
  it("quita acentos y normaliza los modelos", () => {
    expect(normalizar("Cargador INALÁMBRICO")).toBe("cargador inalambrico");
    expect(normalizar("Model 3/Y")).toBe("model3 modely");
    expect(normalizar("modelo Y Juniper")).toBe("modely juniper");
    expect(normalizar("Para MY y M3")).toBe("para modely y model3");
    expect(normalizar("Model S y Model X")).toBe("models y modelx");
  });
});

describe("terminos", () => {
  it("quita palabras vacías salvo que no quede otra", () => {
    expect(terminos("alfombrillas para el Model Y")).toEqual(["alfombrill", "modely"]);
    expect(terminos("tesla")).toEqual(["tesla"]);
    expect(terminos("luces ambiente carbono")).toEqual(["luz", "ambient", "carbon"]);
    expect(terminos("  ")).toEqual([]);
  });
});

describe("buscar", () => {
  it("encuentra por prefijo, sin acentos y en singular o plural", () => {
    expect(buscar(LISTA, "alfombrilla").map((c) => c.titulo)).toEqual([
      "Alfombrillas de todo tiempo (Jowua)",
      "Organizador de consola central",
    ]);
    expect(buscar(LISTA, "inalambrico")).toHaveLength(1);
    expect(buscar(LISTA, "carg")).toHaveLength(1);
  });
  it("exige todas las palabras y entiende los modelos", () => {
    expect(buscar(LISTA, "pantalla model y")).toHaveLength(1);
    expect(buscar(LISTA, "pantalla model s")).toHaveLength(0);
    expect(buscar(LISTA, "MY").map((c) => c.titulo)).toEqual([
      "Alfombrillas de todo tiempo (Jowua)",
      "Protector de pantalla mate",
    ]);
  });
  it("ordena por relevancia: título antes que descripción", () => {
    expect(buscar(LISTA, "consola").map((c) => c.titulo)).toEqual([
      "Organizador de consola central",
      "Cargador inalámbrico",
    ]);
  });
  it("una búsqueda vacía no devuelve nada", () => {
    expect(buscar(LISTA, "")).toEqual([]);
  });
});
