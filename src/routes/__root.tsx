import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import type { RouterContext } from "../routerContext";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "stylesheet", href: appCss },
		],
		meta: [
			{
				title: "TanStack Router SSR Basic File Based Streaming",
			},
			{
				charSet: "UTF-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0",
			},
		],
		scripts: [
			...(!import.meta.env.PROD
				? [
						{
							type: "module",
							children: `import RefreshRuntime from "/@react-refresh"
  								RefreshRuntime.injectIntoGlobalHook(window)
  								window.$RefreshReg$ = () => {}
  								window.$RefreshSig$ = () => (type) => type
  								window.__vite_plugin_react_preamble_installed__ = true`,
						},
						{
							type: "module",
							src: "/@vite/client",
						},
						{
							type: "module",
							src: "/src/entry-client.tsx",
						},
					]
				: []),
			{
				type: "module",
				src: import.meta.env.PROD
					? "/static/entry-client.js"
					: "/src/entry-client.tsx",
			},
		],
	}),
	errorComponent: ({ error }) => (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="min-h-screen flex items-center justify-center bg-red-50">
					<div className="text-center p-8">
						<h1 className="text-2xl font-bold text-red-600 mb-4">
							Something went wrong
						</h1>
						<p className="text-gray-600 mb-4">
							{error?.message || "An unexpected error occurred"}
						</p>
						<button
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							onClick={() => window.location.reload()}
						>
							Reload Page
						</button>
					</div>
				</div>
			</body>
		</html>
	),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
