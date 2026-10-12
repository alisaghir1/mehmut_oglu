import type { AdminFormState } from "@/app/actions/admin";

export const adminIdleState: AdminFormState = { status: "idle" };

export const RESERVATION_STATUSES = ["pending", "confirmed", "declined", "cancelled"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
