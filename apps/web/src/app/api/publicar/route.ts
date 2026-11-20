import { prepararPublicacion, slugComunidad, type Borrador } from "@chollesla/core";
import { servicio, usuarioDe } from "@/lib/supabase-servidor";

const MAX_DIA = 5;
const PREMODERADOS = 5;

const respuesta = (cuerpo: object, status = 200) => Response.json(cuerpo, { status, headers: { "Cache-Control": "no-store" } });

/** Sigue un acortador (amzn.eu, bit.ly…) hasta el enlace real, sin descargar la página. */
async function resolver(enlace: string): Promise<string | null> {
  let actual = enlace;
  for (let i = 0; i < 5; i++) {
    const r = await fetch(actual, { method: "HEAD", redirect: "manual" }).catch(() => null);
    const destino = r?.headers.get("location");
    if (!r || r.status < 300 || r.status >= 400 || !destino) return i === 0 ? null : actual;
    actual = new URL(destino, actual).toString();
  }
  return actual;
}

/** Publica un chollo de la comunidad con el afiliado de Vic. Los primeros de cada persona quedan pendientes de revisión. */
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const usuario = await usuarioDe(token);
  if (!usuario) return respuesta({ error: "Tienes que entrar para publicar." }, 401);

  const perfil = await servicio(`perfiles?select=alias&id=eq.${usuario.id}`);
  if (!perfil) return respuesta({ error: "La publicación aún no está activada." }, 503);
  if (!((await perfil.json()) as unknown[]).length) return respuesta({ error: "Elige antes tu alias en tu cuenta." }, 403);

  let b: Borrador;
  let caduca: string | null = null;
  try {
    const j = (await req.json()) as Record<string, unknown>;
    const texto = (k: string) => (typeof j[k] === "string" ? (j[k] as string).slice(0, 2500) : "");
    // Fecha de fin opcional (aaaa-mm-dd), entre mañana y dentro de un año.
    const fin = texto("caduca");
    if (/^\d{4}-\d{2}-\d{2}$/.test(fin)) {
      const t = Date.parse(`${fin}T23:59:59+01:00`);
      if (t > Date.now() && t < Date.now() + 366 * 86_400_000) caduca = new Date(t).toISOString();
    }
    b = { titulo: texto("titulo"), enlace: texto("enlace"), precio: texto("precio"), descripcion: texto("descripcion"), modelos: texto("modelos"), foto: texto("foto") };
  } catch {
    return respuesta({ error: "Datos no válidos." }, 400);
  }

  let p = prepararPublicacion(b);
  if (p.ok === "resolver") {
    const real = await resolver(b.enlace);
    p = real ? prepararPublicacion({ ...b, enlace: real }) : { ok: false, error: "No se pudo abrir el enlace acortado. Pega el enlace completo." };
    if (p.ok === "resolver") p = { ok: false, error: "Pega el enlace completo de la tienda." };
  }
  if (p.ok !== true) return respuesta({ error: p.error }, 422);

  // Límites: 5 al día; los 5 primeros de cada persona, revisados antes de publicarse.
  const hace24h = new Date(Date.now() - 86_400_000).toISOString();
  const recientes = await servicio(`chollos?select=id&autor=eq.${usuario.id}&creado=gt.${encodeURIComponent(hace24h)}`);
  if ((((await recientes?.json()) as unknown[] | undefined)?.length ?? 0) >= MAX_DIA) {
    return respuesta({ error: `Máximo ${MAX_DIA} chollos al día.` }, 429);
  }
  const duplicado = await servicio(`chollos?select=slug&enlace=eq.${encodeURIComponent(p.chollo.enlace)}&estado=in.(pendiente,publicado)&limit=1`);
  const dup = ((await duplicado?.json()) as { slug: string }[] | undefined)?.[0];
  if (dup) return respuesta({ error: "Ese chollo ya está publicado.", slug: dup.slug }, 409);
  const publicados = await servicio(`chollos?select=id&autor=eq.${usuario.id}&estado=eq.publicado&limit=${PREMODERADOS}`);
  const confiable = (((await publicados?.json()) as unknown[] | undefined)?.length ?? 0) >= PREMODERADOS;

  const slug = slugComunidad(p.chollo.titulo, crypto.randomUUID().slice(0, 6));
  const alta = await servicio("chollos", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ ...p.chollo, slug, tipo: "comunidad", autor: usuario.id, caduca, estado: confiable ? "publicado" : "pendiente" }),
  });
  if (!alta?.ok) return respuesta({ error: "No se pudo guardar el chollo." }, 500);
  return respuesta({ slug, estado: confiable ? "publicado" : "pendiente" }, 201);
}
