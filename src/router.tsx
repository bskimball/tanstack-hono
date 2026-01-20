import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import type { RouterContext } from "./types/router";

export interface CreateRouterOptions {
	head?: string;
	appCssHrefs?: string[];
}

export function createRouter(options: CreateRouterOptions = {}) {
	const context: RouterContext = {
		head: options.head ?? "",
		appCssHrefs: options.appCssHrefs ?? [],
	};

	return createTanstackRouter({
		routeTree,
		context,
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
