# Contributing to TanStack Router + Hono SSR Template

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tanstack-hono.git
   cd tanstack-hono
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Running Tests

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode (if configured)
```

### Linting and Formatting

This project uses **Biome** for linting and formatting (not ESLint/Prettier).

```bash
npm run check         # Check for lint and format issues
npm run check -- --write  # Auto-fix issues
npm run lint          # Lint only
npm run format        # Format only
```

### Type Checking

```bash
npm run build:types   # Run TypeScript type checker
```

### Building for Production

```bash
npm run build         # Build client, server, and types
npm start             # Start production server
```

## Code Guidelines

### TypeScript

- Write all new code in TypeScript
- Avoid `any` types when possible
- Use `interface` for object shapes, `type` for unions/intersections
- Export types that are used across multiple files

### React Components

- Use **function declarations** for named components:
  ```tsx
  function MyComponent() {
    return <div>Content</div>
  }
  ```
- Avoid arrow functions for top-level component exports
- Keep components focused and single-purpose
- Use descriptive prop names

### File Naming

- Use **kebab-case** for file names: `user-profile.tsx`
- Use **PascalCase** for component files that export a single component
- Test files should be named `*.test.tsx` or `*.test.ts`

### Routes

- Place route files in `src/routes/`
- Use TanStack Router's `createFileRoute` pattern
- Files starting with `-` are utilities, not routes
- Follow existing route patterns for consistency

### API Endpoints

- Add endpoints in `src/entry-server.tsx`
- Use Hono's routing methods
- Return JSON with `c.json()`
- Add proper error handling

### Styling

- Use **Tailwind CSS** utility classes
- Add custom styles to `src/styles.css` only when necessary
- Follow existing Tailwind conventions

### Imports

- Use relative imports (no path aliases configured)
- Group imports: external packages first, then local files
- Sort imports alphabetically within groups

## Commit Guidelines

We follow conventional commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

### Examples

```bash
git commit -m "feat: add user authentication route"
git commit -m "fix: resolve SSR hydration mismatch"
git commit -m "docs: update README with deployment instructions"
```

## Pull Request Process

1. **Update documentation** if needed (README, AGENTS.md, etc.)
2. **Add tests** for new features
3. **Ensure all checks pass**:
   ```bash
   npm run check
   npm run build:types
   npm test
   npm run build
   ```
4. **Update CHANGELOG.md** if applicable
5. **Submit your PR** with a clear description of changes

### PR Title Format

Use conventional commit format:
- `feat: Add user profile page`
- `fix: Resolve routing issue on about page`
- `docs: Improve Docker setup instructions`

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
How was this tested?

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] I have updated the documentation
```

## Project Structure

```
src/
├── routes/              # File-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Home page
│   └── ...
├── components/          # Reusable components
├── entry-client.tsx     # Client entry point
├── entry-server.tsx     # Server entry point (Hono)
├── router.tsx           # Router configuration
└── styles.css           # Global styles
```

## Testing Guidelines

- Write tests for new features and bug fixes
- Use Vitest and Testing Library
- Test files should live alongside source files
- Aim for meaningful test coverage, not just high percentages

### Example Test

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Documentation

When adding new features:
- Update [README.md](README.md) if user-facing
- Update [AGENTS.md](AGENTS.md) for AI agent context
- Update [ARCHITECTURE.md](ARCHITECTURE.md) for architectural changes
- Add code comments for complex logic

## Docker Development

Test Docker builds locally:

```bash
# Production build
docker-compose up app

# Development build with hot reload
docker-compose --profile dev up dev
```

## Need Help?

- Check existing [issues](https://github.com/bskimball/tanstack-hono/issues)
- Review [AGENTS.md](AGENTS.md) for project context
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
- Ask questions in issues or discussions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the project
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
