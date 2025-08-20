/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import devServer from "@hono/vite-dev-server"

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

const ssrBuild = {
      rollupOptions: {
        input: "./src/entry-server.tsx",
        output: {
          entryFileNames: "server.js",
        },
      },
      ssr: true,      
      emptyOutDir: false,
  }

const clientBuild = {
      rollupOptions: {
          input: ["./src/entry-client.tsx"],
          output: {
            entryFileNames: "assets/[name].js",
          },
      },
      manifest: true,
  }

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tanstackRouter(),
      viteReact(),
      tailwindcss(),
      devServer({ entry: 'src/entry-server.tsx', injectClientScript: false }),
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
  }
})
