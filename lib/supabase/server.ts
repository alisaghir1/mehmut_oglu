import { createServerClient } from "@supabase/ssr";
import { createClient as createBareClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Request-scoped client (reads/writes auth cookies). Use in Server Components,
 * Server Actions and Route Handlers that need the current user's session.
 */
export async function createClient() {
  const env = supabaseEnv();
  if (!env) throw new Error("Supabase env vars are not set");
  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are read-only here.
          // proxy.ts refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Anonymous client with no cookie access. Safe inside `"use cache"` scopes
 * (public RLS applies). Returns null when Supabase isn't configured.
 */
export function createAnonClient() {
  const env = supabaseEnv();
  if (!env) return null;
  return createBareClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
