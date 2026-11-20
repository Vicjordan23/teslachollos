"use client";

import { useState } from "react";

/** Copia el código de descuento al portapapeles. */
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
      className="rounded-lg border border-dashed border-verde/50 bg-verde-claro px-2.5 py-1 text-sm font-medium text-verde"
      aria-label={`Copiar el código ${codigo}`}
    >
      {copiado ? "¡Copiado!" : codigo}
    </button>
  );
}

/** Comparte la ficha (menú nativo del móvil) o copia su enlace. */
export function Compartir({ ruta, titulo }: { ruta: string; titulo: string }) {
  const [hecho, setHecho] = useState(false);
  return (
    <button
      type="button"
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
      className="hover:text-texto"
    >
      {hecho ? "Enlace copiado" : "Compartir"}
    </button>
  );
}
