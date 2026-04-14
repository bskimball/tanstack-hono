# Streaming SSR

This repo uses non-streaming SSR by default.

- Current server entry: `src/entry-server.tsx`
- Current renderer: `renderRouterToString`
- Default behavior: the full HTML response is rendered before it is sent

That is a good default for this template because it keeps SSR setup simple and does
not require route-level deferred data or suspenseful query flows.

Use streaming SSR when you want to:

- Flush the shell early
- Stream deferred loader data as it resolves
- Let suspenseful query work continue rendering during SSR

TanStack Router supports both modes. The docs examples below are based on the
TanStack Router SSR and query integration guides pulled via Context7.

The data examples below assume the matching Hono API routes live in
`src/routes/-api.ts` and are consumed through the existing RPC client in
`src/lib/api.ts`.

## 1. Switch The Server Entry To Streaming

The current server entry uses `renderRouterToString`:

```tsx
import {
  createRequestHandler,
  RouterServer,
  renderRouterToString,
} from '@tanstack/react-router/ssr/server'

return handler(({ responseHeaders, router }) => {
  return renderRouterToString({
    responseHeaders,
    router,
    children: <RouterServer router={router} />,
  })
})
```

To enable streaming, switch to `renderRouterToStream`:

```tsx
import {
  createRequestHandler,
  RouterServer,
  renderRouterToStream,
} from '@tanstack/react-router/ssr/server'

return handler(({ request, responseHeaders, router }) => {
  return renderRouterToStream({
    request,
    responseHeaders,
    router,
    children: <RouterServer router={router} />,
  })
})
```

TanStack Router also exposes `defaultStreamHandler` if you do not need a custom
`RouterServer` wrapper:

```tsx
import {
  createRequestHandler,
  defaultStreamHandler,
} from '@tanstack/react-router/ssr/server'
import { createRouter } from './router'

export async function render({ request }: { request: Request }) {
  const handler = createRequestHandler({
    request,
    createRouter,
  })

  return await handler(defaultStreamHandler)
}
```

## 2. Use Deferred Loader Data With `Await`

Streaming becomes most useful when a route has some critical data that should block
the initial shell and some slower data that should not.

```tsx
import type { InferResponseType } from 'hono/client'
import { Await, createFileRoute, defer } from '@tanstack/react-router'
import { api } from '../lib/api'

const getPostRoute = api.posts[':postId'].$get
const getCommentsRoute = api.posts[':postId'].comments.$get

type Post = InferResponseType<typeof getPostRoute>
type Comments = InferResponseType<typeof getCommentsRoute>

async function getPost(postId: string): Promise<Post> {
  const response = await api.posts[':postId'].$get({
    param: { postId },
  })

  if (!response.ok) {
    throw new Error('Failed to load post')
  }

  return response.json()
}

async function getComments(postId: string): Promise<Comments> {
  const response = await api.posts[':postId'].comments.$get({
    param: { postId },
  })

  if (!response.ok) {
    throw new Error('Failed to load comments')
  }

  return response.json()
}

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await getPost(params.postId)
    const commentsPromise = getComments(params.postId)

    return {
      post,
      deferredComments: defer(commentsPromise),
    }
  },
  component: PostPage,
})

function PostPage() {
  const { post, deferredComments } = Route.useLoaderData()

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.body}</p>

      <Await
        promise={deferredComments}
        fallback={<p>Loading comments...</p>}
      >
        {(comments) => (
          <ul>
            {comments.map((comment: { id: string; body: string }) => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        )}
      </Await>
    </main>
  )
}
```

Notes:

- The fast data is awaited in the loader.
- The slow data is left unresolved and streamed later.
- `Await` renders a fallback first, then swaps in the resolved value.

## 3. Use `Suspense` For Route Or Component Boundaries

`Await` covers the common deferred-loader case, but React `Suspense` is still useful
for component boundaries and suspenseful hooks such as `useSuspenseQuery`.

If the route itself may suspend, add `wrapInSuspense: true` and provide a route-level
`pendingComponent`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  wrapInSuspense: true,
  pendingComponent: DashboardSkeleton,
  component: DashboardPage,
})

function DashboardSkeleton() {
  return <p>Loading dashboard...</p>
}
```

Inside the route, use `Suspense` to isolate slower sections so the rest of the page
can render immediately:

```tsx
import { Suspense } from 'react'

function DashboardPage() {
  return (
    <main>
      <Hero />

      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarActivity />
      </Suspense>
    </main>
  )
}

function SidebarSkeleton() {
  return <p>Loading activity...</p>
}
```

## 4. Enable SSR Query Streaming

If the app uses TanStack Query, TanStack Router's recommended SSR integration is
`@tanstack/react-router-ssr-query`.

Once this is enabled, `setupRouterSsrQueryIntegration(...)` wraps the app with a
`QueryClientProvider` by default and streams queries that resolve during SSR.

Install it with Vite+:

```bash
vp add @tanstack/react-router-ssr-query
```

Update the router context to include a `QueryClient`:

```ts
import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  head: string
  appCssHrefs: string[]
  queryClient: QueryClient
}
```

Then wire the integration in `src/router.tsx`:

```tsx
import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

export function createRouter(options: {
  head?: string
  appCssHrefs?: string[]
}) {
  const queryClient = new QueryClient()

  const router = createTanstackRouter({
    routeTree,
    context: {
      head: options.head ?? '',
      appCssHrefs: options.appCssHrefs ?? [],
      queryClient,
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
```

Create the `QueryClient` inside `createRouter()` so SSR gets a fresh client per
request instead of sharing cache state across users.

Then preload critical data in the route loader and read it with
`useSuspenseQuery`. Reuse the same Hono-backed query options in both places:

```tsx
import type { InferResponseType } from 'hono/client'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { api } from '../lib/api'

const getPostsRoute = api.posts.$get
type Posts = InferResponseType<typeof getPostsRoute>

async function getPosts(): Promise<Posts> {
  const response = await api.posts.$get()

  if (!response.ok) {
    throw new Error('Failed to load posts')
  }

  return response.json()
}

const postsQuery = queryOptions({
  queryKey: ['posts'],
  queryFn: getPosts,
})

export const Route = createFileRoute('/posts')({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  wrapInSuspense: true,
  pendingComponent: PostsSkeleton,
  component: PostsPage,
})

function PostsSkeleton() {
  return <p>Loading posts...</p>
}

function PostsPage() {
  const { data: posts } = useSuspenseQuery(postsQuery)

  return (
    <ul>
      {posts.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

The same query options also work in smaller components that render after
hydration, so you do not need a separate fetch path for client-side updates:

```tsx
import { useQuery } from '@tanstack/react-query'
import { postsQuery } from '../lib/queries/posts'

function PostsSidebar() {
  const { data: posts, isPending } = useQuery(postsQuery)

  if (isPending) return <p>Loading posts...</p>

  return <p>{posts.length} posts cached</p>
}
```

What this integration gives you:

- Automatic server dehydration and client hydration
- Query results streamed when they resolve during SSR
- Redirect handling for query-driven route loaders
- One shared Hono RPC query definition for loaders and components

## 5. Practical Guidance For This Repo

Keep non-streaming SSR if:

- Routes mostly render static content
- Loaders are fast and fully awaited
- You want the simplest SSR behavior in the template

Enable streaming if:

- Routes use `defer(...)` for non-critical data
- Pages have meaningful `Suspense` boundaries
- You add TanStack Query and want SSR query streaming

## 6. Files You Would Change Here

For this repo, the main files involved are:

- `src/entry-server.tsx`: switch from `renderRouterToString` to streaming
- `src/router.tsx`: add `setupRouterSsrQueryIntegration` if using TanStack Query
- `src/types/router.ts`: add `queryClient` to the router context
- `src/lib/api.ts`: shared Hono RPC client used by loaders and queries
- `src/lib/queries/*`: optional home for shared TanStack Query option builders
- `src/routes/*`: add `defer(...)`, `Await`, `Suspense`, and `pendingComponent` where needed
