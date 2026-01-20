# Contributing

Thanks for contributing! Keep changes focused and align with existing patterns.

## Quick Start

```bash
npm install
npm run dev
```

## Commands

- Dev server: `npm run dev`
- Tests: `npm test`
- Lint + format check: `npm run check`
- Auto-format: `npm run format`
- Lint: `npm run lint`
- Typecheck: `npm run build:types`
- Production build/run: `npm run build` then `npm run start`

More details: `docs/ai/commands.md`

## Codebase Conventions

- Routing: `src/routes/` (TanStack Router file-based routing)
- SSR + API routes: `src/entry-server.tsx`
- Do not edit: `src/routeTree.gen.ts` (auto-generated)
- Imports: `@/` alias or relative imports are both supported

More details: `docs/ai/code-style.md`, `docs/ai/routing-and-data.md`, `docs/ai/server-api.md`

## Pull Requests

- Before opening a PR, run: `npm run check && npm test && npm run build`
- Include a short description of what changed and why

## Docker (Optional)

```bash
docker-compose up app
docker-compose --profile dev up dev
```
