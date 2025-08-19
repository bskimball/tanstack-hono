import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import manifest from "../dist/.vite/manifest.json";
import { tanstackRouterHandler } from "./middleware/tanstack-router-middleware";
import { createRouter } from "./router.tsx";

const port = process.env.NODE_SERVER_PORT
	? Number.parseInt(process.env.NODE_SERVER_PORT, 10)
	: 3000;
const host = process.env.NODE_SERVER_HOST || "localhost";
const router = createRouter();

const app = new Hono();

app.get("/test", (c) => c.text("Hello /test!"));

app.use(
	"*",
	tanstackRouterHandler({
		router,
	}),
);

app.use("*", serveStatic({ root: "./dist" }));

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
