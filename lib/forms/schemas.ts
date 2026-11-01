import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "required").max(120, "tooLong"),
  email: z.string().trim().email("email").max(200, "tooLong"),
  message: z.string().trim().min(1, "required").max(4000, "tooLong"),
  // Honeypot — bots fill this, humans never see it.
  website: z.string().max(0).optional(),
});

const today = () => new Date().toISOString().slice(0, 10);

export const reservationSchema = z.object({
  name: z.string().trim().min(1, "required").max(120, "tooLong"),
  phone: z
    .string()
    .trim()
    .min(1, "required")
    .regex(/^[+\d][\d\s().-]{6,24}$/, "phone"),
  email: z.string().trim().email("email").max(200, "tooLong").or(z.literal("")),
  date: z.iso.date("date").refine((d) => d >= today(), "date"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "required"),
  guests: z.coerce.number().int().min(1, "guests").max(20, "guests"),
  notes: z.string().trim().max(1000, "tooLong").optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;

export type FormState = {
  status: "idle" | "success" | "error";
  /** Field name → validation message key (messages.validation.*) */
  errors?: Record<string, string>;
};

export const idleState: FormState = { status: "idle" };

/** Collapse a Zod error into `{ field: messageKey }`. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
