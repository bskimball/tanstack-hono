import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import type { RouterContext } from "../router";
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
				: [
						// The HeadContent component will load the entry script twice
						// we will add it manually for now
						// https://github.com/TanStack/router/issues/4585
						//
						// {
						// 	type: "module",
						// 	src: "/assets/entry-client.js",
						// },
					]),
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<>
					<HeadContent />
					{/* Will remove this once issue 4585 is resolved */}
					{import.meta.env.PROD ? (
						<script type="module" src="/assets/entry-client.js" />
					) : null}
				</>
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
