"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { submitReservation } from "@/app/actions/forms";
import { Button } from "@/components/ui/button";
import { idleState } from "@/lib/forms/schemas";
import { useClientDate } from "@/lib/hooks/use-client-date";
import { Field, FormStatus, Honeypot } from "./field";

export function ReservationForm() {
  const t = useTranslations("reservation");
  const [state, action, pending] = useActionState(submitReservation, idleState);
  const ref = useRef<HTMLFormElement>(null);
  const today = useClientDate((d) => d.toISOString().slice(0, 10)) ?? undefined;

  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state.status]);

  return (
    <form ref={ref} action={action} noValidate className="relative mx-auto w-full max-w-3xl space-y-6">
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-3">
        <Field name="name" label={t("name")} autoComplete="name" required error={state.errors?.name} />
        <Field name="phone" label={t("phone")} type="tel" autoComplete="tel" required error={state.errors?.phone} />
        <Field name="email" label={t("email")} type="email" autoComplete="email" error={state.errors?.email} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <Field name="date" label={t("date")} type="date" min={today} required error={state.errors?.date} />
        <Field name="time" label={t("time")} type="time" step="900" defaultValue="19:00" required error={state.errors?.time} />
        <Field name="guests" label={t("guests")} type="number" min="1" max="20" defaultValue="2" required error={state.errors?.guests} />
      </div>
      <Field name="notes" label={t("notes")} multiline error={state.errors?.notes} />
      <div className="divider-s" />
      <div className="flex flex-col items-center gap-5">
        <Button type="submit" variant="solid" disabled={pending} aria-busy={pending}>
          {pending ? t("submitting") : t("submit")}
        </Button>
        <FormStatus state={state} success={t("success")} error={t("error")} />
      </div>
    </form>
  );
}
