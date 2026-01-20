# AI Agent Guidelines

Full-stack React SSR app built with TanStack Router (file-based routing) and Hono (server + SSR), using Vite + TypeScript.

## Essentials

- Package manager: `npm`
- Do not edit `src/routeTree.gen.ts` (auto-generated)
- Routes live in `src/routes/` (file-based)
- SSR server entry: `src/entry-server.tsx`; client entry: `src/entry-client.tsx`
- Non-standard build/typecheck:
  - `npm run build` runs `build:client`, `build:server`, and `build:types`
  - `npm run build:types` runs `tsc`

## More Detailed Guides

- Index: `docs/ai/README.md`
- Commands: `docs/ai/commands.md`
- Architecture + entry points: `docs/ai/architecture.md`
- Routing + data loading: `docs/ai/routing-and-data.md`
- Server/API patterns (Hono): `docs/ai/server-api.md`
- Environment variables: `docs/ai/environment.md`
- Styling (Tailwind): `docs/ai/styling.md`
- Code style + conventions: `docs/ai/code-style.md`
- Testing: `docs/ai/testing.md`
- Performance + deployment notes: `docs/ai/deployment.md`
- Common pitfalls: `docs/ai/pitfalls.md`
