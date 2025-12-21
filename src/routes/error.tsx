import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error")({
	component: SuccessComponent,
	loader: () => {
		if (Math.random() > 0.5) throw new Error("Random error!");
	},
	pendingComponent: LoadingComponent,
	wrapInSuspense: true,
	errorComponent: ErrorDisplay,
});

function PageWrapper({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-[calc(100vh-64px)] bg-[var(--color-void)] relative overflow-hidden">
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

			<div className="relative z-10 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-12">
				{children}
			</div>

			{/* Floating geometric elements */}
			<div className="absolute top-20 left-20 w-2 h-2 bg-[var(--color-cyan)] rounded-full animate-float opacity-60" />
			<div
				className="absolute bottom-32 right-32 w-3 h-3 bg-[var(--color-coral)] rounded-full animate-float opacity-40"
				style={{ animationDelay: "1s" }}
			/>
		</main>
	);
}

function LoadingComponent() {
	return (
		<PageWrapper>
			<div className="text-center">
				<div className="w-12 h-12 border-2 border-[var(--color-cyan)]/30 border-t-[var(--color-cyan)] rounded-full animate-spin mx-auto mb-4" />
				<p className="text-sm font-mono text-[var(--color-ash)]">Rolling the dice...</p>
			</div>
		</PageWrapper>
	);
}

function ErrorDisplay({ error }: { error: Error }) {
	return (
		<PageWrapper>
			<div
				className="text-center max-w-md animate-fade-up opacity-0"
				style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
			>
				<div className="mb-6">
					<span className="inline-block px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase bg-[var(--color-slate)] text-[var(--color-coral)] border border-[var(--color-coral)]/30 rounded-full">
						Exception Caught
					</span>
				</div>

				<h1
					className="glitch-text text-5xl md:text-6xl font-bold text-[var(--color-coral)] mb-4"
					data-text="ERROR"
				>
					ERROR
				</h1>

				<div className="p-4 bg-[var(--color-charcoal)]/50 border border-[var(--color-coral)]/30 rounded-lg mb-6">
					<code className="text-sm font-mono text-[var(--color-coral)]">{error.message}</code>
				</div>

				<p className="text-sm text-[var(--color-ash)] mb-6">
					This page has a <span className="text-[var(--color-amber)] font-semibold">50%</span>{" "}
					chance of throwing an error.
					<br />
					Refresh to try your luck again.
				</p>

				<div className="flex items-center justify-center gap-3">
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-coral)] text-[var(--color-void)] text-sm font-semibold rounded-lg hover:bg-[var(--color-bone)] transition-all duration-300"
					>
						<svg
							className="w-4 h-4"
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
						Try Again
					</button>
					<a
						href="/"
						className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-[var(--color-bone)] text-sm font-semibold rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)] transition-all duration-300"
					>
						Go Home
					</a>
				</div>
			</div>
		</PageWrapper>
	);
}

function SuccessComponent() {
	return (
		<PageWrapper>
			<div
				className="text-center max-w-md animate-fade-up opacity-0"
				style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
			>
				<div className="mb-6">
					<span className="inline-block px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase bg-[var(--color-slate)] text-[var(--color-cyan)] border border-[var(--color-cyan)]/30 rounded-full">
						Success
					</span>
				</div>

				<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 flex items-center justify-center">
					<svg
						className="w-8 h-8 text-[var(--color-cyan)]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>

				<h1 className="text-3xl md:text-4xl font-bold text-[var(--color-bone)] mb-3">
					You Got <span className="text-[var(--color-cyan)]">Lucky!</span>
				</h1>

				<p className="text-sm text-[var(--color-ash)] mb-6">
					The loader didn&apos;t throw an error this time.
					<br />
					This page has a <span className="text-[var(--color-amber)] font-semibold">50%</span>{" "}
					chance of failing.
				</p>

				<div className="flex items-center justify-center gap-3">
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-cyan)] text-[var(--color-void)] text-sm font-semibold rounded-lg hover:bg-[var(--color-bone)] transition-all duration-300"
					>
						<svg
							className="w-4 h-4"
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
						Roll Again
					</button>
					<a
						href="/"
						className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-[var(--color-bone)] text-sm font-semibold rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)] transition-all duration-300"
					>
						Go Home
					</a>
				</div>
			</div>
		</PageWrapper>
	);
}
