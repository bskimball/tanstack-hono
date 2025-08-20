import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import {
	RouterServer,
	createRequestHandler,
	renderRouterToString,
} from "@tanstack/react-router/ssr/server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createRouter } from "./router.tsx";
import { handler as testHandler } from "./routes/-test.ts";
import "dotenv/config";

const port = process.env.NODE_SERVER_PORT
	? Number.parseInt(process.env.NODE_SERVER_PORT, 10)
	: 3000;
const host = process.env.NODE_SERVER_HOST || "localhost";

const app = new Hono();

app.use(logger());

app.use(cors());

app.use(compress());

app.get("/test", testHandler);

app.use(
	"*",
	serveStatic({
		root: process.env.NODE_ENV === "production" ? "./dist" : "./",
	}),
);

app.get("*", async (c) => {
	const handler = createRequestHandler({
		request: c.req.raw,
		createRouter: () => {
			const router = createRouter();
			router.update({
				context: { ...router.options.context },
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

// start server
if (process.env.NODE_ENV === "production") {
	serve(
		{
			fetch: app.fetch,
			port: port,
		},
		(info) => {
			console.log(`Server is running on http://${host}:${info.port}`);
		},
	);
}

export default app;
