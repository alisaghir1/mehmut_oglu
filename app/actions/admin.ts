"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { buildSchema, formDataToPayload, getResource } from "@/lib/admin/resources";
import { SITE_CONTENT_TAG } from "@/lib/content";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export type AdminFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

/* ------------------------------------------------------------------ auth */

export async function signIn(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(6), next: z.string().optional() })
    .safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", message: "Enter a valid email and password." };

  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { status: "error", message: error.message };

  const { data: admin } = await sb.rpc("is_admin");
  if (admin !== true) {
    await sb.auth.signOut();
    return { status: "error", message: "This account is not an administrator." };
  }

  const next = parsed.data.next && parsed.data.next.startsWith("/admin") ? parsed.data.next : "/admin";
  redirect(next);
}

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

/* --------------------------------------------------------------- content */

function zodToErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const key = i.path.map(String).join(".");
    if (!out[key]) out[key] = i.message;
  }
  return out;
}

export async function saveRecord(
  resourceKey: string,
  id: string | null,
  _prev: AdminFormState,
  fd: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const def = getResource(resourceKey);
  if (!def) return { status: "error", message: "Unknown resource" };

  const payload = formDataToPayload(def, fd);
  if (Object.values(payload).includes("__invalid_json__")) {
    return { status: "error", message: "Invalid JSON in one of the fields." };
  }
  const parsed = buildSchema(def).safeParse(payload);
  if (!parsed.success) return { status: "error", message: "Please fix the highlighted fields.", errors: zodToErrors(parsed.error) };

  const sb = await createClient();
  let error;
  if (def.singleton) {
    ({ error } = await sb.from(def.table).upsert({ id: def.singleton, ...parsed.data }));
  } else if (id) {
    ({ error } = await sb.from(def.table).update(parsed.data).eq(def.key === "sections" ? "key" : "id", id));
  } else {
    ({ error } = await sb.from(def.table).insert(parsed.data));
  }
  if (error) return { status: "error", message: error.message };

  updateTag(SITE_CONTENT_TAG);
  if (!def.singleton && !id) redirect(`/admin/${def.key}?saved=1`);
  return { status: "success", message: "Saved." };
}

export async function deleteRecord(resourceKey: string, id: string) {
  await requireAdmin();
  const def = getResource(resourceKey);
  if (!def || def.singleton) return;
  const sb = await createClient();
  const { error } = await sb.from(def.table).delete().eq(def.key === "sections" ? "key" : "id", id);
  if (error) throw new Error(error.message);
  updateTag(SITE_CONTENT_TAG);
  redirect(`/admin/${def.key}?deleted=1`);
}

/* --------------------------------------------------------------- storage */

const MAX_UPLOAD = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];

export async function uploadImage(fd: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = fd.get("file");
  const folder = String(fd.get("folder") ?? "misc").replace(/[^a-z0-9-]/gi, "");
  if (!(file instanceof File)) return { error: "No file received" };
  if (file.size > MAX_UPLOAD) return { error: "File is larger than 10 MB" };
  if (!ALLOWED.includes(file.type)) return { error: "Unsupported image type" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const sb = await createClient();
  const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };
  const { data } = sb.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}

/* ----------------------------------------------------------------- inbox */

export async function setReservationStatus(id: string, status: "pending" | "confirmed" | "declined" | "cancelled") {
  await requireAdmin();
  const sb = await createClient();
  const { error } = await sb.from("reservations").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/inbox");
}

export async function markMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  const sb = await createClient();
  const { error } = await sb.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/inbox");
}
