import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
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
				<div className="w-full max-w-2xl flex flex-col items-center text-center">
					{/* Animated Graphic - Centered */}
					<div
						className="relative w-32 h-32 mb-6 animate-fade-up opacity-0"
						style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
					>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-28 h-28 border border-[var(--color-cyan)]/20 rounded-full animate-[spin_25s_linear_infinite]">
								<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--color-cyan)] rounded-full" />
							</div>
						</div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-20 h-20 border border-[var(--color-amber)]/15 rounded-full animate-[spin_18s_linear_infinite_reverse]" />
						</div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-12 h-12 bg-gradient-to-br from-[var(--color-slate)] to-[var(--color-charcoal)] rounded-xl border border-[var(--color-mist)] flex items-center justify-center shadow-xl">
								<span className="text-lg font-bold gradient-text">TS</span>
							</div>
						</div>
					</div>

					{/* Badge */}
					<div
						className="mb-4 animate-fade-up opacity-0"
						style={{
							animationDelay: "0.2s",
							animationFillMode: "forwards",
						}}
					>
						<span className="inline-block px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase bg-[var(--color-slate)] text-[var(--color-cyan)] border border-[var(--color-cyan)]/30 rounded-full">
							SSR Monolith Starter
						</span>
					</div>

					{/* Heading */}
					<div
						className="mb-6 animate-fade-up opacity-0"
						style={{
							animationDelay: "0.3s",
							animationFillMode: "forwards",
						}}
					>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-bone)] leading-[1.1]">
							TanStack Router
						</h1>
						<span className="block text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mt-1">
							<span className="text-[var(--color-bone)]">+</span>{" "}
							<span className="gradient-text">Hono</span>
						</span>
					</div>

					{/* Description */}
					<p
						className="text-base md:text-lg text-[var(--color-ash)] max-w-md leading-relaxed mb-6 animate-fade-up opacity-0"
						style={{
							animationDelay: "0.4s",
							animationFillMode: "forwards",
						}}
					>
						Type-safe file-based routing with lightning-fast server-side rendering. Build
						production-ready full-stack apps.
					</p>

					{/* Buttons */}
					<div
						className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-up opacity-0"
						style={{
							animationDelay: "0.5s",
							animationFillMode: "forwards",
						}}
					>
						<a
							href="https://tanstack.com/router"
							target="_blank"
							rel="noopener noreferrer"
							className="group inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-bone)] text-[var(--color-void)] text-sm font-semibold rounded-lg hover:bg-[var(--color-cyan)] transition-all duration-300"
						>
							Get Started
							<svg
								className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</a>
						<a
							href="https://hono.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-[var(--color-bone)] text-sm font-semibold rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)] transition-all duration-300"
						>
							Documentation
						</a>
					</div>

					{/* Footer Tech Stack */}
					<div
						className="animate-fade-up opacity-0"
						style={{
							animationDelay: "0.6s",
							animationFillMode: "forwards",
						}}
					>
						<div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--color-ash)]">
							<span className="hover:text-[var(--color-cyan)] transition-colors cursor-default">
								React
							</span>
							<span className="w-1 h-1 rounded-full bg-[var(--color-ash)]/30" />
							<span className="hover:text-[var(--color-cyan)] transition-colors cursor-default">
								Vite
							</span>
							<span className="w-1 h-1 rounded-full bg-[var(--color-ash)]/30" />
							<span className="hover:text-[var(--color-cyan)] transition-colors cursor-default">
								TypeScript
							</span>
							<span className="w-1 h-1 rounded-full bg-[var(--color-ash)]/30" />
							<span className="hover:text-[var(--color-cyan)] transition-colors cursor-default">
								Tailwind
							</span>
						</div>
					</div>
				</div>
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
