# TanStack Router + Hono SSR

A modern full-stack React application combining **TanStack Router** with **Hono** for server-side rendering. This setup delivers fast, SEO-friendly applications with excellent developer experience.

## 🏃‍♂️ Quick Start

Get started with this template using degit:

```bash
# Clone the template
npx degit bskimball/tanstack-hono my-app

# Navigate to your project
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app running!

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

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run test   # Run tests
npm run check  # Lint and format code
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

### 🔗 Navigation

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>
```

### 📊 Data Loading

```tsx
export const Route = createFileRoute("/users")({
  loader: async () => {
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

## 🚀 Deployment

```bash
npm run build
npm start
```

**Deploy to:**
- Vercel, Netlify (Serverless)
- Railway, Render (Containers) 
- Cloudflare Workers (Edge)
- VPS with PM2 + Nginx

## 📚 Learn More

- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Hono](https://hono.dev) - Ultrafast web framework
- [SSR Guide](https://tanstack.com/router/latest/docs/framework/react/guide/ssr) - TanStack Router SSR
- [Vite SSR](https://vitejs.dev/guide/ssr.html) - Vite server-side rendering
