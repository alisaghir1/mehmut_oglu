import Link from "next/link";
import { resources } from "@/lib/admin/resources";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  await requireAdmin();
  const sb = await createClient();
  const countable = resources.filter((r) => !r.singleton);
  const counts = await Promise.all(
    countable.map((r) => sb.from(r.table).select("*", { count: "exact", head: true }).then((x) => x.count ?? 0)),
  );
  const [{ count: unread }, { count: pending }, { data: upcoming }] = await Promise.all([
    sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    sb.from("reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb
      .from("reservations")
      .select("id,name,date,time,guests,status")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date")
      .order("time")
      .limit(6),
  ]);

  return (
    <>
      <header className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] !text-sand">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-cream">Welcome back</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat href="/admin/inbox" label="Unread messages" value={unread ?? 0} accent />
        <Stat href="/admin/inbox" label="Pending reservations" value={pending ?? 0} accent />
        {countable.map((r, i) => (
          <Stat key={r.key} href={`/admin/${r.key}`} label={r.label} value={counts[i]} />
        ))}
      </div>

      <section className="admin-card mt-10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-cream">Upcoming reservations</h2>
          <Link href="/admin/inbox" className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:text-cream">
            All →
          </Link>
        </div>
        {upcoming && upcoming.length > 0 ? (
          <table className="w-full text-left text-[13px]">
            <thead className="text-[10px] uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="pb-2 font-bold">Guest</th>
                <th className="pb-2 font-bold">Date</th>
                <th className="pb-2 font-bold">Time</th>
                <th className="pb-2 font-bold">Guests</th>
                <th className="pb-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment/5">
              {upcoming.map((r) => (
                <tr key={r.id} className="text-parchment">
                  <td className="py-2.5">{r.name}</td>
                  <td className="py-2.5">{r.date}</td>
                  <td className="py-2.5">{String(r.time).slice(0, 5)}</td>
                  <td className="py-2.5">{r.guests}</td>
                  <td className="py-2.5">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[13px]">No upcoming reservations.</p>
        )}
      </section>
    </>
  );
}

function Stat({ href, label, value, accent }: { href: string; label: string; value: number; accent?: boolean }) {
  return (
    <Link href={href} className={`admin-card block p-5 transition-colors hover:border-brass/40 ${accent && value > 0 ? "!border-oxblood/60" : ""}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] !text-sand">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-cream">{value}</p>
    </Link>
  );
}
