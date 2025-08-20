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
import { CSSLinks, JSScripts } from "./components/Document.tsx";
import { createRouter } from "./router.tsx";

const port = process.env.NODE_SERVER_PORT
	? Number.parseInt(process.env.NODE_SERVER_PORT, 10)
	: 3000;
const host = process.env.NODE_SERVER_HOST || "localhost";

const app = new Hono();

app.use(logger()); // Enable logging for all routes

app.use(cors()); // Enable CORS for all routes

app.get("/test", (c) => c.text("Hello /test!"));

app.use(
	"*",
	serveStatic({
		root: "./",
	}),
);

app.get("*", async (c) => {
	const handler = createRequestHandler({
		request: c.req.raw,
		createRouter: () => {
			const router = createRouter();
			router.update({
				context: { ...router.options.context, request: c.req.raw },
			});
			return router;
		},
	});

	return await handler(({ responseHeaders, router }) => {
		return renderRouterToString({
			responseHeaders,
			router,
			children: (
				<html lang="en">
					<head>
						<meta charSet="UTF-8" />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1.0"
						/>
						<title>Tanstack + Hono</title>
						<CSSLinks href="/src/styles.css" />
						<JSScripts src="/src/entry-client.tsx" />
					</head>
					<body>
						<div id="app">
							<RouterServer router={router} />
						</div>
					</body>
				</html>
			),
		});
	});
});

// start server
if (process.env.NODE_ENV === "production") {
	app.use(compress());
	app.use(
		"*",
		serveStatic({
			root: "./dist",
		}),
	);
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
