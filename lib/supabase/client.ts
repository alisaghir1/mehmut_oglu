"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const env = supabaseEnv();
  if (!env) throw new Error("Supabase env vars are not set");
  client ??= createBrowserClient(env.url, env.anonKey);
  return client;
}
