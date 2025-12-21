import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import {
	createRequestHandler,
	RouterServer,
	renderRouterToString,
} from "@tanstack/react-router/ssr/server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { createRouter } from "./router.tsx";
import { handler as apiHandler } from "./routes/-api.ts";
import { handler as testHandler } from "./routes/-test.ts";
import "dotenv/config";

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
	const handler = createRequestHandler({
		request: c.req.raw,
		createRouter: () => {
			const router = createRouter();
			router.update({
				context: {
					...router.options.context,
				},
			});
			return router;
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
