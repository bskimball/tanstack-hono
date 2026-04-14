# Server / API (Hono)

## Where To Add Endpoints

Define API routes in `src/routes/-api.ts` and mount them from
`src/entry-server.tsx`.

This template mounts the API handler at `/api`:

```ts
app.route('/api', apiHandler)
```

That means a Hono route defined as `routes.get('/health', ...)` in
`src/routes/-api.ts` is available at `/api/health` in the browser.

## Existing RPC Client

This repo already includes a type-safe Hono RPC client in `src/lib/api.ts`:

```ts
import { hc } from 'hono/client'
import type { ApiRoutes } from '../routes/-api'

export const api = hc<ApiRoutes>('/api')
```

Prefer `api` over raw `fetch('/api/...')` when calling app-internal Hono routes
from loaders or TanStack Query query functions. It keeps the client call sites
in sync with the route definitions in `src/routes/-api.ts`.

## Example

```ts
import { Hono } from 'hono'

const routes = new Hono().get('/users', (c) => {
  return c.json({ users: [] })
})

export type ApiRoutes = typeof routes
export const handler = routes
```

## RPC Usage Example

For a route with params, use Hono's generated client methods instead of building
URLs by hand:

```ts
import type { InferResponseType } from 'hono/client'
import { api } from '../lib/api'

const getUserRoute = api.users[':userId'].$get
type User = InferResponseType<typeof getUserRoute>

async function getUser(userId: string): Promise<User> {
  const response = await api.users[':userId'].$get({
    param: { userId },
  })

  if (!response.ok) {
    throw new Error('Failed to load user')
  }

  return response.json()
}
```

## Guardrails

- Avoid importing server-only code into client bundles; keep server logic in `src/entry-server.tsx` and server-only modules.
- Prefer the shared `api` client from `src/lib/api.ts` for internal Hono routes.
- Keep RPC helpers and shared query options in client-safe modules such as `src/lib/api.ts` or `src/lib/queries/*`.
