"use server";

import { getLocale } from "next-intl/server";
import { persistContactMessage, persistReservation } from "@/lib/forms/persist";
import { contactSchema, fieldErrors, reservationSchema, type FormState } from "@/lib/forms/schemas";

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };
  if (parsed.data.website) return { status: "success" }; // honeypot tripped: pretend success

  try {
    await persistContactMessage(parsed.data, await getLocale());
    return { status: "success" };
  } catch (err) {
    console.error("[contact] persist failed", err);
    return { status: "error", errors: { form: "error" } };
  }
}

export async function submitReservation(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = reservationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };
  if (parsed.data.website) return { status: "success" };

  try {
    await persistReservation(parsed.data, await getLocale());
    return { status: "success" };
  } catch (err) {
    console.error("[reservation] persist failed", err);
    return { status: "error", errors: { form: "error" } };
  }
}
