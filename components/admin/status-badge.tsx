export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    pending: "bg-brass/20 text-brass",
    confirmed: "bg-emerald-500/15 text-emerald-300",
    declined: "bg-oxblood/30 text-oxblood-light",
    cancelled: "bg-ink-600 text-stone",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${tone[status] ?? tone.cancelled}`}>
      {status}
    </span>
  );
}
