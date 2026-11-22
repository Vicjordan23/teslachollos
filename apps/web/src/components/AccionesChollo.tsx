"use client";

import { useState } from "react";
import { SITIO } from "@/lib/sitio";

/** Cupón de descuento: etiqueta «Cupón», el código y «Copiar». Pulsarlo copia el código al portapapeles. */
export function CopiarCodigo({ codigo, grande = false }: { codigo: string; grande?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(codigo);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        } catch {
          /* sin permiso de portapapeles: el código sigue visible */
        }
      }}
      className={`flex items-center gap-2 rounded-lg border border-dashed border-verde-boton bg-ficha-chip text-ficha-texto hover:bg-ficha-borde ${grande ? "px-3 py-2 text-base" : "px-2.5 py-1.5 text-sm"}`}
      aria-label={`Copiar el cupón ${codigo}`}
      title="Copia el cupón de descuento"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-ficha-suave">Cupón</span>
      <strong className="font-bold tracking-wide">{codigo}</strong>
      <span className="flex items-center gap-1 rounded bg-verde-boton px-1.5 py-0.5 text-xs font-bold text-white">
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {copiado ? <path d="M5 13l4 4L19 7" /> : (<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>)}
        </svg>
        {copiado ? "¡Copiado!" : "Copiar"}
      </span>
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

/** Botón «Compartir chollo» de la ficha: menú nativo del móvil o, si no hay, WhatsApp, Telegram y copiar el enlace. */
export function CompartirFicha({ ruta, titulo }: { ruta: string; titulo: string }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const url = `${SITIO}${ruta}`;
  const texto = encodeURIComponent(`${titulo} ${url}`);
  const estilo = "rounded border border-borde bg-superficie px-3 py-2 text-sm font-medium hover:border-verde-boton";
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`${estilo} w-fit`}
        onClick={async () => {
          if (typeof navigator !== "undefined" && navigator.share) {
            try {
              await navigator.share({ title: titulo, url });
            } catch {
              /* la persona canceló */
            }
            return;
          }
          setAbierto((v) => !v);
        }}
      >
        Compartir chollo
      </button>
      {abierto && (
        <div className="flex flex-wrap gap-2">
          <a className={estilo} href={`https://wa.me/?text=${texto}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a className={estilo} href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <button
            type="button"
            className={estilo}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 1500);
              } catch {
                /* sin permiso de portapapeles */
              }
            }}
          >
            {copiado ? "¡Enlace copiado!" : "Copiar enlace"}
          </button>
        </div>
      )}
    </div>
  );
}
