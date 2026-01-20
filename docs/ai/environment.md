# Environment Variables

## Local Development

- Use `.env` for local development
- `.env.example` documents expected variables

## Access Patterns

- Server / SSR: use `process.env.MY_VAR`
- Client: use `import.meta.env.VITE_MY_VAR` (only `VITE_`-prefixed variables are exposed)

If you need an env var in client code, rename/prefix it with `VITE_` and ensure it is safe to expose.
