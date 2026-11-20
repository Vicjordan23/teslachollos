// Genera el logo de Chollesla en SVG (redibujado a mano a partir del boceto elegido por Vic).
// Uso: node marca/generar_logo.mjs  → escribe marca/chollesla-icono.svg y marca/chollesla-logo.svg
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROJO = "#D90A1C";
const NEGRO = "#171A20";
const BLANCO = "#FFFFFF";

// Sello ondulado: radio modulado por un coseno (12 lóbulos).
function sello(cx, cy, radio, amplitud, lobulos, pasos = 240) {
  let d = "";
  for (let i = 0; i <= pasos; i++) {
    const t = (i / pasos) * 2 * Math.PI;
    const r = radio - amplitud + amplitud * Math.cos(lobulos * t);
    const x = (cx + r * Math.sin(t)).toFixed(1);
    const y = (cy - r * Math.cos(t)).toFixed(1);
    d += `${i ? "L" : "M"}${x} ${y}`;
  }
  return `${d}Z`;
}

// Icono en un lienzo de 512×512.
const icono = `
  <path d="${sello(256, 256, 240, 12, 12)}" fill="${ROJO}"/>
  <circle cx="256" cy="256" r="182" fill="none" stroke="${BLANCO}" stroke-width="16"/>
  <g transform="translate(272 268) rotate(45)">
    <rect x="-64" y="-128" width="128" height="250" rx="34" fill="${BLANCO}"/>
    <circle cx="0" cy="-88" r="15" fill="${ROJO}"/>
  </g>
  <g transform="translate(266 282) rotate(22) scale(1.15)">
    <path d="M14 -56 L-30 12 L-3 12 L-16 74 L30 0 L3 0 Z" fill="${ROJO}"/>
  </g>
  <g stroke="${BLANCO}" stroke-width="14" stroke-linecap="round">
    <line x1="140" y1="186" x2="176" y2="196"/>
    <line x1="156" y1="146" x2="184" y2="174"/>
    <line x1="190" y1="122" x2="200" y2="152"/>
  </g>`;

const iconoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Chollesla">${icono}
</svg>
`;

// Logo horizontal: icono + palabra. La palabra usa Fredoka (Google Fonts, licencia OFL).
// Antes de imprimir o usar fuera de la web, convertir el texto a trazados.
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1700 512" role="img" aria-label="Chollesla">
  <g>${icono}
  </g>
  <text x="560" y="372" font-family="Fredoka, Nunito, 'Arial Rounded MT Bold', sans-serif" font-weight="700" font-size="280" textLength="1090" lengthAdjust="spacingAndGlyphs" fill="${NEGRO}">chollesla</text>
</svg>
`;

const aqui = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(aqui, "chollesla-icono.svg"), iconoSvg);
writeFileSync(join(aqui, "chollesla-logo.svg"), logoSvg);
console.log("Logo generado en", aqui);
