import { jsonLdFaq, type PreguntaFrecuente } from "@chollesla/core";
import { JsonLd } from "./JsonLd";

/** Preguntas frecuentes visibles; el JSON-LD lleva exactamente el mismo texto. */
export function Faq({ preguntas, titulo = "Preguntas frecuentes" }: { preguntas: PreguntaFrecuente[]; titulo?: string }) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-3">
      <JsonLd datos={jsonLdFaq(preguntas)} />
      <h2 className="text-2xl font-semibold">{titulo}</h2>
      <div className="flex flex-col gap-2">
        {preguntas.map((p) => (
          <details key={p.pregunta} className="rounded-xl border border-tarjeta-borde bg-tarjeta p-4">
            <summary className="cursor-pointer font-medium">{p.pregunta}</summary>
            <p className="mt-2 text-texto-suave">{p.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
