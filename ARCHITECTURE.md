# Architecture

This repo is a full-stack React SSR app built with TanStack Router (file-based routing) and Hono.

## At A Glance

- Client entry (hydration): `src/entry-client.tsx`
- Server entry (SSR + APIs): `src/entry-server.tsx`
- Routes: `src/routes/` (auto-generates `src/routeTree.gen.ts`)
- Build outputs: `dist/client/` (static assets), `dist/server/index.js` (server)

## Request Flow (High Level)

1. Request hits the Hono server
2. TanStack Router matches the route and runs loaders
3. React renders HTML on the server
4. Client bundle hydrates and takes over navigation

## Guardrails

- Never edit `src/routeTree.gen.ts` directly
- Keep server-only code out of client bundles
- Client env vars must be `VITE_`-prefixed (`import.meta.env.VITE_*`)

## More Detail

- Deep dive: `docs/architecture/deep-dive.md`
- AI-focused architecture notes: `docs/ai/architecture.md`
