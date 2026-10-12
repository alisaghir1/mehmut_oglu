import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// Everything under /admin is per-request (auth cookies) and never prerendered.
export const instant = false;

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const user = await requireAdmin();

  const sb = await createClient();
  const [{ count: unreadMsgs }, { count: pendingRes }] = await Promise.all([
    sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    sb.from("reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <div className="flex min-h-svh">
      <AdminSidebar email={user.email ?? ""} unread={(unreadMsgs ?? 0) + (pendingRes ?? 0)} />
      <main className="flex-1 overflow-x-hidden px-8 py-8 lg:px-12">{children}</main>
    </div>
  );
}
