import "server-only";
import { io } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./env";
import { createClient } from "./server";

/** Current authenticated user, or null. Validates the JWT with Supabase Auth. */
export async function getUser() {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

/** True when the current user has a row in public.admins. */
export async function isAdmin() {
  if (!isSupabaseConfigured()) return false;
  const sb = await createClient();
  const { data, error } = await sb.rpc("is_admin");
  return !error && data === true;
}

/** Guard for admin pages and Server Actions. Redirects when not an admin. */
export async function requireAdmin() {
  await io();
  const user = await getUser();
  if (!user) redirect("/admin/login");
  if (!(await isAdmin())) redirect("/admin/login?error=forbidden");
  return user;
}
