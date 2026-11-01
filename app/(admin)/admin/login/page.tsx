import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Sign in" };

// Reads searchParams and auth cookies at request time.
export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src="/brand/logo.svg" alt="Mehmet Oglu" width={90} height={100} loading="eager" unoptimized />
          <h1 className="mt-6 font-display text-2xl font-bold text-cream">Admin</h1>
          <p className="mt-1 text-[12px] uppercase tracking-[0.2em]">Mehmet Oglu</p>
        </div>

        {configured ? (
          <LoginForm next={next} initialError={error === "forbidden" ? "This account is not an administrator." : undefined} />
        ) : (
          <div className="rounded-card border border-parchment/10 bg-ink-800 p-6 text-[13px] leading-relaxed">
            <p className="!text-parchment">Supabase is not configured.</p>
            <p className="mt-2">
              Copy <code className="text-sand">.env.example</code> to <code className="text-sand">.env.local</code>, add your
              project URL and publishable key, run the SQL migrations in <code className="text-sand">supabase/migrations</code>, then
              restart the dev server.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
