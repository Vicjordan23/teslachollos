"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIAS, formatoEuros, MODELOS, nombreCategoria, nombreModelo, type IdCategoria, type IdModelo } from "@chollesla/core";
import { useEstado } from "@/lib/interacciones";
import { supabase } from "@/lib/supabase";

interface Alerta {
  id: number;
  palabra: string | null;
  modelo: IdModelo | null;
  categoria: IdCategoria | null;
  precio_max: number | null;
}

const campo = "rounded-full border border-borde bg-white px-4 py-2.5 outline-none focus:border-verde";

/** Alertas por email: palabra, modelo, tipo y precio máximo. Se avisa una vez al día de los chollos nuevos. */
export function MisAlertas() {
  const { sesion, listo, alias } = useEstado();
  const params = useSearchParams();
  const [lista, setLista] = useState<Alerta[] | null>(null);
  const [palabra, setPalabra] = useState(params.get("palabra") ?? "");
  const [modelo, setModelo] = useState(params.get("modelo") ?? "");
  const [categoria, setCategoria] = useState(params.get("categoria") ?? "");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  const [version, setVersion] = useState(0);
  const cargar = () => setVersion((v) => v + 1);
  useEffect(() => {
    const sb = supabase();
    if (!sb || !sesion) return;
    void sb
      .from("alertas")
      .select("id, palabra, modelo, categoria, precio_max")
      .eq("usuario_id", sesion.user.id)
      .order("creado", { ascending: false })
      .then(({ data }) => setLista((data as Alerta[]) ?? []));
  }, [sesion, version]);

  if (listo && !sesion) {
    return (
      <p className="text-texto-suave">
        <Link href="/entrar?volver=/alertas" className="text-verde underline">
          Entra
        </Link>{" "}
        para crear alertas: te avisamos por email cuando aparezca un chollo que encaje.
      </p>
    );
  }
  if (alias === null) {
    return (
      <p className="text-texto-suave">
        Antes, elige tu alias en <Link href="/cuenta" className="text-verde underline">tu cuenta</Link>.
      </p>
    );
  }

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabase();
    if (!sb || !sesion) return;
    const euros = precio ? Math.round(Number(precio.replace(",", ".")) * 100) : null;
    const p = palabra.trim();
    if (!p && !modelo && !categoria) return setError("Pon al menos una palabra, un modelo o un tipo de producto.");
    if (p && (p.length < 2 || p.length > 60)) return setError("La palabra debe tener entre 2 y 60 letras.");
    if (euros !== null && !(euros > 0)) return setError("El precio máximo no es válido.");
    const { error } = await sb.from("alertas").insert({
      usuario_id: sesion.user.id,
      palabra: p || null,
      modelo: modelo || null,
      categoria: categoria || null,
      precio_max: euros,
    });
    if (error) return setError(error.message.includes("20 alertas") ? "Máximo 20 alertas por cuenta." : "No se pudo crear la alerta.");
    setPalabra("");
    setPrecio("");
    setError("");
    cargar();
  };

  const borrar = async (id: number) => {
    await supabase()?.from("alertas").delete().eq("id", id);
    cargar();
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={crear} className="flex flex-col gap-3 rounded-2xl border border-borde bg-white p-4">
        <h2 className="text-lg font-semibold">Nueva alerta</h2>
        <input value={palabra} onChange={(e) => setPalabra(e.target.value)} placeholder="Palabra: wallbox, alfombrillas, spoiler…" aria-label="Palabra" maxLength={60} className={campo} />
        <div className="grid gap-3 sm:grid-cols-3">
          <select value={modelo} onChange={(e) => setModelo(e.target.value)} aria-label="Modelo" className={campo}>
            <option value="">Cualquier modelo</option>
            {MODELOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Tipo de producto" className={campo}>
            <option value="">Cualquier tipo</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <input value={precio} onChange={(e) => setPrecio(e.target.value)} inputMode="decimal" placeholder="Precio máx. (€)" aria-label="Precio máximo en euros" className={campo} />
        </div>
        {error && <p className="text-ambar">{error}</p>}
        <button type="submit" className="w-fit rounded-full bg-verde-boton px-6 py-2.5 font-medium text-white hover:bg-verde-boton-hover">
          Crear alerta
        </button>
        <p className="text-sm text-texto-suave">Te escribimos como mucho una vez al día, solo si hay chollos nuevos que encajen.</p>
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Mis alertas</h2>
        {!lista ? (
          <p className="text-texto-suave">Cargando…</p>
        ) : lista.length === 0 ? (
          <p className="text-texto-suave">Aún no tienes alertas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lista.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-borde bg-white px-4 py-3">
                <span>
                  {[
                    a.palabra && `«${a.palabra}»`,
                    a.modelo && MODELOS.some((m) => m.id === a.modelo) && nombreModelo(a.modelo),
                    a.categoria && CATEGORIAS.some((c) => c.id === a.categoria) && nombreCategoria(a.categoria),
                    a.precio_max && `hasta ${formatoEuros(a.precio_max)}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <button type="button" onClick={() => borrar(a.id)} className="text-sm text-texto-suave underline hover:text-texto">
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
