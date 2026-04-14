# TanStack Router + Hono SSR Template

A modern, production-ready full-stack React application template combining **TanStack Router** with **Hono** for server-side rendering. This setup delivers fast, SEO-friendly applications with excellent developer experience.

[![CI](https://github.com/bskimball/tanstack-hono/actions/workflows/ci.yml/badge.svg)](https://github.com/bskimball/tanstack-hono/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AI Ready](https://img.shields.io/badge/AI-Ready-8b5cf6)](#-ai-friendly)

> AI Ready: this repo includes checked-in framework-specific docs in `docs/ai/`
> and repo-local skills in `.agents/skills/` so an LLM can follow the project's
> actual patterns when helping build the app.

## 🏃‍♂️ Quick Start

### Option 1: Using the Setup Script (Recommended)

```bash
# Clone the template
npx degit bskimball/tanstack-hono my-app

# Navigate to your project
cd my-app

# Run the interactive setup script
bash scripts/setup.sh
```

The setup script will:

- Update project name in package.json
- Create .env file from .env.example
- Install dependencies (optional)
- Initialize git repository (optional)

### Option 2: Manual Setup

```bash
# Clone the template
npx degit bskimball/tanstack-hono my-app

# Navigate to your project
cd my-app

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app running!

**Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## 🚀 Features

- **🗺 TanStack Router**: Type-safe, file-based routing with powerful data loading
- **⚡ Hono SSR**: Ultra-fast server-side rendering with minimal overhead
- **🔥 Vite+**: Lightning-fast development with Hot Module Replacement, powered by Rolldown
- **📘 TypeScript**: Full type safety across client and server, checked by tsgo/tsgolint
- **🎨 Tailwind CSS v4**: Modern utility-first CSS framework
- **🧹 Oxlint & Oxfmt**: Fast linting and formatting via Vite+ (replaces ESLint & Prettier)
- **🧪 Vitest**: Fast unit testing with great DX

## 📁 Architecture

```
src/
├── components/
│   ├── Header.tsx            # Site header component
│   └── HeroSection.tsx       # Landing page hero
├── hooks/
│   └── useDebounce.ts        # Reusable debounce hook
├── lib/
│   └── api.ts                # Shared Hono RPC client
├── routes/                   # File-based routing (TanStack Router)
│   ├── __root.tsx            # Root layout component
│   ├── index.tsx             # Home page route
│   ├── about.tsx             # About page route
│   ├── error.tsx             # Error boundary route
│   ├── -api.ts               # Server-only API route helpers
│   └── -test.ts              # Test route utilities (ignored by router)
├── tests/
│   ├── Header.test.tsx
│   ├── HeroSection.test.tsx
│   └── root-route.test.tsx
├── entry-client.tsx          # Client-side hydration entry
├── entry-server.tsx          # Hono server with SSR setup
├── router.tsx                # Router configuration
├── routeTree.gen.ts          # Auto-generated route tree (do not edit)
├── reportWebVitals.ts        # Web Vitals reporting
└── styles.css                # Global styles
```

## 🛠 Development

```bash
vp dev          # Start development server
vp run build    # Build for production (client + server)
vp test         # Run tests
vp check        # Lint, format, and type-check
vp check --fix  # Auto-fix lint and formatting issues
npm start       # Start production server (after build)
```

## 🔄 SSR Flow

1. **Request**: Browser requests a URL
2. **Server**: Hono matches route and runs TanStack Router SSR
3. **Render**: React components render to an HTML string by default
4. **Response**: Full HTML sent to browser with embedded data
5. **Hydration**: Client-side React takes over for SPA navigation

## 🌊 Optional Streaming SSR

This template ships with non-streaming SSR by default via `renderRouterToString` in
`src/entry-server.tsx`.

That keeps the default setup simple, but TanStack Router also supports streaming SSR
when you want to flush the initial shell early and stream deferred data or suspenseful
query work as it resolves.

See `docs/ai/streaming.md` for:

- When to keep non-streaming SSR
- How to switch `src/entry-server.tsx` to streaming
- How to use the existing Hono RPC client in deferred loaders and queries
- A `defer(...)` + `Await` example
- A `Suspense` example
- An SSR query streaming example using `@tanstack/react-router-ssr-query`

## 🗺 File-Based Routing

Routes are automatically generated from files in `src/routes/`:

```tsx
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return <div>About us!</div>;
}
```

### 🔗 Navigation

```tsx
import { Link } from "@tanstack/react-router";

function Navigation() {
  return <Link to="/about">About</Link>;
}
```

### 📊 Data Loading

```tsx
import type { InferResponseType } from "hono/client";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api";

const getHealthRoute = api.health.$get;
type Health = InferResponseType<typeof getHealthRoute>;

async function getHealth(): Promise<Health> {
  const response = await api.health.$get();

  if (!response.ok) {
    throw new Error("Failed to load health check");
  }

  return response.json();
}

export const Route = createFileRoute("/status")({
  loader: async () => {
    return {
      health: await getHealth(),
    };
  },
  component: StatusPage,
});

function StatusPage() {
  const { health } = Route.useLoaderData();

  return <pre>{JSON.stringify(health, null, 2)}</pre>;
}
```

For client-side data, you can reuse the same Hono-backed helpers with TanStack
Query instead of maintaining a separate fetch path:

```tsx
import { queryOptions, useQuery } from "@tanstack/react-query";

export const healthQuery = queryOptions({
  queryKey: ["health"],
  queryFn: getHealth,
  staleTime: 30_000,
});

function HealthBadge() {
  const { data, isPending } = useQuery(healthQuery);

  if (isPending) return <p>Checking API...</p>;

  return <p>API status: {data.status}</p>;
}
```

See `docs/ai/routing-and-data.md` and `docs/ai/server-api.md` for the full Hono
RPC patterns used in this template.

## 🏠 Layouts with SSR

The root layout (`src/routes/__root.tsx`) wraps all pages:

```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

## ⚡ Performance Benefits

**SSR Advantages:**

- **SEO**: Fully rendered HTML for search engines
- **LCP**: Faster Largest Contentful Paint
- **Progressive Enhancement**: Works without JavaScript
- **Social Sharing**: Rich preview cards with meta tags

**Hono Benefits:**

- **Small Bundle**: Minimal server overhead
- **Edge Ready**: Deploy to Cloudflare Workers, etc.
- **Fast Startup**: Quick cold start times

## 🐳 Docker Support

### Using Docker

```bash
# Build and run production
docker-compose up app

# Development with hot reload
docker-compose --profile dev up dev
```

### Building the Image

```bash
docker build -t tanstack-hono .
docker run -p 3000:3000 tanstack-hono
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to:

- **Docker**: Use included Dockerfile and docker-compose.yml
- **Vercel/Netlify**: Serverless functions
- **Railway/Render**: Container deployments
- **Cloudflare Workers**: Edge runtime
- **VPS**: With PM2 + Nginx

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed deployment strategies.

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - Guide for AI agents working with this codebase
- **[CLAUDE.md](CLAUDE.md)** - Claude-specific context and patterns
- **[docs/ai/README.md](docs/ai/README.md)** - Index of framework-specific working docs for this repo
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deep dive into system design
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[docs/ai/streaming.md](docs/ai/streaming.md)** - How to enable TanStack Router streaming SSR

## 🤖 AI-Friendly

This template includes checked-in guidance for LLMs and coding agents, so they
have repo-specific context for building features instead of relying only on
generic framework knowledge.

- `.cursorrules` for Cursor IDE
- `AGENTS.md` for general AI agent guidelines
- `CLAUDE.md` for Claude-specific context
- `docs/ai/` for task-focused docs covering commands, architecture, routing, Hono APIs, styling, testing, deployment, and streaming SSR
- `.agents/skills/` for repo-local skills covering Hono, TanStack Router, TanStack Query, Vite, Vite+, Vitest, and React research

An LLM that reads those files should have the project-specific instructions it
needs to help implement and maintain the app effectively.

## 📖 Learn More

- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Hono](https://hono.dev) - Ultrafast web framework
- [SSR Guide](https://tanstack.com/router/latest/docs/framework/react/guide/ssr) - TanStack Router SSR
- [Vite SSR](https://vitejs.dev/guide/ssr.html) - Vite server-side rendering

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
