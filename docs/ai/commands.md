# Commands

## Daily Workflow

- `vp dev`: start Vite dev server
- `vp test`: run Vitest (single-run by default)
- `vp test watch`: run Vitest in watch mode
- `vp check`: run format (Oxfmt) + lint (Oxlint) + type-check (tsgo) in one pass
- `vp check --fix`: auto-fix formatting and lint issues
- `vp fmt`: format only
- `vp lint`: lint only

## Build / Run (Production)

- `vp run build`: runs `build:client` then `build:server`
- `npm start`: run the built server (`dist/server/index.js`)

> Use `vp run build` (not `vp build`) because the project has a custom `build` script in `package.json` that chains client + server builds.

## Build Outputs

- Client output: `dist/client/` (static assets under `dist/client/static/`)
- Server output: `dist/server/index.js`
