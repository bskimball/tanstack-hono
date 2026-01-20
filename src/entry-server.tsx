import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import {
	createRequestHandler,
	RouterServer,
	renderRouterToString,
} from "@tanstack/react-router/ssr/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { createRouter } from "./router.tsx";
import { handler as apiHandler } from "./routes/-api.ts";
import { handler as testHandler } from "./routes/-test.ts";
import "dotenv/config";

interface ViteManifestChunk {
	file: string;
	assets?: string[];
	css?: string[];
}

type ViteManifest = Record<string, ViteManifestChunk>;

let cachedProdAppCssHrefs: string[] | null = null;

function getProdAppCssHrefs(): string[] {
	if (cachedProdAppCssHrefs) return cachedProdAppCssHrefs;

	try {
		const manifestPath = resolve(process.cwd(), "dist/client/.vite/manifest.json");
		const raw = readFileSync(manifestPath, "utf8");
		const manifest = JSON.parse(raw) as ViteManifest;
		const entry = manifest["src/entry-client.tsx"];

		if (!entry) {
			console.warn(
				"Could not find src/entry-client.tsx in Vite manifest. CSS will not be linked."
			);
			cachedProdAppCssHrefs = [];
			return cachedProdAppCssHrefs;
		}

		const cssFiles = new Set<string>();
		for (const href of entry.css ?? []) {
			if (href.endsWith(".css")) cssFiles.add(href);
		}
		for (const href of entry.assets ?? []) {
			if (href.endsWith(".css")) cssFiles.add(href);
		}

		cachedProdAppCssHrefs = Array.from(cssFiles).map((file) =>
			file.startsWith("/") ? file : `/${file}`
		);
		return cachedProdAppCssHrefs;
	} catch (error) {
		console.warn("Failed to read Vite manifest for CSS assets:", error);
		cachedProdAppCssHrefs = [];
		return cachedProdAppCssHrefs;
	}
}

function getAppCssHrefs(): string[] {
	if (process.env.NODE_ENV === "production") {
		return getProdAppCssHrefs();
	}

	// In dev we want SSR to include immediate styling.
	return ["/src/styles.css"];
}

const port = process.env.NODE_SERVER_PORT
	? Number.parseInt(process.env.NODE_SERVER_PORT, 10)
	: 3000;
const host = process.env.NODE_SERVER_HOST || "localhost";

const app = new Hono();

// Security headers
app.use(secureHeaders());

// Logger - only in development or for API routes
if (!import.meta.env.PROD) {
	app.use(logger());
}

// CORS - scope to /api and configure via environment variable
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(
	"/api/*",
	cors({
		origin: allowedOrigin,
		credentials: allowedOrigin !== "*",
	})
);

// Setup API routes
app.route("/api", apiHandler);

app.get("/test", testHandler);

if (process.env.NODE_ENV === "production") {
	app.use(compress());

	app.use(
		"/*",
		serveStatic({
			root: "./dist/client",
		})
	);
}

app.use("*", async (c) => {
	const appCssHrefs = getAppCssHrefs();

	const handler = createRequestHandler({
		request: c.req.raw,
		createRouter: () => {
			return createRouter({
				head: "",
				appCssHrefs,
			});
		},
	});

	return await handler(({ responseHeaders, router }) => {
		return renderRouterToString({
			responseHeaders,
			router,
			children: <RouterServer router={router} />,
		});
	});
});

// Start server in both development and production
if (process.env.NODE_ENV === "production") {
	serve(
		{
			fetch: app.fetch,
			port: port,
			hostname: host,
		},
		(info) => {
			console.log(`Production server is running on http://${host}:${info.port}`);
		}
	);
}

export default app;
