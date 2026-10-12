import { z } from "zod";

export type FieldType =
  | "text"
  | "textarea"
  | "localized"
  | "localized-textarea"
  | "localized-list"
  | "number"
  | "price"
  | "boolean"
  | "image"
  | "image-list"
  | "date"
  | "slug"
  | "select"
  | "json";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  /** For `select`: static options or a reference to another resource. */
  options?: { value: string; label: string }[];
  ref?: { resource: string; labelField: string };
  default?: unknown;
}

export interface ResourceDef {
  /** URL segment and table name. */
  key: string;
  table: string;
  label: string;
  labelSingular: string;
  description: string;
  /** Singleton tables (site_settings, about) edit a single row with this id. */
  singleton?: number;
  /** Field used as the row label in lists / references. */
  titleField: string;
  orderBy?: string;
  fields: FieldDef[];
  listColumns: string[];
}

const localized = (name: string, label: string, required = true, help?: string): FieldDef => ({
  name,
  label,
  type: "localized",
  required,
  help,
});
const img = (name: string, label: string, required = true): FieldDef => ({ name, label, type: "image", required });
const order: FieldDef = { name: "sort_order", label: "Sort order", type: "number", default: 0 };
const active: FieldDef = { name: "is_active", label: "Visible on site", type: "boolean", default: true };

export const resources: ResourceDef[] = [
  {
    key: "settings",
    table: "site_settings",
    label: "Site settings",
    labelSingular: "Site settings",
    description: "Name, contact details, opening hours, map and social links.",
    singleton: 1,
    titleField: "name",
    listColumns: [],
    fields: [
      { name: "name", label: "Restaurant name", type: "text", required: true },
      localized("tagline", "Tagline"),
      { name: "description", label: "Description", type: "localized-textarea", required: true },
      { name: "founded_year", label: "Founded year", type: "number", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      localized("address", "Address"),
      localized("hours", "Opening hours"),
      { name: "map_embed_url", label: "Google Maps embed URL", type: "textarea", required: true, help: "Maps → Share → Embed a map → copy only the src URL." },
      { name: "social", label: "Social links", type: "json", help: 'JSON like {"instagram":"https://…","facebook":"…","twitter":"…"}' },
    ],
  },
  {
    key: "sections",
    table: "sections",
    label: "Section headings",
    labelSingular: "Section heading",
    description: "Eyebrow + title for each home page section, and whether it is shown.",
    titleField: "key",
    orderBy: "key",
    listColumns: ["key", "eyebrow", "title", "is_enabled"],
    fields: [
      { name: "key", label: "Key", type: "slug", required: true, help: "Fixed identifier (about, team, menu…). Do not change." },
      localized("eyebrow", "Eyebrow"),
      localized("title", "Title"),
      { name: "is_enabled", label: "Show section", type: "boolean", default: true },
    ],
  },
  {
    key: "hero",
    table: "hero_slides",
    label: "Hero slides",
    labelSingular: "Hero slide",
    description: "Full-screen slides at the top of the home page.",
    titleField: "title",
    orderBy: "sort_order",
    listColumns: ["image", "title", "eyebrow", "sort_order", "is_active"],
    fields: [img("image", "Background image"), localized("eyebrow", "Eyebrow"), localized("title", "Title"), localized("image_alt", "Image alt text"), order, active],
  },
  {
    key: "about",
    table: "about",
    label: "About",
    labelSingular: "About",
    description: "Story, quote, two feature images and the counter.",
    singleton: 1,
    titleField: "quote_author",
    listColumns: [],
    fields: [
      { name: "quote", label: "Quote", type: "localized-textarea", required: true },
      { name: "quote_author", label: "Quote author", type: "text", required: true },
      { name: "paragraphs", label: "Story paragraphs", type: "localized-list", required: true },
      img("image_1", "Image 1 (left)"),
      img("image_2", "Image 2 (right)"),
      { name: "counter_value", label: "Counter value", type: "number", required: true, help: "e.g. founding year" },
      localized("counter_label", "Counter label"),
    ],
  },
  {
    key: "team",
    table: "team_members",
    label: "Team",
    labelSingular: "Team member",
    description: "Chefs and staff.",
    titleField: "name",
    orderBy: "sort_order",
    listColumns: ["image", "name", "role", "sort_order", "is_active"],
    fields: [img("image", "Portrait"), { name: "name", label: "Name", type: "text", required: true }, localized("role", "Role"), order, active],
  },
  {
    key: "categories",
    table: "menu_categories",
    label: "Menu categories",
    labelSingular: "Menu category",
    description: "Tabs shown above the menu.",
    titleField: "name",
    orderBy: "sort_order",
    listColumns: ["name", "slug", "sort_order", "is_active"],
    fields: [localized("name", "Name"), { name: "slug", label: "Slug", type: "slug", required: true }, order, active],
  },
  {
    key: "menu",
    table: "menu_items",
    label: "Menu items",
    labelSingular: "Menu item",
    description: "Dishes and drinks with price and photo.",
    titleField: "name",
    orderBy: "sort_order",
    listColumns: ["image", "name", "category_id", "price", "is_available"],
    fields: [
      img("image", "Photo"),
      localized("name", "Name"),
      { name: "description", label: "Description", type: "localized-textarea", required: true },
      { name: "category_id", label: "Category", type: "select", required: true, ref: { resource: "categories", labelField: "name" } },
      { name: "price", label: "Price", type: "price", required: true },
      { name: "currency", label: "Currency symbol", type: "text", default: "€" },
      order,
      { name: "is_available", label: "Available", type: "boolean", default: true },
    ],
  },
  {
    key: "services",
    table: "services",
    label: "Services",
    labelSingular: "Service",
    description: "Dine in, takeaway, catering…",
    titleField: "title",
    orderBy: "sort_order",
    listColumns: ["image", "title", "sort_order", "is_active"],
    fields: [img("image", "Image"), localized("title", "Title"), { name: "description", label: "Description", type: "localized-textarea", required: true }, order, active],
  },
  {
    key: "gallery",
    table: "gallery_images",
    label: "Interior gallery",
    labelSingular: "Gallery image",
    description: "Photos shown in the “Step inside” grid.",
    titleField: "caption",
    orderBy: "sort_order",
    listColumns: ["image", "caption", "sort_order", "is_active"],
    fields: [
      img("image", "Photo"),
      localized("caption", "Caption"),
      { name: "width", label: "Width (px)", type: "number", default: 1600 },
      { name: "height", label: "Height (px)", type: "number", default: 1200 },
      order,
      active,
    ],
  },
  {
    key: "news",
    table: "posts",
    label: "News",
    labelSingular: "Post",
    description: "Articles shown on the home page and /news.",
    titleField: "title",
    orderBy: "published_at",
    listColumns: ["cover_image", "title", "published_at", "is_published"],
    fields: [
      img("cover_image", "Cover image"),
      localized("title", "Title"),
      { name: "slug", label: "Slug", type: "slug", required: true, help: "URL part, e.g. a-century-of-flavours" },
      { name: "published_at", label: "Published on", type: "date", required: true },
      { name: "excerpt", label: "Excerpt", type: "localized-textarea", required: true },
      { name: "body", label: "Body", type: "localized-textarea", required: true, help: "Separate paragraphs with a blank line." },
      { name: "gallery", label: "Gallery images", type: "image-list" },
      { name: "is_published", label: "Published", type: "boolean", default: true },
    ],
  },
];

export const resourceMap = Object.fromEntries(resources.map((r) => [r.key, r]));
export const getResource = (key: string): ResourceDef | undefined => resourceMap[key];

/* ---------------------------------------------------------------- validation */

const localizedSchema = (required: boolean) =>
  z.object({
    en: required ? z.string().trim().min(1, "English text is required") : z.string().trim(),
    tr: z.string().trim(),
  });

export function buildSchema(def: ResourceDef) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of def.fields) {
    const req = !!f.required;
    switch (f.type) {
      case "localized":
      case "localized-textarea":
        shape[f.name] = localizedSchema(req);
        break;
      case "localized-list":
        shape[f.name] = z.array(localizedSchema(true)).min(req ? 1 : 0, "Add at least one paragraph");
        break;
      case "number":
        shape[f.name] = z.coerce.number().int();
        break;
      case "price":
        shape[f.name] = z.coerce.number().min(0, "Price cannot be negative");
        break;
      case "boolean":
        shape[f.name] = z.boolean();
        break;
      case "image":
        shape[f.name] = req ? z.string().trim().min(1, "An image is required") : z.string().trim();
        break;
      case "image-list":
        shape[f.name] = z.array(z.string().trim().min(1));
        break;
      case "date":
        shape[f.name] = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
        break;
      case "slug":
        shape[f.name] = z
          .string()
          .trim()
          .toLowerCase()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");
        break;
      case "json":
        shape[f.name] = z.record(z.string(), z.unknown());
        break;
      case "select":
        shape[f.name] = req ? z.string().min(1, "Please choose a value") : z.string();
        break;
      default:
        shape[f.name] = req ? z.string().trim().min(1, "Required") : z.string().trim();
    }
  }
  return z.object(shape);
}

/** Convert a submitted FormData into the typed payload the schema expects. */
export function formDataToPayload(def: ResourceDef, fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) {
    switch (f.type) {
      case "localized":
      case "localized-textarea":
        out[f.name] = { en: fd.get(`${f.name}.en`) ?? "", tr: fd.get(`${f.name}.tr`) ?? "" };
        break;
      case "localized-list": {
        const en = fd.getAll(`${f.name}.en`).map(String);
        const tr = fd.getAll(`${f.name}.tr`).map(String);
        out[f.name] = en.map((e, i) => ({ en: e, tr: tr[i] ?? "" })).filter((p) => p.en.trim() || p.tr.trim());
        break;
      }
      case "boolean":
        out[f.name] = fd.get(f.name) === "on" || fd.get(f.name) === "true";
        break;
      case "image-list":
        out[f.name] = fd.getAll(f.name).map(String).filter(Boolean);
        break;
      case "json": {
        const raw = String(fd.get(f.name) ?? "").trim();
        try {
          out[f.name] = raw ? JSON.parse(raw) : {};
        } catch {
          out[f.name] = "__invalid_json__";
        }
        break;
      }
      default:
        out[f.name] = fd.get(f.name) ?? "";
    }
  }
  return out;
}
