# Multi-stage build for TanStack + Hono SSR application
# Stage 1: Build dependencies and application
FROM node:22.22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Enforce packageManager and install dependencies
# Skip repo-only prepare (vp config); keep package lifecycle scripts
RUN npm install -g npm@12.0.2 && \
    npm pkg delete scripts.prepare && \
    npm ci

# Copy source code
COPY . .

# Build the application (client, server, and types)
RUN npm run build

# Stage 2: Production runtime
FROM node:22.22-alpine AS runner

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 honouser

# Copy package files
COPY package*.json ./

# Enforce packageManager and install only production dependencies
# Skip repo-only prepare (vp config); vp is a devDependency and not present here
RUN npm install -g npm@12.0.2 && \
    npm pkg delete scripts.prepare && \
    npm ci --omit=dev && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=honouser:nodejs /app/dist ./dist

# Switch to non-root user
USER honouser

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application (NODE_ENV already set; avoid cross-env, a devDependency)
CMD ["node", "dist/server/index.js"]
