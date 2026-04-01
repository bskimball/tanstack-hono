---
name: tanstack-router
description: Type-safe routing for React and Solid applications with first-class search params, data loading, and seamless integration with the React ecosystem.
---


## Overview

TanStack Router is a fully type-safe router for React (and Solid) applications. It provides file-based routing, first-class search parameter management, built-in data loading, code splitting, and deep TypeScript integration. It serves as the routing foundation for TanStack Start (the full-stack framework).

**Package:** `@tanstack/react-router`
**CLI:** `@tanstack/router-cli` or `@tanstack/router-plugin` (Vite/Rspack/Webpack)
**Devtools:** `@tanstack/react-router-devtools`

## Installation

```bash
npm install @tanstack/react-router
# For file-based routing with Vite:
npm install -D @tanstack/router-plugin
# Or standalone CLI:
npm install -D @tanstack/router-cli
```

## Core Concepts

### Route Trees

Routes are organized in a tree structure. The root route is the top-level layout, and child routes nest underneath.

```tsx
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])
const router = createRouter({ routeTree })
```

### File-Based Routing

File-based routing automatically generates the route tree from your file structure. Configure with Vite plugin:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    // ... other plugins
  ],
})
```

#### File Naming Conventions

| File Pattern | Route Type | Example Path |
|---|---|---|
| `__root.tsx` | Root layout | N/A (wraps all) |
| `index.tsx` | Index route | `/` |
| `about.tsx` | Static route | `/about` |
| `$postId.tsx` | Dynamic param | `/posts/$postId` |
| `posts.tsx` | Layout route | `/posts/*` (layout) |
| `posts/index.tsx` | Nested index | `/posts` |
| `posts/$postId.tsx` | Nested dynamic | `/posts/123` |
| `posts_.$postId.tsx` | Pathless layout | `/posts/123` (different layout) |
| `_layout.tsx` | Pathless layout | N/A (groups routes) |
| `_layout/dashboard.tsx` | Grouped route | `/dashboard` |
| `$.tsx` | Splat/catch-all | `/*` |
| `posts.$postId.edit.tsx` | Dot notation | `/posts/123/edit` |

#### Special Prefixes
- `_` prefix: Pathless routes (layout groups without URL segment)
- `$` prefix: Dynamic path parameters
- `(folder)` parentheses: Route groups (organizational, no URL impact)

### Route Configuration

Each route can define:

```tsx
// routes/posts.$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  // Validation for path params
  params: {
    parse: (params) => ({ postId: Number(params.postId) }),
    stringify: (params) => ({ postId: String(params.postId) }),
  },

  // Search params validation
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page ?? 1),
      filter: (search.filter as string) || '',
    }
  },

  // Data loading
  loader: async ({ params, context, abortController }) => {
    return fetchPost(params.postId)
  },

  // Loader dependencies (re-run loader when these change)
  loaderDeps: ({ search }) => ({ page: search.page }),

  // Stale time for cached loader data
  staleTime: 5_000,

  // Preloading
  preloadStaleTime: 30_000,

  // Error component
  errorComponent: PostErrorComponent,

  // Pending/loading component
  pendingComponent: PostLoadingComponent,

  // 404 component
  notFoundComponent: PostNotFoundComponent,

  // Before load hook (authentication, redirects)
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },

  // Head/meta management
  head: () => ({
    meta: [{ title: 'Post Details' }],
  }),

  // Component
  component: PostComponent,
})

function PostComponent() {
  const { postId } = Route.useParams()
  const post = Route.useLoaderData()
  const { page, filter } = Route.useSearch()

  return <div>{post.title}</div>
}
```

## Data Loading

### Route Loaders

```tsx
export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    // Access router context (e.g., queryClient)
    const posts = await context.queryClient.ensureQueryData({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    })
    return { posts }
  },
  component: PostsComponent,
})

function PostsComponent() {
  const { posts } = Route.useLoaderData()
  // ...
}
```

### Loader Dependencies

Control when loaders re-execute:

```tsx
export const Route = createFileRoute('/posts')({
  loaderDeps: ({ search: { page, filter } }) => ({ page, filter }),
  loader: async ({ deps: { page, filter } }) => {
    return fetchPosts({ page, filter })
  },
})
```

### Deferred Data Loading

Stream non-critical data:

```tsx
import { Await, defer } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const criticalData = await fetchCriticalData()
    const deferredData = defer(fetchSlowData())
    return { criticalData, deferredData }
  },
  component: DashboardComponent,
})

function DashboardComponent() {
  const { criticalData, deferredData } = Route.useLoaderData()

  return (
    <div>
      <CriticalSection data={criticalData} />
      <Suspense fallback={<Loading />}>
        <Await promise={deferredData}>
          {(data) => <SlowSection data={data} />}
        </Await>
      </Suspense>
    </div>
  )
}
```

### Context-Based Data Loading

Provide shared dependencies via router context:

```tsx
// Create router with context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!, // Will be provided by RouterProvider
  },
})

// In root/app component
function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

// In routes
export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(userQueryOptions())
  },
})
```

## Search Parameters

### Validation

```tsx
import { z } from 'zod'

const postSearchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().default(''),
  sort: z.enum(['date', 'title']).default('date'),
})

export const Route = createFileRoute('/posts')({
  validateSearch: postSearchSchema,
  // Or manual validation:
  // validateSearch: (search) => postSearchSchema.parse(search),
})
```

### Reading Search Params

```tsx
function PostsComponent() {
  // From route
  const { page, filter, sort } = Route.useSearch()

  // Or from any component with useSearch hook
  const search = useSearch({ from: '/posts' })
}
```

### Updating Search Params

```tsx
import { useNavigate } from '@tanstack/react-router'

function Pagination() {
  const navigate = useNavigate()
  const { page } = Route.useSearch()

  return (
    <button
      onClick={() =>
        navigate({
          search: (prev) => ({ ...prev, page: prev.page + 1 }),
        })
      }
    >
      Next Page
    </button>
  )
}

// Or via Link component
<Link
  to="/posts"
  search={(prev) => ({ ...prev, page: 2 })}
>
  Page 2
</Link>
```

### Search Param Options

```tsx
const router = createRouter({
  routeTree,
  // Custom serialization
  search: {
    strict: true, // Reject unknown params
  },
  // Default search param serializer
  stringifySearch: defaultStringifySearch,
  parseSearch: defaultParseSearch,
})
```

## Navigation

### Link Component

```tsx
import { Link } from '@tanstack/react-router'

// Static route
<Link to="/about">About</Link>

// Dynamic route with params
<Link to="/posts/$postId" params={{ postId: '123' }}>
  Post 123
</Link>

// With search params
<Link to="/posts" search={{ page: 2, filter: 'react' }}>
  Page 2
</Link>

// Active link styling
<Link
  to="/posts"
  activeProps={{ className: 'active' }}
  inactiveProps={{ className: 'inactive' }}
  activeOptions={{ exact: true }}
>
  Posts
</Link>

// Preloading
<Link to="/posts" preload="intent">Posts</Link>
<Link to="/dashboard" preload="viewport">Dashboard</Link>

// Hash
<Link to="/docs" hash="api-reference">API Reference</Link>
```

### Programmatic Navigation

```tsx
import { useNavigate, useRouter } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()
  const router = useRouter()

  // Navigate to a route
  navigate({ to: '/posts', search: { page: 1 } })

  // Navigate with replace
  navigate({ to: '/posts', replace: true })

  // Relative navigation
  navigate({ to: '.', search: (prev) => ({ ...prev, page: 2 }) })

  // Go back/forward
  router.history.back()
  router.history.forward()

  // Invalidate and reload current route
  router.invalidate()
}
```

### Redirects

```tsx
import { redirect } from '@tanstack/react-router'

// In beforeLoad or loader
throw redirect({
  to: '/login',
  search: { redirect: location.href },
  // Optional status code
  statusCode: 301, // Permanent redirect (SSR)
})
```

### Navigation Blocking

```tsx
import { useBlocker } from '@tanstack/react-router'

function FormComponent() {
  const [isDirty, setIsDirty] = useState(false)

  useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true, // Shows confirm dialog
  })

  // Or with custom UI
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty,
  })

  if (status === 'blocked') {
    return (
      <div>
        <p>Are you sure you want to leave?</p>
        <button onClick={proceed}>Leave</button>
        <button onClick={reset}>Stay</button>
      </div>
    )
  }
}
```

## Code Splitting

### Automatic (File-Based Routing)

With file-based routing, create a lazy file:

```
routes/
  posts.tsx          # Critical: loader, beforeLoad, meta
  posts.lazy.tsx     # Lazy: component, pendingComponent, errorComponent
```

```tsx
// posts.tsx (loaded eagerly)
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
})

// posts.lazy.tsx (loaded lazily)
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/posts')({
  component: PostsComponent,
  pendingComponent: PostsLoading,
  errorComponent: PostsError,
})
```

### Manual Code Splitting

```tsx
const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts',
  loader: () => fetchPosts(),
}).lazy(() => import('./posts.lazy').then((d) => d.Route))
```

## Preloading

```tsx
// Router-level defaults
const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // 'intent' | 'viewport' | 'render' | false
  defaultPreloadStaleTime: 30_000, // 30 seconds
})

// Route-level
export const Route = createFileRoute('/posts/$postId')({
  // Stale time for the loader data
  staleTime: 5_000,
  // How long preloaded data stays fresh
  preloadStaleTime: 30_000,
})

// Link-level
<Link to="/posts" preload="intent" preloadDelay={100}>
  Posts
</Link>
```

## Type Safety

### Register Router Type

```tsx
// Declare module for type inference
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

### Type-Safe Hooks

All hooks are fully typed based on the route tree:

```tsx
// useParams - typed to route's params
const { postId } = useParams({ from: '/posts/$postId' })

// useSearch - typed to route's search schema
const { page } = useSearch({ from: '/posts' })

// useLoaderData - typed to loader return
const data = useLoaderData({ from: '/posts/$postId' })

// useRouteContext - typed to route context
const { auth } = useRouteContext({ from: '/protected' })
```

### Route Generics

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  // TypeScript infers:
  // params: { postId: string }
  // search: validated search schema type
  // loaderData: return type of loader
  // context: router context type
})
```

## Authenticated Routes

```tsx
// __root.tsx
export const Route = createRootRouteWithContext<{
  auth: AuthContext
}>()({
  component: RootComponent,
})

// _authenticated.tsx (pathless layout for auth)
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
})

// _authenticated/dashboard.tsx
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard, // Only accessible when authenticated
})
```

## Scroll Restoration

```tsx
const router = createRouter({
  routeTree,
  // Enable scroll restoration
  defaultScrollRestoration: true,
})

// Or per-route
export const Route = createFileRoute('/posts')({
  // Scroll to top on navigation
  scrollRestoration: true,
})

// Custom scroll restoration key
<ScrollRestoration
  getKey={(location) => location.pathname}
/>
```

## Route Masking

Display a different URL than the actual route:

```tsx
<Link
  to="/photos/$photoId"
  params={{ photoId: photo.id }}
  mask={{ to: '/photos', search: { photoId: photo.id } }}
>
  View Photo
</Link>

// Or programmatically
navigate({
  to: '/photos/$photoId',
  params: { photoId: photo.id },
  mask: { to: '/photos', search: { photoId: photo.id } },
})
```

## Not Found Handling

```tsx
// Global 404
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <div>Page not found</div>,
})

// Route-level 404
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    if (!post) throw notFound()
    return post
  },
  notFoundComponent: () => <div>Post not found</div>,
})
```

## Head Management

```tsx
export const Route = createFileRoute('/posts/$postId')({
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData.title },
      { name: 'description', content: loaderData.excerpt },
      { property: 'og:title', content: loaderData.title },
    ],
    links: [
      { rel: 'canonical', href: `https://example.com/posts/${loaderData.id}` },
    ],
  }),
})
```

## Integration with TanStack Query

```tsx
import { queryOptions } from '@tanstack/react-query'

const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

export const Route = createFileRoute('/posts')({
  loader: ({ context: { queryClient } }) => {
    // Ensure data is in cache, won't refetch if fresh
    return queryClient.ensureQueryData(postsQueryOptions)
  },
  component: PostsComponent,
})

function PostsComponent() {
  // Use the same query options for reactive updates
  const { data: posts } = useSuspenseQuery(postsQueryOptions)
  return <PostsList posts={posts} />
}
```

## Router Hooks Reference

| Hook | Purpose |
|------|---------|
| `useRouter()` | Access router instance |
| `useRouterState()` | Subscribe to router state |
| `useParams()` | Get route path params |
| `useSearch()` | Get validated search params |
| `useLoaderData()` | Get route loader data |
| `useRouteContext()` | Get route context |
| `useNavigate()` | Get navigate function |
| `useLocation()` | Get current location |
| `useMatches()` | Get all matched routes |
| `useMatch()` | Get specific route match |
| `useBlocker()` | Block navigation |
| `useLinkProps()` | Get link props for custom components |
| `useMatchRoute()` | Check if a route matches |

## Best Practices

1. **Use file-based routing** for most applications - it's simpler and auto-generates the route tree
2. **Validate search params** with Zod or custom validators for type safety
3. **Use `loaderDeps`** to control when loaders re-execute based on search param changes
4. **Leverage context** for dependency injection (QueryClient, auth state)
5. **Use `beforeLoad`** for authentication guards, not in components
6. **Separate critical vs lazy code** - keep loaders in the main file, components in `.lazy.tsx`
7. **Use `preload="intent"`** on Links for perceived performance
8. **Use `staleTime`** to prevent unnecessary refetches during navigation
9. **Register the router type** for full TypeScript inference across the app
10. **Use `notFound()`** instead of conditional rendering for 404 states
11. **Colocate search param logic** with routes that own them
12. **Use pathless layouts** (`_authenticated`) for shared auth/layout logic without URL segments

## Common Pitfalls

- Forgetting to register the router type (`declare module`)
- Not using `loaderDeps` when loader depends on search params (causes stale data)
- Putting auth checks in components instead of `beforeLoad` (flash of protected content)
- Not handling the loading state with `pendingComponent`
- Using `useEffect` for data fetching instead of route loaders
- Mutating search params directly instead of using navigate/Link
- Not wrapping the app with `RouterProvider`
- Forgetting `getParentRoute` in code-based route definitions
