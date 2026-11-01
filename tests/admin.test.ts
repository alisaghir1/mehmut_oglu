import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSchema, formDataToPayload, getResource } from "../lib/admin/resources";
import { isSupportedImageSource } from "../lib/images";

test("image sources match the public image optimizer's configured hosts", () => {
  const original = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  try {
    for (const src of ["/images/photo.webp", "https://example.supabase.co/storage/v1/object/public/media/photo.png"]) {
      assert.equal(isSupportedImageSource(src), true, src);
    }
    for (const src of ["", "photo.png", "//example.com/photo.png", "https://other.example/photo.png", "https://example.supabase.co/private/photo.png"]) {
      assert.equal(isSupportedImageSource(src), false, src);
    }
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = original;
  }
});

test("team records validate bilingual fields, image sources and checkbox payloads", () => {
  const def = getResource("team");
  assert.ok(def);
  const fd = new FormData();
  fd.set("name", "Test Chef");
  fd.set("role.en", "Chef");
  fd.set("role.tr", "Chef");
  fd.set("image", "/images/photo.webp");
  fd.set("sort_order", "1");
  const payload = formDataToPayload(def, fd);
  assert.equal(payload.is_active, false);
  assert.equal(buildSchema(def).safeParse(payload).success, true);
  assert.equal(buildSchema(def).safeParse({ ...payload, image: "invalid" }).success, false);
  assert.equal(buildSchema(def).safeParse({ ...payload, role: { en: "", tr: "" } }).success, false);
});

test("invalid JSON is surfaced instead of being saved as empty content", () => {
  const def = getResource("settings");
  assert.ok(def);
  const fd = new FormData();
  fd.set("social", "{invalid");
  assert.equal(formDataToPayload(def, fd).social, "__invalid_json__");
});
