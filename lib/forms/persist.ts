import { createAnonClient } from "@/lib/supabase/server";
import type { ContactInput, ReservationInput } from "./schemas";

/**
 * Persistence boundary for public form submissions (anon client; RLS allows
 * insert-only). Without Supabase configured, submissions are logged so the
 * demo still "works" locally.
 */
export async function persistContactMessage(input: ContactInput, locale: string): Promise<void> {
  const sb = createAnonClient();
  if (!sb) {
    console.info("[contact] (no supabase) received", { ...input, locale });
    return;
  }
  const { error } = await sb.from("contact_messages").insert({
    locale,
    name: input.name,
    email: input.email,
    message: input.message,
  });
  if (error) throw error;
}

export async function persistReservation(input: ReservationInput, locale: string): Promise<void> {
  const sb = createAnonClient();
  if (!sb) {
    console.info("[reservation] (no supabase) received", { ...input, locale });
    return;
  }
  const { error } = await sb.from("reservations").insert({
    locale,
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    date: input.date,
    time: input.time,
    guests: input.guests,
    notes: input.notes || null,
  });
  if (error) throw error;
}
