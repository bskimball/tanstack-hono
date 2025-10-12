import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import type { RouterContext } from "./routerContext";
import { routeTree } from "./routeTree.gen.ts";

export function createRouter() {
	return createTanstackRouter({
		routeTree,
		context: {
			head: "",
		} as RouterContext,
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultStructuralSharing: true,
		defaultPreloadStaleTime: 0,
	});
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
