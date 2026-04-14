# Routing And Data

## File-Based Routing

- Route files live in `src/routes/`
- Root layout is `src/routes/__root.tsx`
- `src/routeTree.gen.ts` is auto-generated from route files (do not edit)
- Files starting with `-` are ignored by the TanStack Router file-based plugin (useful for co-located helpers)

## Adding A Route

1. Create a file in `src/routes/` (example: `src/routes/blog.tsx`)
2. Define the route with `createFileRoute`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

function BlogPage() {
  return <div>Blog</div>
}
```

## Data Loading

Routes can load data using a `loader`.

For app-internal API routes, prefer the existing Hono RPC client in
`src/lib/api.ts` over raw `fetch('/api/...')` calls:

```tsx
import type { InferResponseType } from 'hono/client'
import { createFileRoute } from '@tanstack/react-router'
import { api } from '../lib/api'

const getHealthRoute = api.health.$get
type Health = InferResponseType<typeof getHealthRoute>

async function getHealth(): Promise<Health> {
  const response = await api.health.$get()

  if (!response.ok) {
    throw new Error('Failed to load health check')
  }

  return response.json()
}

export const Route = createFileRoute('/status')({
  loader: async () => {
    return {
      health: await getHealth(),
    }
  },
  component: StatusPage,
})

function StatusPage() {
  const { health } = Route.useLoaderData()

  return <pre>{JSON.stringify(health, null, 2)}</pre>
}
```

For Hono routes with params, pass them through the generated `param` object:

```tsx
const response = await api.posts[':postId'].$get({
  param: { postId: params.postId },
})
```

If loader failures should be user-visible, prefer route-level error boundaries.

## TanStack Query In Components

TanStack Query works well with the same Hono client helpers. Define a shared
query options object once, then reuse it in loaders, route components, and
smaller client-rendered widgets:

```tsx
import type { InferResponseType } from 'hono/client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

const getHealthRoute = api.health.$get
type Health = InferResponseType<typeof getHealthRoute>

async function getHealth(): Promise<Health> {
  const response = await api.health.$get()

  if (!response.ok) {
    throw new Error('Failed to load health check')
  }

  return response.json()
}

export const healthQuery = queryOptions({
  queryKey: ['health'],
  queryFn: getHealth,
  staleTime: 30_000,
})

function HealthBadge() {
  const { data, isPending, error } = useQuery(healthQuery)

  if (isPending) return <p>Checking API...</p>
  if (error) return <p>Health check failed</p>

  return <p>API status: {data.status}</p>
}
```

If you enable the SSR query integration from `docs/ai/streaming.md`, the router
setup wraps `QueryClientProvider` for you and the same query options can also be
preloaded in route loaders with `queryClient.ensureQueryData(...)`.

## Deferred Data And Streaming

If a route has fast data and slow non-critical data, prefer deferring the slow work
and resolving it with `Await` instead of blocking the full response.

Use `docs/ai/streaming.md` for:

- Switching the server entry to streaming SSR
- Using `defer(...)` with `Await`
- Adding route-level `pendingComponent` and `wrapInSuspense`
- Wiring TanStack Query SSR streaming with `@tanstack/react-router-ssr-query`
