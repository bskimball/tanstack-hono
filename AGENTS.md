# AI Agent Guidelines

Full-stack React SSR app — TanStack Router (file-based routing) + Hono (server/SSR) + Vite+ + TypeScript.

## Essentials

- Package manager: `vp` — never call `npm`/`pnpm`/`yarn` for installs or tooling (`npm start` for running the built server is fine)
- Never edit `src/routeTree.gen.ts` (auto-generated)
- `vp run build` — build client + server | `vp check` — format + lint + typecheck | `vp test` — run tests

## Guides

- [Commands](docs/ai/commands.md) — dev, build, lint, test
- [Architecture](docs/ai/architecture.md) — entry points, request flow, project structure
- [Routing & Data](docs/ai/routing-and-data.md) — file-based routes, loaders, TanStack Query
- [Server/API](docs/ai/server-api.md) — Hono routes, RPC client
- [Code Style](docs/ai/code-style.md) — conventions, imports, naming
- [Testing](docs/ai/testing.md) — Vitest setup, jsdom, globals
- [Environment Variables](docs/ai/environment.md) — VITE_ prefix, access patterns
- [Styling](docs/ai/styling.md) — Tailwind CSS v4
- [Streaming SSR](docs/ai/streaming.md) — optional, deferred data
- [Deployment](docs/ai/deployment.md) — build outputs, production targets
- [Pitfalls](docs/ai/pitfalls.md) — top 3 common mistakes

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
