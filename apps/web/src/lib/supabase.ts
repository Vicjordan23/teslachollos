"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLAVE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Las cuentas funcionan cuando Vic pone NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Cloudflare. */
export const CUENTAS_ACTIVAS = Boolean(URL_SUPABASE && CLAVE_ANON);

let cliente: SupabaseClient | null = null;

/** Cliente de Supabase del navegador (sesión en localStorage, flujo PKCE). Null si no hay claves. */
export function supabase(): SupabaseClient | null {
  if (!CUENTAS_ACTIVAS || typeof window === "undefined") return null;
  cliente ??= createClient(URL_SUPABASE!, CLAVE_ANON!, {
    auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return cliente;
}
