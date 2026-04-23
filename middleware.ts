import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["hu", "en"],
  defaultLocale: "hu",
});

export const config = {
  matcher: ["/((?!api|studio|_next|.*\\..*).*)"],
};
