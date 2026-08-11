import fs from "node:fs";
import path from "node:path";
import { getRequestListener } from "@hono/node-server";
import type { Connect, Plugin, ViteDevServer } from "vite";

export type HonoDevServerOptions = {
	/** SSR entry loaded via Vite on each request. Default: `./src/index.ts`. */
	entry?: string;
	/** Named export that is the Hono app (or `{ fetch }`). Default: `default`. */
	export?: string;
	/**
	 * Paths that should fall through to Vite (assets, client modules, HMR).
	 * Matched against the full URL and the query-stripped pathname.
	 */
	exclude?: RegExp[];
	/**
	 * When true, inject Vite client into HTML responses. This app serves its own
	 * client entry, so the project sets this to false.
	 */
	injectClientScript?: boolean;
};

/** Upstream-compatible defaults needed so Vite assets/internal paths are not swallowed. */
export const defaultOptions = {
	entry: "./src/index.ts",
	export: "default",
	injectClientScript: true,
	exclude: [
		/.*\.css$/,
		/.*\.ts$/,
		/.*\.tsx$/,
		/.*\.mdx?$/,
		/^\/@.+$/,
		/\?t=\d+$/,
		/^\/favicon\.ico$/,
		/^\/static\/.+/,
		/^\/node_modules\/.*/,
		/^\/\.vite\/.*/,
		/.*\.svelte$/,
		/.*\.vue$/,
		/.*\.js$/,
		/.*\.jsx$/,
		/.*\.mjs$/,
	],
} as const;

function safeParseUrlPath(value: string): string | undefined {
	try {
		return new URL(value, "http://localhost").pathname;
	} catch {
		return undefined;
	}
}

function isExcluded(url: string, patterns: RegExp[]): boolean {
	const pathname = safeParseUrlPath(url);
	for (const pattern of patterns) {
		if (pattern.test(url) || (pathname !== undefined && pattern.test(pathname))) {
			return true;
		}
	}
	return false;
}

type FetchApp = {
	fetch: (
		request: Request,
		env?: unknown,
		executionContext?: unknown
	) => Promise<Response> | Response;
};

/**
 * Minimal Vite connect middleware that SSR-loads a Hono app and bridges it to
 * Node via `@hono/node-server` `getRequestListener` (supported 2.x API).
 */
export function honoDevServer(options: HonoDevServerOptions = {}): Plugin {
	const entry = options.entry ?? defaultOptions.entry;
	const exportName = options.export ?? defaultOptions.export;
	const exclude = options.exclude ?? [...defaultOptions.exclude];
	// Project sets injectClientScript:false; omit injection unless explicitly enabled.
	const injectClientScript = options.injectClientScript ?? defaultOptions.injectClientScript;

	let publicDirPath = "";

	return {
		name: "hono-dev-server",
		configResolved(config) {
			publicDirPath = config.publicDir;
		},
		configureServer(server) {
			server.middlewares.use(createMiddleware(server));
		},
		// Reload the browser when an SSR-loaded module changes (same as upstream default).
		handleHotUpdate({ server, modules }) {
			if (modules.some((mod) => mod.ssrModule)) {
				server.hot.send({ type: "full-reload" });
				return [];
			}
		},
	};

	function createMiddleware(server: ViteDevServer): Connect.NextHandleFunction {
		return async (req, res, next) => {
			if (req.url) {
				const filePath = path.join(publicDirPath, req.url);
				try {
					if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
						return next();
					}
				} catch {
					// fall through to Hono / Vite
				}
			}

			if (req.url && isExcluded(req.url, exclude)) {
				return next();
			}

			let app: FetchApp;
			try {
				let appModule: Record<string, unknown>;
				try {
					appModule = await server.ssrLoadModule(entry);
				} catch (e) {
					if (e instanceof Error) {
						server.ssrFixStacktrace(e);
					}
					throw e;
				}
				const exported = appModule[exportName];
				if (!exported || typeof (exported as FetchApp).fetch !== "function") {
					throw new Error(
						`Failed to find a named export "${exportName}" with fetch() from ${entry}`
					);
				}
				app = exported as FetchApp;
			} catch (e) {
				return next(e);
			}

			// injectClientScript is intentionally unsupported when true in this slim plugin;
			// this project always passes false (client entry is SSR-linked).
			if (injectClientScript) {
				return next(
					new Error(
						"hono-dev-server: injectClientScript is not implemented; set injectClientScript:false"
					)
				);
			}

			void getRequestListener(
				async (request, env) => {
					const response = await app.fetch(request, env);
					if (!(response instanceof Response)) {
						throw response;
					}
					return response;
				},
				{
					overrideGlobalObjects: false,
					errorHandler: (e) => {
						let err: Error;
						if (e instanceof Error) {
							err = e;
							server.ssrFixStacktrace(err);
						} else if (typeof e === "string") {
							err = new Error(`The response is not an instance of "Response", but: ${e}`);
						} else {
							err = new Error(`Unknown error: ${String(e)}`);
						}
						next(err);
					},
				}
			)(req, res);
		};
	}
}

export default honoDevServer;
