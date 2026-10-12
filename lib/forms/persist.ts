import type { ContactInput, ReservationInput } from "./schemas";

/**
 * Persistence boundary for public form submissions.
 * Phase 4 replaces these bodies with Supabase inserts; the Server Actions
 * and form components do not change.
 */
export async function persistContactMessage(input: ContactInput, locale: string): Promise<void> {
  console.info("[contact] received", { ...input, locale });
}

export async function persistReservation(input: ReservationInput, locale: string): Promise<void> {
  console.info("[reservation] received", { ...input, locale });
}
