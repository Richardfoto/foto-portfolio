# Foto Portfolio Agent Notes

## Project
- Next.js App Router project with TypeScript, Tailwind CSS, next-intl style locale routing under `app/[locale]/...`.
- Main locales are `hu` and `en`; keep internal links locale-aware with `/${locale}/...`.
- Sanity is the CMS. Do not rename existing Sanity schema `name` values or singleton document IDs unless migration is explicitly requested.

## Next.js Notes
- The generated instruction may mention `node_modules/next/dist/docs/`, but this project currently does not ship that folder. If it is missing, follow the existing App Router patterns in this repo and verify with TypeScript/lint.
- Prefer small route-level changes over broad refactors.
- Keep Server Components as the default. Add `"use client"` only where browser APIs, animation, or state are required.

## Current Route Naming
- The canonical short process page is `/{locale}/roviden`.
- The old `/{locale}/forgatas-menete` route must remain as a redirect to `/{locale}/roviden` so existing links do not break.
- The Sanity schema backing this page remains internally named `forgatasMenete`; only the visible Studio title should say `Röviden`.

## Working Rules
- Preserve existing visual design unless the user explicitly asks for visual changes.
- Do not scan or refactor unrelated code when the user identifies specific files or pages.
- Use `pnpm exec tsc --noEmit` and `pnpm lint` after code changes when feasible.
- Never discard user changes or run destructive git commands without explicit instruction.
