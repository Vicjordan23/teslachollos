/** Solo para el servidor: no importar desde componentes de cliente (usa SUPABASE_SERVICE_ROLE_KEY). */
/** Acceso a Supabase desde el servidor (Worker) por la API REST, sin dependencias. */
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const CLAVE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const HAY_SUPABASE = Boolean(URL_SUPABASE && CLAVE_ANON);

export interface CholloComunidad {
  id: number;
  slug: string;
  tipo: "oficial" | "comunidad";
  tienda: string | null;
  titulo: string;
  descripcion: string;
  modelos: string;
  enlace: string;
  foto: string | null;
  precio_tienda: number;
  precio_final: number;
  desde: boolean;
  fecha_precio: string;
  estado: string;
  creado: string;
  autor_alias: string | null;
  temperatura: number;
  categoria: string;
}

/** Lectura pública (clave anon, respeta RLS). Devuelve [] si no hay Supabase o falla. */
export async function leer<T>(ruta: string, revalidar = 60): Promise<T[]> {
  if (!HAY_SUPABASE) return [];
  try {
    const r = await fetch(`${URL_SUPABASE}/rest/v1/${ruta}`, {
      headers: { apikey: CLAVE_ANON!, Authorization: `Bearer ${CLAVE_ANON}` },
      next: { revalidate: revalidar },
    });
    return r.ok ? ((await r.json()) as T[]) : [];
  } catch {
    return [];
  }
}

/** Usuario dueño de un token de acceso, o null. */
export async function usuarioDe(token: string): Promise<{ id: string } | null> {
  if (!HAY_SUPABASE || !token) return null;
  const r = await fetch(`${URL_SUPABASE}/auth/v1/user`, { headers: { apikey: CLAVE_ANON!, Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const u = (await r.json()) as { id?: string };
  return u.id ? { id: u.id } : null;
}

/** Petición con la clave de servicio (salta RLS). Solo para el servidor; null si falta el secreto. */
export async function servicio(ruta: string, opciones: RequestInit = {}): Promise<Response | null> {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL_SUPABASE || !clave) return null;
  return fetch(`${URL_SUPABASE}/rest/v1/${ruta}`, {
    ...opciones,
    headers: { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json", ...opciones.headers },
    cache: "no-store",
  });
}
