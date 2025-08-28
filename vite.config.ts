/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import devServer, { defaultOptions } from "@hono/vite-dev-server"
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import "dotenv/config"

const port = process.env.NODE_SERVER_PORT
	? Number.parseInt(process.env.NODE_SERVER_PORT, 10)
	: 3000;
const host = process.env.NODE_SERVER_HOST || "localhost";

const ssrBuild = {
  outDir: 'dist/server',
  ssrEmitAssets: true,
  copyPublicDir: false,
  emptyOutDir: false,
  rollupOptions: {
    input: resolve(__dirname, 'src/entry-server.tsx'),
    output: {
      entryFileNames: 'index.js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash][extname]',
    },
  },
  ssr: true,
}

const clientBuild = {
  outDir: 'dist/client',
  emitAssets: true,
  copyPublicDir: true,
  emptyOutDir: true,
  rollupOptions: {
    input: resolve(__dirname, 'src/entry-client.tsx'),
    output: {
      entryFileNames: 'static/[name].js',
      chunkFileNames: 'static/assets/[name]-[hash].js',
      assetFileNames: 'static/assets/[name]-[hash][extname]',
    },
  },
  manifest: true
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tanstackRouter({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
      devServer({ 
        entry: 'src/entry-server.tsx',
        injectClientScript: false,
        exclude: [
          /^\/src\/.+/, // Allow Vite to handle /src/ requests
          ...defaultOptions.exclude
        ],
      }),
    ],
    build: mode === "client" ? clientBuild : ssrBuild,
    test: {
      globals: true,
      environment: 'jsdom',
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      host,
      port
    },
    // Ensure proper dev server handling
    optimizeDeps: {
      include: ['react', 'react-dom', '@tanstack/react-router']
    }
  }
})
