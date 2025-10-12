import type { Context } from "hono";

export const handler = (c: Context) => c.text("Hello /test!");
