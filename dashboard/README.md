# Tawsil Dashboard

Internal admin/operations dashboard for Sales, Supply, and Operations. Separate app from the
consumer mobile PWA in the repo root — desktop-first, responsive, no mobile lock.

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4 (design tokens in `src/styles/index.css`)
- react-router for navigation
- No component/UI kit — everything here is built from scratch per the design system

## Develop
```
pnpm install
pnpm dev
```

## Deploy (Vercel)
This is an independent app in its own subdirectory with its own lockfile. Create a **separate**
Vercel project from the mobile app's, with:
- Root Directory: `dashboard`
- Build Command: `pnpm build` (auto-detected)
- Output Directory: `dist` (auto-detected)

## Status
Built section-by-section per the build spec. Currently: **Section 1 (Home/Overview)** only —
every other nav item is a placeholder until its section is built and confirmed.
