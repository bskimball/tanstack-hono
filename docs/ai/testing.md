# Testing

- Test runner: Vitest (via Vite+)
- Test files: `*.test.ts` and `*.test.tsx` in `src/tests/`
- Run (single-run): `vp test`
- Run (watch mode): `vp test watch`
- Test environment: jsdom (configured in `vite.config.ts` under `test`)
- Globals enabled: `describe`, `it`, `expect`, etc. are available without imports
