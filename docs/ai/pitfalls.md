# Common Pitfalls

1. Loader functions must be `async` (and should handle errors intentionally)
2. Avoid importing server-only code into client bundles
3. Client code can only access env vars prefixed with `VITE_`
