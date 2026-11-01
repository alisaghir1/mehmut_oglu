import assert from "node:assert/strict";
import { test } from "node:test";
import { isSupabaseConfigured, supabaseEnv } from "../lib/supabase/env";

test("Supabase configuration supports publishable keys and legacy anon keys", () => {
  const names = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ] as const;
  const original = names.map((name) => process.env[name]);
  try {
    names.forEach((name) => delete process.env[name]);
    assert.equal(supabaseEnv(), null);
    assert.equal(isSupabaseConfigured(), false);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    assert.equal(supabaseEnv(), null);
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "legacy";
    assert.equal(supabaseEnv()?.anonKey, "legacy");
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    assert.equal(supabaseEnv()?.anonKey, "publishable");
    assert.equal(isSupabaseConfigured(), true);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "";
    assert.equal(supabaseEnv()?.anonKey, "legacy");
  } finally {
    names.forEach((name, i) => {
      if (original[i] === undefined) delete process.env[name];
      else process.env[name] = original[i];
    });
  }
});
