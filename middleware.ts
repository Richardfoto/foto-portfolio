// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["hu", "en"],
  defaultLocale: "hu",
  localePrefix: "always", // ← Ez fontos!
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/(hu|en)\/studio(?=\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(hu|en)\/studio/, "/studio");
    return NextResponse.redirect(url);
  }

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … (files in the public folder)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
