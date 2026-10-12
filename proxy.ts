import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  return intl(request);
}

export const config = {
  // Public, localised site only. /admin, /api, Next internals and static files are excluded.
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
};
