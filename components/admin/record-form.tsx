"use client";

import { useActionState, useState } from "react";
import { deleteRecord, saveRecord, type AdminFormState } from "@/app/actions/admin";
import { adminIdleState } from "@/lib/admin/state";
import { Button } from "@/components/ui/button";
import type { FieldDef, ResourceDef } from "@/lib/admin/resources";
import { ImageField, ImageListField } from "./image-field";

type Row = Record<string, unknown>;
type Localized = { en: string; tr: string };

interface RecordFormProps {
  def: ResourceDef;
  id: string | null;
  row: Row | null;
  refOptions: Record<string, { value: string; label: string }[]>;
}

export function RecordForm({ def, id, row, refOptions }: RecordFormProps) {
  const bound = saveRecord.bind(null, def.key, id);
  const [state, action, pending] = useActionState<AdminFormState, FormData>(bound, adminIdleState);
  const errors = state.errors ?? {};

  return (
    <form action={action} className="space-y-8">
      <div className="admin-card divide-y divide-parchment/5">
        {def.fields.map((f) => (
          <div key={f.name} className="grid gap-3 px-6 py-5 lg:grid-cols-[220px_1fr]">
            <div>
              <label htmlFor={f.name} className="block text-[12px] font-bold uppercase tracking-[0.15em] text-sand">
                {f.label}
                {f.required && <span className="text-oxblood-light"> *</span>}
              </label>
              {f.help && <p className="mt-1 text-[12px] leading-relaxed">{f.help}</p>}
            </div>
            <div>
              <FieldInput f={f} value={row?.[f.name]} def={def} refOptions={refOptions} errors={errors} />
              {errors[f.name] && f.type !== "image" && (
                <p role="alert" className="mt-2 text-[12px] !text-oxblood-light">
                  {errors[f.name]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="solid" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {state.status !== "idle" && (
          <p role="status" className={`text-[13px] font-semibold ${state.status === "success" ? "!text-emerald-300" : "!text-oxblood-light"}`}>
            {state.message}
          </p>
        )}
        {id && !def.singleton && def.key !== "sections" && (
          <DeleteButton resourceKey={def.key} id={id} label={def.labelSingular} />
        )}
      </div>
    </form>
  );
}

function DeleteButton({ resourceKey, id, label }: { resourceKey: string; id: string; label: string }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return (
      <button type="button" onClick={() => setConfirm(true)} className="ml-auto text-[11px] font-bold uppercase tracking-[0.15em] text-muted hover:text-oxblood-light">
        Delete {label.toLowerCase()}
      </button>
    );
  }
  return (
    <span className="ml-auto flex items-center gap-3 text-[12px]">
      <span className="!text-parchment">Delete permanently?</span>
      <button type="submit" formAction={deleteRecord.bind(null, resourceKey, id)} formNoValidate className="rounded-lg bg-oxblood px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-cream">
        Yes, delete
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand">
        Cancel
      </button>
    </span>
  );
}

/* ----------------------------------------------------------------- inputs */

function FieldInput({
  f,
  value,
  def,
  refOptions,
  errors,
}: {
  f: FieldDef;
  value: unknown;
  def: ResourceDef;
  refOptions: Record<string, { value: string; label: string }[]>;
  errors: Record<string, string>;
}) {
  const v = value ?? f.default;
  switch (f.type) {
    case "localized":
    case "localized-textarea":
      return <LocalizedInput name={f.name} value={v as Localized | undefined} multiline={f.type === "localized-textarea"} errors={errors} />;
    case "localized-list":
      return <LocalizedListInput name={f.name} value={(v as Localized[]) ?? []} />;
    case "textarea":
      return <textarea id={f.name} name={f.name} defaultValue={String(v ?? "")} rows={3} className="admin-input" aria-invalid={!!errors[f.name] || undefined} />;
    case "number":
    case "price":
      return (
        <input
          id={f.name}
          name={f.name}
          type="number"
          step={f.type === "price" ? "0.01" : "1"}
          defaultValue={v === undefined || v === null ? "" : String(v)}
          className="admin-input max-w-[200px]"
          aria-invalid={!!errors[f.name] || undefined}
        />
      );
    case "boolean":
      return (
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input id={f.name} name={f.name} type="checkbox" defaultChecked={Boolean(v)} className="h-4 w-4 accent-[#880807]" />
          <span className="text-[13px] !text-parchment">Yes</span>
        </label>
      );
    case "image":
      return <ImageField name={f.name} defaultValue={String(v ?? "")} folder={def.key} required={f.required} error={errors[f.name]} />;
    case "image-list":
      return <ImageListField name={f.name} defaultValue={(v as string[]) ?? []} folder={def.key} />;
    case "date":
      return <input id={f.name} name={f.name} type="date" defaultValue={String(v ?? "").slice(0, 10)} className="admin-input max-w-[220px]" aria-invalid={!!errors[f.name] || undefined} />;
    case "select":
      return (
        <select id={f.name} name={f.name} defaultValue={String(v ?? "")} className="admin-input max-w-[320px]" aria-invalid={!!errors[f.name] || undefined}>
          <option value="">— choose —</option>
          {(f.options ?? refOptions[f.name] ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "json":
      return <textarea id={f.name} name={f.name} defaultValue={v ? JSON.stringify(v, null, 2) : ""} rows={5} className="admin-input font-mono text-[12px]" />;
    case "slug":
      return <input id={f.name} name={f.name} type="text" defaultValue={String(v ?? "")} readOnly={def.key === "sections"} className="admin-input max-w-[360px] font-mono text-[13px]" aria-invalid={!!errors[f.name] || undefined} />;
    default:
      return <input id={f.name} name={f.name} type="text" defaultValue={String(v ?? "")} className="admin-input" aria-invalid={!!errors[f.name] || undefined} />;
  }
}

function LocalizedInput({ name, value, multiline, errors }: { name: string; value?: Localized; multiline: boolean; errors: Record<string, string> }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["en", "tr"] as const).map((loc) => (
        <label key={loc} className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{loc === "en" ? "English" : "Türkçe"}</span>
          <Tag
            id={loc === "en" ? name : undefined}
            name={`${name}.${loc}`}
            defaultValue={value?.[loc] ?? ""}
            rows={multiline ? 4 : undefined}
            className="admin-input"
            aria-invalid={!!errors[`${name}.${loc}`] || undefined}
          />
          {errors[`${name}.${loc}`] && <span className="mt-1 block text-[12px] text-oxblood-light">{errors[`${name}.${loc}`]}</span>}
        </label>
      ))}
    </div>
  );
}

function LocalizedListInput({ name, value }: { name: string; value: Localized[] }) {
  const [items, setItems] = useState<Localized[]>(value.length ? value : [{ en: "", tr: "" }]);
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-parchment/10 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Paragraph {i + 1}</span>
            {items.length > 1 && (
              <button type="button" onClick={() => setItems((x) => x.filter((_, j) => j !== i))} className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted hover:text-oxblood-light">
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <textarea name={`${name}.en`} defaultValue={it.en} rows={4} placeholder="English" className="admin-input" />
            <textarea name={`${name}.tr`} defaultValue={it.tr} rows={4} placeholder="Türkçe" className="admin-input" />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setItems((x) => [...x, { en: "", tr: "" }])} className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:text-cream">
        + Add paragraph
      </button>
    </div>
  );
}
