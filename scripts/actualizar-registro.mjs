// Copia al registro permanente los datos actuales del catálogo (después de traducir los títulos).
import { readFileSync } from "node:fs";
import { registrar } from "./registro.mjs";

registrar(["oficiales", "aliexpress"].flatMap((n) => JSON.parse(readFileSync(`apps/web/src/datos/${n}.json`, "utf8"))));
