# Claude Guidelines

This project is a full-stack React SSR application using TanStack Router and Hono.

## Key Commands
- `npm run dev`: Start development server
- `npm run build`: Build client and server for production
- `npm run start`: Start production server
- `npm run check`: Run lint and format checks
- `npm run format`: Format code with Prettier
- `npm run lint`: Lint code with ESLint
- `npm test`: Run tests with Vitest

## Technical Details
- **Routing**: File-based via `src/routes/`. TanStack Router plugin auto-generates `src/routeTree.gen.ts`.
- **SSR**: Handled in `src/entry-server.tsx` using Hono.
- **Styling**: Tailwind CSS v4.
- **Linting/Formatting**: ESLint and Prettier.

## AI Assistant Tips
- Never edit `src/routeTree.gen.ts` directly.
- Use function declarations for components.
- Follow the directory structure: `src/routes/`, `src/components/`, `src/hooks/`.
- Refer to `AGENTS.md` and `ARCHITECTURE.md` for deeper architecture details.
