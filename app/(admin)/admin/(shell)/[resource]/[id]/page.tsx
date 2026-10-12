import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordForm } from "@/components/admin/record-form";
import { getResource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;

export default async function RecordPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id: rawId } = await params;
  const def = getResource(resource);
  if (!def) notFound();
  const id = decodeURIComponent(rawId);
  const isNew = id === "new";
  const idField = def.key === "sections" ? "key" : "id";

  await requireAdmin();
  const sb = await createClient();
  let row: Row | null = null;
  if (!isNew) {
    const { data, error } = await sb.from(def.table).select("*").eq(idField, def.singleton ?? id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data && !def.singleton) notFound();
    row = (data as Row) ?? null;
  }

  // Options for reference selects.
  const refOptions: Record<string, { value: string; label: string }[]> = {};
  for (const f of def.fields) {
    if (f.type === "select" && f.ref) {
      const refDef = getResource(f.ref.resource);
      if (!refDef) continue;
      const { data } = await sb.from(refDef.table).select("*").order(refDef.orderBy ?? "sort_order");
      refOptions[f.name] = ((data ?? []) as Row[]).map((r) => {
        const lbl = r[f.ref!.labelField];
        return { value: String(r.id), label: lbl && typeof lbl === "object" ? String((lbl as Row).en) : String(lbl) };
      });
    }
  }

  const title = isNew
    ? `New ${def.labelSingular.toLowerCase()}`
    : def.singleton
      ? def.label
      : labelOf(row?.[def.titleField]) || def.labelSingular;

  return (
    <>
      <header className="mb-8">
        {!def.singleton && (
          <Link href={`/admin/${def.key}`} className="text-[11px] font-bold uppercase tracking-[0.25em] text-sand hover:text-cream">
            ← {def.label}
          </Link>
        )}
        <h1 className="mt-2 font-display text-4xl font-bold text-cream">{title}</h1>
        {def.singleton && <p className="mt-2 text-[13px]">{def.description}</p>}
      </header>
      <RecordForm def={def} id={isNew ? null : id} row={row} refOptions={refOptions} />
    </>
  );
}

function labelOf(v: unknown) {
  if (v && typeof v === "object" && "en" in (v as Row)) return String((v as Row).en ?? "");
  return v == null ? "" : String(v);
}
