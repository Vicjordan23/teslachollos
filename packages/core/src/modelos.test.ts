import { describe, expect, it } from "vitest";
import { modelosDe, versionesDe } from "./modelos";

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

describe("versionesDe", () => {
  it("Highland y Juniper son la generación nueva (con su Standard)", () => {
    expect(versionesDe("Model 3 Highland")).toEqual(["model-3-highland", "model-3-standard"]);
    expect(versionesDe("Model Y Juniper y Model 3 Highland")).toEqual([
      "model-3-highland",
      "model-3-standard",
      "model-y-juniper",
      "model-y-standard",
    ]);
  });
  it("respeta las exclusiones de Standard", () => {
    expect(versionesDe("Model Y Juniper 2025-2026 (no New Standard)")).toEqual(["model-y-juniper"]);
    expect(versionesDe("Model Y Juniper (no para la versión Standard)")).toEqual(["model-y-juniper"]);
  });
  it("lee los años", () => {
    expect(versionesDe("Model 3 2018-2020, Model 3 2021-2023")).toEqual(["model-3-antiguo"]);
    expect(versionesDe("Model Y 2020-2026")).toEqual(["model-y-antiguo", "model-y-juniper", "model-y-standard"]);
    expect(versionesDe("Model 3 y Model Y (2025-2026)")).toEqual([
      "model-3-highland",
      "model-3-standard",
      "model-y-juniper",
      "model-y-standard",
    ]);
  });
  it("Model Y L y Standard solo si se nombran", () => {
    expect(versionesDe("Model Y L")).toEqual(["model-y-l"]);
    expect(versionesDe("Model Y Standard")).toEqual(["model-y-standard"]);
    expect(versionesDe("Model Y")).not.toContain("model-y-l");
  });
  it("sin versión, vale para todas las del modelo; universal, para todas; otros modelos, ninguna", () => {
    expect(versionesDe("Model 3")).toEqual(["model-3-antiguo", "model-3-highland", "model-3-standard"]);
    expect(versionesDe("Coches con conector Tipo 2")).toHaveLength(7);
    expect(versionesDe("Model S y Model X")).toEqual([]);
  });
});
