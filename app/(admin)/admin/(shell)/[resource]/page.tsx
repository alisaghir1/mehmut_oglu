import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getResource, type ResourceDef } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;
export const instant = false;

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { resource } = await params;
  const def = getResource(resource);
  if (!def) notFound();
  if (def.singleton) redirect(`/admin/${def.key}/${def.singleton}`);
  const flags = await searchParams;

  await requireAdmin();
  const sb = await createClient();
  const { data, error } = await sb
    .from(def.table)
    .select("*")
    .order(def.orderBy ?? "sort_order", { ascending: def.orderBy !== "published_at" });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Row[];

  // Resolve select/ref labels (e.g. menu item → category name).
  const refs: Record<string, Record<string, string>> = {};
  for (const f of def.fields) {
    if (f.type === "select" && f.ref) {
      const refDef = getResource(f.ref.resource);
      if (!refDef) continue;
      const { data: refRows } = await sb.from(refDef.table).select("*");
      refs[f.name] = Object.fromEntries(((refRows ?? []) as Row[]).map((r) => [String(r.id), cell(r[f.ref!.labelField])]));
    }
  }

  const idField = def.key === "sections" ? "key" : "id";

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] !text-sand">{def.label}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-cream">{def.label}</h1>
          <p className="mt-2 text-[13px]">{def.description}</p>
        </div>
        {def.key !== "sections" && (
          <Button as={Link} href={`/admin/${def.key}/new`} variant="solid" size="sm">
            + New {def.labelSingular.toLowerCase()}
          </Button>
        )}
      </header>

      {(flags.saved || flags.deleted) && (
        <p role="status" className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] !text-emerald-200">
          {flags.saved ? "Saved." : "Deleted."}
        </p>
      )}

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-ink-900/60 text-[10px] uppercase tracking-[0.2em] text-muted">
            <tr>
              {def.listColumns.map((c) => (
                <th key={c} className="px-4 py-3 font-bold">
                  {def.fields.find((f) => f.name === c)?.label ?? c}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment/5">
            {rows.map((r) => (
              <tr key={String(r[idField])} className="text-parchment hover:bg-ink-700/40">
                {def.listColumns.map((c) => (
                  <td key={c} className="px-4 py-3 align-middle">
                    <Cell def={def} name={c} value={r[c]} refs={refs} />
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/${def.key}/${encodeURIComponent(String(r[idField]))}`}
                    className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:text-cream"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={def.listColumns.length + 1} className="px-4 py-10 text-center text-stone">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function cell(v: unknown): string {
  if (v && typeof v === "object" && "en" in (v as Row)) return String((v as Row).en ?? "");
  return String(v ?? "");
}

function Cell({ def, name, value, refs }: { def: ResourceDef; name: string; value: unknown; refs: Record<string, Record<string, string>> }) {
  const f = def.fields.find((x) => x.name === name);
  if (f?.type === "image" || name === "image" || name === "cover_image") {
    const src = String(value ?? "");
    return src ? (
      <span className="relative block h-10 w-14 overflow-hidden rounded-md bg-ink-900">
        <Image src={src} alt="" fill sizes="56px" className="object-cover" unoptimized={!src.startsWith("/")} />
      </span>
    ) : (
      <span className="text-muted">—</span>
    );
  }
  if (f?.type === "boolean") {
    return (
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${value ? "bg-emerald-400" : "bg-ink-500"}`} aria-label={value ? "yes" : "no"} />
    );
  }
  if (f?.type === "price") return <>{Number(value).toFixed(2)}</>;
  if (f?.type === "select" && refs[name]) return <>{refs[name][String(value)] ?? "—"}</>;
  return <span className="line-clamp-1">{cell(value)}</span>;
}
