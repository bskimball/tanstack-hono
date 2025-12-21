import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import React, { Suspense } from "react";
import Header from "../components/Header";
import appCss from "../styles.css?url";
import type { RouterContext } from "../types/router";

const TanStackRouterDevtools = import.meta.env.PROD
	? () => null // Render nothing in production
	: React.lazy(() =>
			import("@tanstack/react-router-devtools").then((res) => ({
				default: res.TanStackRouterDevtools,
			}))
		);

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
					]
				: []),
			{
				type: "module",
				src: import.meta.env.PROD ? "/static/entry-client.js" : "/src/entry-client.tsx",
			},
		],
	}),
	errorComponent: ({ error }) => (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Error - TanStack Router</title>
				<link rel="stylesheet" href={appCss} />
			</head>
			<body>
				<main className="min-h-screen bg-[var(--color-void)] relative overflow-hidden flex items-center justify-center">
					<div className="noise-overlay" />

					{/* Ambient gradient */}
					<div className="absolute inset-0 bg-gradient-to-b from-[var(--color-coral)]/5 via-transparent to-[var(--color-cyan)]/5" />

					{/* Scanline effect */}
					<div
						className="absolute inset-0 pointer-events-none opacity-[0.02]"
						style={{
							backgroundImage:
								"repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-bone) 2px, var(--color-bone) 4px)",
						}}
					/>

					<div className="relative z-10 text-center px-8">
						<div className="relative mb-8">
							<h1 className="text-8xl md:text-9xl font-bold leading-none tracking-tighter text-[var(--color-coral)] select-none">
								ERROR
							</h1>
						</div>

						<div className="space-y-6 animate-fade-up" style={{ animationFillMode: "forwards" }}>
							<h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-bone)]">
								Something went wrong
							</h2>
							<div className="p-4 bg-[var(--color-charcoal)]/50 border border-[var(--color-coral)]/30 rounded-lg max-w-md mx-auto">
								<code className="text-sm font-mono text-[var(--color-coral)] break-words">
									{error?.message || "An unexpected error occurred"}
								</code>
							</div>
						</div>

						<div
							className="mt-12 flex flex-wrap gap-4 justify-center animate-fade-up"
							style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
						>
							<button
								type="button"
								className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-bone)] text-[var(--color-void)] font-semibold rounded-lg hover:bg-[var(--color-coral)] transition-all duration-300"
								onClick={() => window.location.reload()}
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								Reload Page
							</button>
							<a
								href="/"
								className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-[var(--color-bone)] font-semibold rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)] transition-all duration-300"
							>
								Return Home
							</a>
						</div>
					</div>

					{/* Floating geometric elements */}
					<div className="absolute top-20 left-20 w-2 h-2 bg-[var(--color-cyan)] rounded-full animate-float opacity-60" />
					<div
						className="absolute bottom-32 right-32 w-3 h-3 bg-[var(--color-coral)] rounded-full animate-float opacity-40"
						style={{ animationDelay: "1s" }}
					/>
				</main>
			</body>
		</html>
	),
	notFoundComponent: () => (
		<main className="min-h-screen bg-[var(--color-void)] relative overflow-hidden flex items-center justify-center">
			{/* Noise overlay */}
			<div className="noise-overlay" />

			{/* Ambient gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-[var(--color-coral)]/5 via-transparent to-[var(--color-cyan)]/5" />

			{/* Scanline effect */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.02]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-bone) 2px, var(--color-bone) 4px)",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 text-center px-8">
				{/* Giant 404 with glitch */}
				<div className="relative mb-8">
					<h1 className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-[var(--color-bone)] select-none">
						404
					</h1>
					{/* Decorative line */}
					<div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-32 h-1 bg-gradient-to-r from-transparent via-[var(--color-coral)] to-transparent" />
				</div>

				{/* Message */}
				<div
					className="space-y-6 animate-fade-up opacity-0"
					style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
				>
					<h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-ash)]">
						Lost in the void
					</h2>
					<p className="text-lg text-[var(--color-ash)]/70 max-w-md mx-auto font-mono">
						The page you&apos;re looking for has drifted into the digital abyss.
					</p>
				</div>

				{/* Action buttons */}
				<div
					className="mt-12 flex flex-wrap gap-4 justify-center animate-fade-up opacity-0"
					style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
				>
					<a
						href="/"
						className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-bone)] text-[var(--color-void)] font-semibold rounded-lg hover:bg-[var(--color-cyan)] transition-all duration-300"
					>
						<svg
							className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16l-4-4m0 0l4-4m-4 4h18"
							/>
						</svg>
						Return Home
					</a>
					<button
						type="button"
						onClick={() => window.history.back()}
						className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-[var(--color-bone)] font-semibold rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)] transition-all duration-300"
					>
						Go Back
					</button>
				</div>

				{/* Error code footer */}
				<div className="mt-16 text-xs font-mono text-[var(--color-ash)]/40 tracking-widest uppercase">
					Error Code: NOT_FOUND
				</div>
			</div>

			{/* Floating geometric elements */}
			<div className="absolute top-20 left-20 w-2 h-2 bg-[var(--color-cyan)] rounded-full animate-float opacity-60" />
			<div
				className="absolute bottom-32 right-32 w-3 h-3 bg-[var(--color-coral)] rounded-full animate-float opacity-40"
				style={{ animationDelay: "1s" }}
			/>
			<div
				className="absolute top-1/3 right-20 w-1 h-1 bg-[var(--color-amber)] rounded-full animate-float opacity-50"
				style={{ animationDelay: "2s" }}
			/>
			<div
				className="absolute bottom-20 left-1/4 w-2 h-2 border border-[var(--color-cyan)]/30 rounded-full animate-float"
				style={{ animationDelay: "0.5s" }}
			/>
		</main>
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
				<Suspense>
					<TanStackRouterDevtools position="bottom-right" />
				</Suspense>
				<Scripts />
			</body>
		</html>
	);
}
