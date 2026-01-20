# Architecture Documentation

This document provides a deep dive into the architecture and design decisions of this TanStack Router + Hono SSR template.

## Overview

This is a full-stack TypeScript application combining React for the UI, TanStack Router for routing with SSR support, and Hono as the web framework. The architecture is designed for:

- **Performance**: Fast SSR with minimal server overhead
- **Developer Experience**: Type-safe routing, file-based conventions, fast HMR
- **Scalability**: Easy to extend with APIs, middleware, and features
- **Deployment Flexibility**: Can run on serverless, containers, or edge runtimes

## Technology Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **TanStack Router**: Type-safe, file-based routing with data loading
- **Tailwind CSS v4**: Utility-first styling
- **Vite**: Build tool and dev server

### Backend
- **Hono**: Lightweight web framework (~12KB)
- **@hono/node-server**: Node.js adapter for Hono
- **Node.js**: Runtime environment

### Tooling
- **TypeScript**: Type safety across the stack
- **ESLint & Prettier**: Industry standard linting and formatting
- **Vitest**: Unit testing framework

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React App (Hydrated)                              │     │
│  │  - TanStack Router (Client-side navigation)        │     │
│  │  - React Components                                │     │
│  │  - Tailwind CSS                                    │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      Hono Server                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Middleware Stack                                  │     │
│  │  - Logger                                          │     │
│  │  - CORS                                            │     │
│  │  - Compression (Production)                        │     │
│  │  - Static File Serving (Production)                │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API Routes (Optional)                             │     │
│  │  - /api/*                                          │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  SSR Handler                                       │     │
│  │  - TanStack Router SSR                             │     │
│  │  - React Rendering                                 │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### SSR Request Flow (Production)

1. **Client Request**: Browser requests `/about`
2. **Server Receives**: Hono server matches the request
3. **Route Matching**: TanStack Router matches `/about` route
4. **Data Loading**: Route loader functions execute (if defined)
5. **React Rendering**: Components render to HTML string
6. **HTML Response**: Server sends complete HTML with embedded data
7. **Client Hydration**: Browser downloads JS, React hydrates
8. **SPA Navigation**: Subsequent navigation happens client-side

### Development Request Flow

In development, Vite dev server handles:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- On-demand compilation
- Source maps

The `@hono/vite-dev-server` plugin integrates Hono with Vite's dev server.

## Directory Structure

```
tanstack-hono/
├── src/
│   ├── routes/              # File-based routes (auto-discovered)
│   │   ├── __root.tsx       # Root layout (wraps all routes)
│   │   ├── index.tsx        # Home page (/)
│   │   ├── about.tsx        # About page (/about)
│   │   ├── error.tsx        # Error page
│   │   └── -test.ts         # Non-route utility (- prefix excludes)
│   ├── components/          # Reusable React components
│   │   └── Header.tsx       # Example component
│   ├── entry-client.tsx     # Client-side hydration entry point
│   ├── entry-server.tsx     # Hono server + SSR setup
│   ├── router.tsx           # Router configuration
│   ├── routerContext.tsx    # Router context type definitions
│   ├── routeTree.gen.ts     # AUTO-GENERATED route tree
│   └── styles.css           # Global styles + Tailwind
├── dist/                    # Build output
│   ├── client/              # Client bundle (browser)
│   │   └── static/          # JS, CSS, and other assets
│   └── server/              # Server bundle (Node.js)
│       └── index.js         # Server entry point
├── public/                  # Static assets (if needed)
├── .github/workflows/       # CI/CD pipelines
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
├── .prettierrc              # Prettier configuration
└── package.json             # Dependencies and scripts
```

## Core Components

### 1. Entry Points

#### Client Entry (`src/entry-client.tsx`)
- Hydrates React app in the browser
- Sets up TanStack Router client-side
- Runs only in the browser

```tsx
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-router'
import { createRouter } from './router'

const router = createRouter()
hydrateRoot(document.getElementById('root')!, <StartClient router={router} />)
```

#### Server Entry (`src/entry-server.tsx`)
- Hono server setup
- Middleware configuration
- SSR rendering logic
- API routes (if any)

### 2. Routing System

#### File-Based Routing
Routes are automatically discovered from `src/routes/`:

```
src/routes/index.tsx       → /
src/routes/about.tsx       → /about
src/routes/blog/index.tsx  → /blog
src/routes/blog/$id.tsx    → /blog/:id (dynamic)
```

#### Route Definition
Each route file exports a `Route` object:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  loader: async () => {
    // Optional: fetch data before rendering
    return { data: await fetchData() }
  },
})

function AboutPage() {
  const { data } = Route.useLoaderData()
  return <div>About</div>
}
```

#### Route Tree Generation
The `@tanstack/router-plugin` Vite plugin watches `src/routes/` and auto-generates `src/routeTree.gen.ts`. This file should never be edited manually.

### 3. Server-Side Rendering

SSR is handled by TanStack Router's `createRequestHandler`:

```tsx
app.use('*', async (c) => {
  const handler = createRequestHandler({
    request: c.req.raw,
    createRouter: () => createRouter(),
  })

  return await handler(({ responseHeaders, router }) => {
    return renderRouterToString({
      responseHeaders,
      router,
      children: <RouterServer router={router} />,
    })
  })
})
```

This:
1. Creates a router instance per request
2. Matches the route
3. Runs loaders
4. Renders React to string
5. Returns HTML

### 4. Build System

#### Two Build Modes

**Client Build** (`npm run build:client`):
- Builds browser bundle
- Output: `dist/client/`
- Includes assets (JS, CSS, images)

**Server Build** (`npm run build:server`):
- Builds Node.js server bundle
- Output: `dist/server/index.js`
- Includes SSR rendering logic

#### Vite Configuration

```typescript
export default defineConfig({
  plugins: [
    TanStackRouterVite(),  // Route generation
    react(),               // React support
    tailwindcss(),         // Tailwind v4
  ],
  build: {
    ssr: true,  // Enable SSR build
    rollupOptions: {
      input: {
        server: 'src/entry-server.tsx',
      },
    },
  },
})
```

## Data Loading

### Route Loaders
Routes can define loaders to fetch data before rendering:

```tsx
export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await fetch('/api/users').then(r => r.json())
    return { users }
  },
  component: UsersPage,
})
```

**Benefits:**
- Data available during SSR
- No loading states on initial render
- Type-safe data access

### Loader Execution
- **Server (SSR)**: Loaders run on the server during initial page load
- **Client (Navigation)**: Loaders run in the browser during client-side navigation

## Styling

### Tailwind CSS v4
- Configured via `@tailwindcss/vite` plugin
- Global styles in `src/styles.css`
- Utility-first approach

```css
/* src/styles.css */
@import "tailwindcss";

/* Custom utilities or components */
@layer components {
  .btn {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
}
```

## Middleware

### Hono Middleware Stack
```tsx
app.use(logger())      // Request logging
app.use(cors())        // CORS headers
app.use(compress())    // Gzip compression (production)
```

### Custom Middleware
Add your own middleware:

```tsx
import { myMiddleware } from './middleware'
app.use(myMiddleware())
```

## API Routes

Add API routes in `src/entry-server.tsx`:

```tsx
app.get('/api/users', async (c) => {
  const users = await db.getUsers()
  return c.json({ users })
})

app.post('/api/users', async (c) => {
  const body = await c.req.json()
  const user = await db.createUser(body)
  return c.json({ user }, 201)
})
```

## Type Safety

### Router Types
TanStack Router generates types for:
- Route paths
- Loader data
- Search params
- Route context

```tsx
// Type-safe navigation
<Link to="/blog/$id" params={{ id: '123' }}>View Post</Link>

// Type-safe data access
const { users } = Route.useLoaderData()  // `users` is typed
```

### Shared Types
Define shared types in separate files:

```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
}
```

## Performance Optimizations

### Production Optimizations
- **Code Splitting**: Vite automatically splits code
- **Tree Shaking**: Unused code is removed
- **Minification**: JS and CSS are minified
- **Compression**: Gzip compression via Hono middleware
- **Static Asset Caching**: Assets served with cache headers

### SSR Benefits
- **Faster FCP**: First Contentful Paint happens sooner
- **Better SEO**: Search engines see fully rendered HTML
- **Progressive Enhancement**: Works without JavaScript
- **Social Sharing**: Rich previews with meta tags

### Potential Bottlenecks
- Large component trees increase SSR time
- Slow API calls in loaders block rendering
- Unoptimized images increase bundle size

### Optimization Strategies
1. **Code Splitting**: Use `React.lazy()` for large components
2. **Data Caching**: Cache API responses
3. **Image Optimization**: Use WebP, responsive images
4. **Bundle Analysis**: Use `npm run build:analyze`

## Deployment Strategies

### 1. Docker (Recommended)
```bash
docker build -t tanstack-hono .
docker run -p 3000:3000 tanstack-hono
```

### 2. Serverless (Vercel, Netlify)
- Deploy as serverless functions
- Automatic scaling
- Edge network distribution

### 3. Containers (Railway, Render)
- Deploy Docker container
- Persistent instances
- Built-in load balancing

### 4. VPS (DigitalOcean, AWS EC2)
- Use PM2 for process management
- Nginx as reverse proxy
- Manual scaling

### 5. Edge (Cloudflare Workers)
- Deploy to edge network
- Ultra-low latency
- Requires Hono edge adapter

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use `VITE_` prefix for client-side vars
- Rotate secrets regularly

### Input Validation
- Validate all user input
- Use a validation library (Zod)
- Sanitize HTML to prevent XSS

### CORS Configuration
```tsx
app.use(cors({
  origin: ['https://example.com'],
  credentials: true,
}))
```

### Rate Limiting
Consider adding rate limiting:
```tsx
import { rateLimiter } from 'hono-rate-limiter'
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }))
```

## Testing Strategy

### Unit Tests
- Test individual components
- Test utility functions
- Use Vitest + Testing Library

### Integration Tests
- Test route loaders
- Test API endpoints
- Test SSR rendering

### E2E Tests (Optional)
- Use Playwright or Cypress
- Test critical user flows

## Extending the Template

### Adding a Database
1. Install database client (e.g., Prisma, Drizzle)
2. Add connection in `entry-server.tsx`
3. Use in route loaders or API routes

### Adding Authentication
1. Choose auth strategy (JWT, session, OAuth)
2. Add auth middleware
3. Protect routes in loader

### Adding State Management
- TanStack Router handles most routing state
- Use React Context for global UI state
- Consider TanStack Query for server state

## Common Patterns

### Protected Routes
```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const user = await getUser()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
})
```

### Error Handling
```tsx
export const Route = createFileRoute('/users')({
  component: UsersPage,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
})
```

### Layout Routes
```tsx
// src/routes/__root.tsx
export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
})
```

## Design Decisions

### Why Hono?
- **Lightweight**: ~12KB, minimal overhead
- **Fast**: Optimized for performance
- **Edge-Ready**: Works on Cloudflare Workers, Deno, Bun
- **Express-like API**: Familiar middleware pattern

### Why TanStack Router?
- **Type Safety**: Full TypeScript support
- **File-Based**: Convention over configuration
- **SSR Support**: First-class SSR support
- **Data Loading**: Built-in loader pattern

### Why Vite?
- **Fast HMR**: Instant feedback during development
- **Modern**: ESM-based, optimized for modern browsers
- **Plugin Ecosystem**: Rich plugin ecosystem

### Why ESLint & Prettier?
- **Standardization**: Most widely used tools in the ecosystem
- **Extensibility**: Massive plugin ecosystem for React and TypeScript
- **Integration**: Best-in-class editor and CI support

## Future Enhancements

Potential additions to consider:
- [ ] Database integration example
- [ ] Authentication example
- [ ] TanStack Query integration
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] E2E testing setup
- [ ] Monitoring and error tracking
- [ ] Advanced caching strategies

## Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [Hono Docs](https://hono.dev)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)

## Questions?

For more information:
- Check [AGENTS.md](AGENTS.md) for AI agent guidelines
- Check [CLAUDE.md](CLAUDE.md) for Claude-specific context
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Review existing code in `src/` for patterns
