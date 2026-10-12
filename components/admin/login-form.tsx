"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/admin";
import { adminIdleState } from "@/lib/admin/state";
import { Button } from "@/components/ui/button";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, adminIdleState);
  const message = state.message ?? initialError;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-sand">Email</span>
        <input name="email" type="email" autoComplete="email" required className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-sand">Password</span>
        <input name="password" type="password" autoComplete="current-password" required minLength={6} className="admin-input" />
      </label>
      {message && (
        <p role="alert" className="text-[13px] font-semibold !text-oxblood-light">
          {message}
        </p>
      )}
      <Button type="submit" variant="solid" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
