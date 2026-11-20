"use client";

import { useState } from "react";

/** Copia el código de descuento al portapapeles (estilo de la ficha oscura). */
export function CopiarCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(codigo);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 1500);
        } catch {
          /* sin permiso de portapapeles: el código sigue visible */
        }
      }}
      className="rounded-lg border border-dashed border-ficha-borde px-2.5 py-1 text-sm font-medium text-ficha-texto hover:bg-ficha-chip"
      aria-label={`Copiar el código ${codigo}`}
    >
      {copiado ? "¡Copiado!" : codigo}
    </button>
  );
}

/** Comparte la ficha (menú nativo del móvil) o copia su enlace. Solo icono. */
export function Compartir({ ruta, titulo }: { ruta: string; titulo: string }) {
  const [hecho, setHecho] = useState(false);
  return (
    <button
      type="button"
      title={hecho ? "Enlace copiado" : "Compartir"}
      aria-label={hecho ? "Enlace copiado" : "Compartir"}
      onClick={async () => {
        const url = new URL(ruta, window.location.origin).toString();
        try {
          if (navigator.share) await navigator.share({ title: titulo, url });
          else {
            await navigator.clipboard.writeText(url);
            setHecho(true);
            setTimeout(() => setHecho(false), 1500);
          }
        } catch {
          /* el usuario canceló */
        }
      }}
      className="flex items-center gap-1 text-ficha-suave hover:text-ficha-texto"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" />
      </svg>
      {hecho && <span className="text-xs">Copiado</span>}
    </button>
  );
}
