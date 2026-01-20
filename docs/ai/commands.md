# Commands

## Daily Workflow

- `npm run dev`: start Vite dev server
- `npm test`: run Vitest (CI-style)
- `npm run check`: run lint + Prettier check
- `npm run format`: format with Prettier
- `npm run lint`: lint with ESLint

## Build / Run (Production)

- `npm run build`: runs `build:client`, `build:server`, then `build:types`
- `npm run build:types`: TypeScript typecheck (`tsc`)
- `npm run start`: run the built server (`dist/server/index.js`)

## Build Outputs

- Client output: `dist/client/` (static assets are under `dist/client/static/`)
- Server output: `dist/server/index.js`
