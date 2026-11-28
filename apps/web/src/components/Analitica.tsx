"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NO_MEDIR } from "@/lib/no-medir";

/** Contenedor de Google Tag Manager (analítica). Solo se carga si la persona lo acepta. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-T78HDVK3";
const CLAVE = "chollesla-analitica";

function leer(): string | null {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

/** Aplica `?medir=no|si` y dice si este navegador está excluido. Renueva la cookie en cada visita. */
function excluido(): boolean {
  const pedido = new URLSearchParams(window.location.search).get("medir");
  try {
    if (pedido === "no") localStorage.setItem(NO_MEDIR, "1");
    if (pedido === "si") localStorage.removeItem(NO_MEDIR);
    const si = localStorage.getItem(NO_MEDIR) === "1";
    document.cookie = `${NO_MEDIR}=1; path=/; max-age=${si ? 63072000 : 0}; samesite=lax; secure`;
    return si;
  } catch {
    return false;
  }
}

function cargarGtm() {
  if (document.getElementById("gtm-script")) return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export function Analitica() {
  const [decidido, setDecidido] = useState(true); // true = no se muestra el aviso hasta saber qué hay guardado

  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const fuera = excluido();
    const pedido = new URLSearchParams(window.location.search).get("medir");
    const mensaje =
      pedido === "no"
        ? fuera
          ? "Este navegador ya no cuenta en las estadísticas."
          : "No se pudo guardar: este navegador sigue contando."
        : pedido === "si"
          ? "Este navegador vuelve a contar en las estadísticas."
          : "";
    // Fuera del cuerpo del efecto: el aviso depende de lo que hay en el navegador.
    if (mensaje) queueMicrotask(() => setAviso(mensaje));
    if (fuera) return;
    const guardado = leer();
    if (guardado === "si") cargarGtm();
    setDecidido(guardado !== null);
  }, []);

  useEffect(() => {
    // Evento para Google Analytics (vía Tag Manager) cuando alguien pulsa «Ir al chollo». Solo se envía si aceptó las cookies.
    const alPulsar = (e: MouseEvent) => {
      const enlace = (e.target as Element | null)?.closest?.("a[data-ir-slug]") as HTMLAnchorElement | null;
      if (!enlace || leer() !== "si" || localStorage.getItem(NO_MEDIR) === "1") return;
      const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({
        event: "ir_al_chollo",
        chollo_slug: enlace.dataset.irSlug,
        chollo_titulo: enlace.dataset.irTitulo,
        tienda: enlace.dataset.irTienda,
      });
    };
    document.addEventListener("click", alPulsar);
    return () => document.removeEventListener("click", alPulsar);
  }, []);

  function decidir(valor: "si" | "no") {
    try {
      localStorage.setItem(CLAVE, valor);
    } catch {
      /* sin almacenamiento: se aplica solo en esta visita */
    }
    if (valor === "si") cargarGtm();
    setDecidido(true);
  }

  if (aviso) {
    return (
      <p role="status" className="fixed inset-x-0 bottom-0 z-50 border-t border-borde bg-superficie px-4 py-4 text-center text-sm font-medium text-texto shadow-2xl">
        {aviso}
      </p>
    );
  }

  if (decidido) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies de analítica"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-borde bg-superficie px-4 py-4 shadow-2xl"
    >
      <div className="mx-auto flex max-w-[1250px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-texto">
          Usamos Google Analytics para saber cuántas personas visitan la web y qué chollos interesan. Solo se activa si lo
          aceptas.{" "}
          <Link href="/cookies" className="underline">
            Más información
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decidir("no")}
            className="rounded border border-borde px-4 py-2 text-sm font-bold hover:bg-fondo"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decidir("si")}
            className="rounded bg-[#ff3d1f] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
