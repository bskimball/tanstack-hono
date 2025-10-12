import { Hono } from "hono";

export const handler = new Hono().get("/health", (c) => {
	return c.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || "development",
	});
});
