import { markMessageRead, setReservationStatus } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata = { title: "Inbox" };
export const instant = false;

export default async function InboxPage() {
  await requireAdmin();
  const sb = await createClient();
  const [{ data: reservations }, { data: messages }] = await Promise.all([
    sb.from("reservations").select("*").order("created_at", { ascending: false }).limit(100),
    sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  return (
    <>
      <header className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] !text-sand">Inbox</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-cream">Reservations &amp; messages</h1>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-bold text-cream">Reservations</h2>
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-ink-900/60 text-[10px] uppercase tracking-[0.2em] text-muted">
              <tr>
                {["Guest", "Contact", "Date", "Time", "Guests", "Notes", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment/5">
              {(reservations ?? []).map((r) => (
                <tr key={r.id} className="align-top text-parchment">
                  <td className="px-4 py-3 font-semibold">{r.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${r.phone}`} className="block hover:text-cream">{r.phone}</a>
                    {r.email && <a href={`mailto:${r.email}`} className="block text-sand hover:text-cream">{r.email}</a>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3">{String(r.time).slice(0, 5)}</td>
                  <td className="px-4 py-3">{r.guests}</td>
                  <td className="max-w-[260px] px-4 py-3 text-stone">{r.notes ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      {r.status !== "confirmed" && <ActionButton onClick={setReservationStatus.bind(null, r.id, "confirmed")}>Confirm</ActionButton>}
                      {r.status !== "declined" && <ActionButton onClick={setReservationStatus.bind(null, r.id, "declined")}>Decline</ActionButton>}
                      {r.status !== "pending" && <ActionButton onClick={setReservationStatus.bind(null, r.id, "pending")}>Reopen</ActionButton>}
                    </div>
                  </td>
                </tr>
              ))}
              {!reservations?.length && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-stone">No reservations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-cream">Contact messages</h2>
        <div className="space-y-3">
          {(messages ?? []).map((m) => (
            <article key={m.id} className={`admin-card p-5 ${m.is_read ? "opacity-70" : "!border-brass/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold !text-cream">
                    {m.name} <span className="font-normal text-sand">· <a href={`mailto:${m.email}`} className="hover:text-cream">{m.email}</a></span>
                  </p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] !text-muted">
                    {new Date(m.created_at).toLocaleString("en-GB")} · {m.locale}
                  </p>
                </div>
                <ActionButton onClick={markMessageRead.bind(null, m.id, !m.is_read)}>{m.is_read ? "Mark unread" : "Mark read"}</ActionButton>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-[14px] !text-parchment">{m.message}</p>
            </article>
          ))}
          {!messages?.length && <p className="text-[13px]">No messages yet.</p>}
        </div>
      </section>
    </>
  );
}

function ActionButton({ onClick, children }: { onClick: () => Promise<void>; children: React.ReactNode }) {
  return (
    <form action={onClick}>
      <button type="submit" className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:text-cream">
        {children}
      </button>
    </form>
  );
}
