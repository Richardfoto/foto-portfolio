// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["hu", "en"],
  defaultLocale: "hu",
  localePrefix: "always", // ← Ez fontos!
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … (files in the public folder)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match all pathnames starting with /studio (Sanity)
    "/studio(.*)",
  ],
};
