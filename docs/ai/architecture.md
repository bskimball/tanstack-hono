# Architecture

This repo is a full-stack React SSR app:

- Router: TanStack Router (file-based routing)
- Server + SSR: Hono
- Build tooling: Vite

## Entry Points

- Client hydration: `src/entry-client.tsx`
- SSR server setup: `src/entry-server.tsx`
- Router configuration: `src/router.tsx`

## Routing Files

- Routes live in `src/routes/`
- Root route/layout: `src/routes/__root.tsx`
- Auto-generated route tree: `src/routeTree.gen.ts`

Important: never edit `src/routeTree.gen.ts` directly; it will be overwritten.
