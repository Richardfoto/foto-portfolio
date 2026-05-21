import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["hu", "en"],
  defaultLocale: "hu",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/hu";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/opengraph-image") {
    return NextResponse.next();
  }

  if (/^\/(hu|en)\/forgatas-menete(?=\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(
      /^\/(hu|en)\/forgatas-menete/,
      (_match, locale: string) => `/${locale}/roviden`,
    );
    return NextResponse.redirect(url, 308);
  }

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
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
