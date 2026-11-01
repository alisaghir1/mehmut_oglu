"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId } from "react";
import { useTranslations } from "next-intl";
import type { FormState } from "@/lib/forms/schemas";

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  min?: string;
  max?: string;
  step?: string;
  defaultValue?: string;
  multiline?: boolean;
  className?: string;
};

/** Dinex underline input with floating label and inline validation. */
export function Field({ name, label, error, type = "text", multiline, className = "", ...rest }: FieldProps) {
  const tv = useTranslations("validation");
  const id = `field-${name}-${useId()}`;
  const errId = `${id}-error`;
  const common = {
    id,
    name,
    placeholder: label,
    "aria-label": label,
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? errId : undefined,
    className: `input-line text-center peer ${error ? "!border-oxblood-light" : ""}`,
    ...rest,
  };
  // Native pickers/numeric inputs ignore placeholders, so surface the label visibly.
  const showLabel = ["date", "time", "number"].includes(type);

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label
          htmlFor={id}
          className="mb-1 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea rows={4} {...common} />
      ) : (
        <input type={type} {...common} />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] !text-oxblood-light"
          >
            {tv(error as never)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Honeypot input — invisible to users, filled by naive bots. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ state, success, error }: { state: FormState; success: string; error: string }) {
  return (
    <AnimatePresence mode="wait">
      {state.status !== "idle" && (
        <motion.p
          key={state.status}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`text-center text-[13px] font-semibold ${
            state.status === "success" ? "!text-parchment" : "!text-oxblood-light"
          }`}
        >
          {state.status === "success" ? success : state.errors?.form ? error : null}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
