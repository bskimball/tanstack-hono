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
      manifest: true,
  }

const clientBuild = {
      rollupOptions: {
          input: ["./src/entry-client.tsx"],
          output: {
            entryFileNames: "static/entry-[name].js",
          },
      },
  }

export default defineConfig(({ mode }) => {
  return {  
    plugins: [
      tanstackRouter({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
      devServer({ entry: 'src/entry-server.tsx' }),
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
