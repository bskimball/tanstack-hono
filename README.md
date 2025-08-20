# TanStack Router + Hono SSR

A modern full-stack React application combining **TanStack Router** with **Hono** for server-side rendering. This setup delivers fast, SEO-friendly applications with excellent developer experience.

## 🚀 Features

- **🗺 TanStack Router**: Type-safe, file-based routing with powerful data loading
- **⚡ Hono SSR**: Ultra-fast server-side rendering with minimal overhead
- **🔥 Vite**: Lightning-fast development with Hot Module Replacement
- **📘 TypeScript**: Full type safety across client and server
- **🎨 Tailwind CSS**: Modern utility-first CSS framework
- **🧹 Biome**: Fast linting, formatting, and code quality
- **🧪 Vitest**: Fast unit testing with great DX

## 📁 Architecture

```
src/
├── components/
│   ├── Document.tsx          # SSR document shell with Vite asset management
│   └── Header.tsx            # Reusable UI components
├── routes/                   # File-based routing (auto-generated)
│   ├── __root.tsx            # Root layout component
│   ├── index.tsx             # Home page route
│   ├── about.tsx             # About page route
│   └── -test.ts              # Test route utilities
├── entry-client.tsx          # Client-side hydration entry
├── entry-server.tsx          # Hono server with SSR setup
├── router.tsx                # Router configuration
└── styles.css                # Global styles
```

## 🛠 Development

Start the development server:

```bash
npm install
npm run dev
```

This starts:

- **Hono server** with SSR at `http://localhost:3000`
- **Vite dev server** with HMR for instant updates
- **TanStack Router** with file-based routing

## 🏗 Production Build

Build and run for production:

```bash
# Build client and server bundles
npm run build

# Start production server
npm start
```

The build creates:

- **Client bundle**: Optimized assets with Vite manifest
- **Server bundle**: Hono server with embedded SSR

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 🎨 Styling & Code Quality

**Tailwind CSS** for styling:

```bash
# Styles are processed through Vite with Tailwind
```

**Biome** for code quality:

```bash
npm run lint      # Check for issues
npm run format    # Format code
npm run check     # Lint + format
```

## 🔄 SSR Flow

1. **Request**: Browser requests a URL
2. **Server**: Hono matches route and runs TanStack Router SSR
3. **Render**: React components render to HTML string
4. **Response**: Full HTML sent to browser with embedded data
5. **Hydration**: Client-side React takes over for SPA navigation

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

### 🔗 Navigation with SSR

Links work seamlessly between server and client:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>; // Works with SSR + client routing
```

### 📊 Data Loading

Loaders run on the server and hydrate on the client:

```tsx
export const Route = createFileRoute("/users")({
  loader: async () => {
    // Runs on server during SSR, then on client for navigation
    const users = await fetch("/api/users").then((r) => r.json());
    return { users };
  },
  component: UsersPage,
});

function UsersPage() {
  const { users } = Route.useLoaderData();
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

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
        <Outlet /> {/* Child routes render here */}
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

## 🚀 Deployment

Deploy to any Node.js hosting platform:

```bash
npm run build
NODE_ENV=production node dist/server.js
```

**Popular platforms:**

- **Vercel/Netlify**: Serverless functions
- **Railway/Render**: Container deployment
- **Cloudflare Workers**: Edge deployment with Hono
- **Traditional VPS**: PM2 + Nginx

## 📚 Learn More

- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Hono](https://hono.dev) - Ultrafast web framework
- [SSR Guide](https://tanstack.com/router/latest/docs/framework/react/guide/ssr) - TanStack Router SSR
- [Vite SSR](https://vitejs.dev/guide/ssr.html) - Vite server-side rendering
