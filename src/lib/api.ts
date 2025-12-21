import { hc } from "hono/client";
import type { ApiRoutes } from "../routes/-api";

/**
 * Hono RPC client for type-safe API requests.
 */
export const api = hc<ApiRoutes>("/api");
