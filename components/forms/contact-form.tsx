"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/app/actions/forms";
import { Button } from "@/components/ui/button";
import { idleState } from "@/lib/forms/schemas";
import { Field, FormStatus, Honeypot } from "./field";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState(submitContact, idleState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state.status]);

  return (
    <form ref={ref} action={action} noValidate className="relative mx-auto w-full max-w-xl space-y-6">
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label={t("name")} autoComplete="name" required error={state.errors?.name} />
        <Field name="email" label={t("email")} type="email" autoComplete="email" required error={state.errors?.email} />
      </div>
      <Field name="message" label={t("message")} multiline required error={state.errors?.message} />
      <div className="divider-s" />
      <div className="flex flex-col items-center gap-5">
        <Button type="submit" variant="solid" disabled={pending} aria-busy={pending}>
          {pending ? t("sending") : t("send")}
        </Button>
        <FormStatus state={state} success={t("success")} error={t("error")} />
      </div>
    </form>
  );
}
