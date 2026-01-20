# Server / API (Hono)

## Where To Add Endpoints

Add server routes in `src/entry-server.tsx`.

## Example

```ts
app.get('/api/users', (c) => {
  return c.json({ users: [] })
})
```

## Guardrails

- Avoid importing server-only code into client bundles; keep server logic in `src/entry-server.tsx` and server-only modules.
