/** Foto del coche por versión (o por modelo, con su versión más reciente) para reconocer el propio de un vistazo. */
const DE_MODELO: Record<string, string> = { "model-y": "model-y-juniper", "model-3": "model-3-highland" };
const CON_FOTO = new Set(["model-y-juniper", "model-y-legacy", "model-y-standard", "model-3-highland", "model-3-legacy", "model-3-standard"]);

export function FotoCoche({ id, className = "h-8 w-16" }: { id: string; className?: string }) {
  const clave = DE_MODELO[id] ?? id;
  if (!CON_FOTO.has(clave)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/coches/${clave}.png`} alt="" width={98} height={48} loading="lazy" className={`${className} shrink-0 rounded-sm bg-white object-contain`} />;
}
