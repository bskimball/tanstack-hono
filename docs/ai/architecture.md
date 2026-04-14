# Architecture

This repo is a full-stack React SSR app:

- Router: TanStack Router (file-based routing)
- Server + SSR: Hono
- Build tooling: Vite+ (unified toolchain: Rolldown bundler, Oxlint, Oxfmt, Vitest, tsgo)

## Entry Points

- Client hydration: `src/entry-client.tsx`
- SSR server setup: `src/entry-server.tsx` (non-streaming by default)
- Router configuration: `src/router.tsx`

## SSR Mode

- Default SSR mode is non-streaming via `renderRouterToString`
- Streaming SSR is optional and should be enabled when routes use deferred data,
  `Suspense`, or SSR query streaming
- Streaming setup notes live in `docs/ai/streaming.md`

## Routing Files

- Routes live in `src/routes/`
- Root route/layout: `src/routes/__root.tsx`
- Auto-generated route tree: `src/routeTree.gen.ts`

Important: never edit `src/routeTree.gen.ts` directly; it will be overwritten.

## Project Structure

```
src/
├── components/       # Shared UI components
├── hooks/            # Reusable React hooks
├── lib/              # Shared utilities (API helpers, etc.)
├── routes/           # File-based routes (TanStack Router)
├── tests/            # Component and integration tests
├── entry-client.tsx  # Client hydration entry
├── entry-server.tsx  # Hono SSR server entry
├── router.tsx        # Router factory
├── routeTree.gen.ts  # Auto-generated (do not edit)
├── reportWebVitals.ts
└── styles.css
```
