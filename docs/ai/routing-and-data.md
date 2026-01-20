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

Routes can load data using a `loader`:

```tsx
export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await fetch('/api/users').then((r) => r.json())
    return { users }
  },
  component: UsersPage,
})
```

If loader failures should be user-visible, prefer route-level error boundaries.
