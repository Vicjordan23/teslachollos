"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MODELOS_WEB as MODELOS, VERSIONES, versionesDeModelo, type IdModelo, type IdVersion } from "@chollesla/core";
import { urlFiltro } from "@/lib/explorar";
import { FotoCoche } from "@/components/FotoCoche";

const CLAVE = "chollesla-mi-tesla";
interface Eleccion {
  modelo: IdModelo;
  version?: IdVersion;
}

const boton = (activo: boolean) =>
  `rounded px-4 py-2 text-sm font-semibold ${activo ? "bg-verde-boton text-white" : "border border-borde bg-superficie text-texto hover:border-verde-boton"}`;

/** «¿Qué Tesla tienes?»: elige modelo y versión, se recuerda en este navegador y lleva a los accesorios compatibles. Solo Model 3 y Model Y. */
export function MiTesla() {
  const [eleccion, setEleccion] = useState<Eleccion | null>(null);
  const [editando, setEditando] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Eleccion | null;
      const modelo = MODELOS.find((m) => m.id === guardado?.modelo);
      if (modelo) {
        const version = VERSIONES.find((v) => v.id === guardado?.version && v.modelo === modelo.id)?.id;
        setEleccion({ modelo: modelo.id, version });
      }
    } catch {
      /* sin almacenamiento: se elige en cada visita */
    }
    setListo(true);
  }, []);

  const guardar = (e: Eleccion | null) => {
    setEleccion(e);
    try {
      if (e) localStorage.setItem(CLAVE, JSON.stringify(e));
      else localStorage.removeItem(CLAVE);
    } catch {
      /* ignorado */
    }
  };

  if (!listo) return <div className="h-24" aria-hidden />;

  const modelo = MODELOS.find((m) => m.id === eleccion?.modelo);
  const version = VERSIONES.find((v) => v.id === eleccion?.version);

  if (modelo && !editando) {
    const nombre = version ? `${modelo.nombre} ${version.nombre}` : modelo.nombre;
    return (
      <section aria-label="Tu Tesla" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-borde bg-superficie px-4 py-3">
        <p className="flex items-center gap-3 text-sm">
          <FotoCoche id={version?.id ?? modelo.id} className="h-10 w-20" />
          <span>
            <span className="text-texto-suave">Tu Tesla:</span> <b>{nombre}</b>
          </span>
        </p>
        <div className="flex gap-2">
          <Link href={urlFiltro({ modelo: modelo.id, version: version?.id })} className="rounded bg-verde-boton px-4 py-2 text-sm font-semibold text-white hover:bg-verde-boton-hover">
            Ver accesorios compatibles
          </Link>
          <button type="button" onClick={() => setEditando(true)} className={boton(false)}>
            Cambiar
          </button>
          <button type="button" onClick={() => guardar(null)} className={boton(false)} title="Quita tu elección para ver los accesorios de todos los coches">
            Quitar
          </button>
        </div>
      </section>
    );
  }

  const versiones = modelo ? versionesDeModelo(modelo.id) : [];
  return (
    <section aria-label="Elige tu Tesla" className="flex flex-col gap-3 rounded-xl border border-borde bg-superficie p-4">
      <h2 className="text-xl font-semibold">¿Qué Tesla tienes?</h2>
      <div className="flex flex-wrap gap-2">
        {MODELOS.map((m) => (
          <button key={m.id} type="button" className={`${boton(modelo?.id === m.id)} flex items-center gap-2`} onClick={() => (guardar({ modelo: m.id }), setEditando(true))}>
            <FotoCoche id={m.id} className="h-6 w-12" />
            {m.nombre}
          </button>
        ))}
      </div>
      {modelo && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-texto-suave">¿Y la versión?</p>
          <div className="flex flex-wrap gap-2">
            {versiones.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`${boton(version?.id === v.id)} flex items-center gap-2`}
                onClick={() => {
                  guardar({ modelo: modelo.id, version: v.id });
                  setEditando(false);
                }}
              >
                <FotoCoche id={v.id} className="h-8 w-16" />
                <span>
                  {v.nombre} <span className="font-normal opacity-70">· {v.detalle}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 text-sm">
            <button type="button" className="text-verde-boton hover:underline" onClick={() => setEditando(false)}>
              Listo, sin indicar versión
            </button>
            <button type="button" className="text-texto-suave hover:underline" onClick={() => (guardar(null), setEditando(false))}>
              Quitar mi Tesla
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
