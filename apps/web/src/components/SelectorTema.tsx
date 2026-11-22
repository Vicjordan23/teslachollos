"use client";

import { useEffect, useState } from "react";

type Tema = "oscuro" | "claro";
const CLAVE = "chollesla-tema";

/** Script que se ejecuta antes de pintar para aplicar el tema elegido y evitar el parpadeo. */
export const SCRIPT_TEMA = `try{var t=localStorage.getItem("${CLAVE}");if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t}catch(e){}`;

/** Botón sol/luna de la cabecera. Recuerda la elección en este navegador; si no se elige nada, la web es clara. */
export function SelectorTema() {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    setTema(document.documentElement.dataset.tema === "oscuro" ? "oscuro" : "claro");
  }, []);

  const cambiar = () => {
    const nuevo: Tema = tema === "claro" ? "oscuro" : "claro";
    setTema(nuevo);
    document.documentElement.dataset.tema = nuevo;
    try {
      localStorage.setItem(CLAVE, nuevo);
    } catch {
      /* sin almacenamiento: el cambio vale solo para esta visita */
    }
  };

  const claro = tema === "claro";
  return (
    <button
      type="button"
      onClick={cambiar}
      aria-label={claro ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
      title={claro ? "Tema oscuro" : "Tema claro"}
      className="flex size-10 shrink-0 items-center justify-center rounded border border-borde bg-superficie hover:border-verde-boton"
    >
      {claro ? (
        <svg viewBox="0 0 24 24" className="size-5 text-texto-suave" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5 text-ambar" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
