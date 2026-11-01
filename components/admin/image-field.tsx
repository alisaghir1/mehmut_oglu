"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/app/actions/admin";
import { isSupportedImageSource } from "@/lib/images";

interface ImageFieldProps {
  name: string;
  defaultValue?: string;
  folder: string;
  required?: boolean;
  error?: string;
}

/** Hidden URL input + preview + upload-to-Supabase-Storage button. */
export function ImageField({ name, defaultValue = "", folder, required, error }: ImageFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [err, setErr] = useState<string | undefined>();
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const sourceError = url && !isSupportedImageSource(url)
    ? "Use a local image path or upload an image to Supabase Storage."
    : undefined;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    setErr(undefined);
    start(async () => {
      const res = await uploadImage(fd);
      if (res.error) setErr(res.error);
      else if (res.url) setUrl(res.url);
    });
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-parchment/10 bg-ink-900">
        {url && !sourceError ? (
          <Image src={url} alt="" fill sizes="160px" loading="eager" className="object-cover" unoptimized={!url.startsWith("/")} />
        ) : (
          <span className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted">No image</span>
        )}
        {pending && <span className="absolute inset-0 flex items-center justify-center bg-ink-950/70 text-[11px] uppercase tracking-[0.2em] text-cream">Uploading…</span>}
      </div>

      <div className="min-w-0 flex-1 basis-60 space-y-2">
        <input type="hidden" name={name} value={url} />
        <input
          type="text"
          id={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://… or /images/…"
          aria-invalid={!!(error || err || sourceError) || undefined}
          className="admin-input"
          required={required}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="rounded-lg border border-parchment/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:border-brass hover:text-cream disabled:opacity-50"
          >
            Upload image
          </button>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted hover:text-oxblood-light">
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        {(error || err || sourceError) && <p role="alert" className="text-[12px] !text-oxblood-light">{error || err || sourceError}</p>}
      </div>
    </div>
  );
}

/** Repeatable list of image URLs (post galleries). */
export function ImageListField({ name, defaultValue = [], folder }: { name: string; defaultValue?: string[]; folder: string }) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setErr(undefined);
    start(async () => {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", folder);
        const res = await uploadImage(fd);
        if (res.error) setErr(res.error);
        else if (res.url) setUrls((u) => [...u, res.url!]);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u + i} className="group relative h-24 w-32 overflow-hidden rounded-lg border border-parchment/10 bg-ink-900">
            <input type="hidden" name={name} value={u} />
            <Image src={u} alt="" fill sizes="128px" className="object-cover" unoptimized={!u.startsWith("/")} />
            <button
              type="button"
              onClick={() => setUrls((x) => x.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded-full bg-ink-950/80 px-2 py-0.5 text-[10px] font-bold text-cream opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-parchment/20 text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:border-brass hover:text-cream disabled:opacity-50"
        >
          {pending ? "Uploading…" : "+ Add"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </div>
      {err && <p className="text-[12px] !text-oxblood-light">{err}</p>}
    </div>
  );
}
