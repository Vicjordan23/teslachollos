import { describe, expect, it } from "vitest";
import { modelosDe } from "./modelos";

const TODOS = ["model-y", "model-3", "model-s", "model-x", "cybertruck"];

describe("modelosDe", () => {
  it("lee los textos reales del catálogo", () => {
    expect(modelosDe("Model 3 Highland 2024-2026 y Model Y Juniper 2025")).toEqual(["model-y", "model-3"]);
    expect(modelosDe("Model Y Juniper 2025-2026 (no New Standard)")).toEqual(["model-y"]);
    expect(modelosDe("Model 3, Y, X y S")).toEqual(["model-y", "model-3", "model-s", "model-x"]);
    expect(modelosDe("Model 3 / 3 Highland y Model Y / Y Juniper")).toEqual(["model-y", "model-3"]);
    expect(modelosDe("Model 3/Y")).toEqual(["model-y", "model-3"]);
    expect(modelosDe("Model 3 2024+")).toEqual(["model-3"]);
    expect(modelosDe("Model S y Model X")).toEqual(["model-s", "model-x"]);
  });
  it("la «y» entre modelos es la conjunción", () => {
    expect(modelosDe("Model 3 y X")).toEqual(["model-3", "model-x"]);
  });
  it("Cybertruck y abreviaturas", () => {
    expect(modelosDe("Cybertruck")).toEqual(["cybertruck"]);
    expect(modelosDe("MY y M3")).toEqual(["model-y", "model-3"]);
  });
  it("sin modelo nombrado es universal", () => {
    expect(modelosDe("Coches con conector Tipo 2 (el de Tesla en Europa)")).toEqual(TODOS);
    expect(modelosDe("")).toEqual(TODOS);
  });
});
