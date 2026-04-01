# Code Style

## Tooling

- Formatting: Oxfmt (configured in `vite.config.ts` under `fmt`)
- Linting: Oxlint with tsgo type-aware rules (configured in `vite.config.ts` under `lint`)
- Run both: `vp check` / auto-fix: `vp check --fix`
- No separate `.eslintrc`, `.prettierrc`, or similar config files — everything is in `vite.config.ts`

## Conventions

- Imports: `@/` alias or relative imports are both supported
- Types: prefer `interface` for object shapes when reasonable
- React components: prefer function declarations for named components
- File naming: prefer kebab-case for files (example: `user-profile.tsx`); PascalCase is ok for component-only files (example: `Header.tsx`)
