import type { Hono } from "hono";

export const setupApiRoutes = (app: Hono) => {
	// Health check endpoint
	app.get("/api/health", (c) => {
		return c.json({
			status: "ok",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: process.env.NODE_ENV || "development",
		});
	});

	// Add more API routes here as needed
};
