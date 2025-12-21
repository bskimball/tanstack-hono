import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

const technologies = [
	{
		name: "TanStack Router",
		description: "Type-safe file-based routing with first-class SSR support",
		color: "cyan" as const,
	},
	{
		name: "Hono",
		description: "Ultra-fast web framework for the edge and beyond",
		color: "amber" as const,
	},
	{
		name: "Vite",
		description: "Next-generation frontend tooling with instant HMR",
		color: "cyan" as const,
	},
	{
		name: "TypeScript",
		description: "Full type safety from server to client",
		color: "amber" as const,
	},
];

function AboutPage() {
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
				<div className="w-full max-w-md text-center">
					<div
						className="mb-6 animate-fade-up opacity-0"
						style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
					>
						<span className="inline-block px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase bg-[var(--color-slate)] text-[var(--color-amber)] border border-[var(--color-amber)]/30 rounded-full">
							The Stack
						</span>
					</div>

					<h1
						className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-bone)] mb-3 animate-fade-up opacity-0"
						style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
					>
						Built for <span className="gradient-text">Speed</span>
					</h1>

					<p
						className="text-sm md:text-base text-[var(--color-ash)] mb-8 animate-fade-up opacity-0"
						style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
					>
						A carefully curated stack for building modern, type-safe full-stack applications with
						server-side rendering.
					</p>

					<div className="space-y-3 mb-8">
						{technologies.map((tech, index) => (
							<div
								key={tech.name}
								className="group p-4 bg-[var(--color-charcoal)]/50 border border-[var(--color-mist)] rounded-lg hover:border-[var(--color-cyan)]/30 transition-all duration-300 animate-fade-up opacity-0"
								style={{
									animationDelay: `${0.4 + index * 0.1}s`,
									animationFillMode: "forwards",
								}}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-8 h-8 rounded-lg bg-[var(--color-slate)] border ${tech.color === "cyan" ? "border-[var(--color-cyan)]/30" : "border-[var(--color-amber)]/30"} flex items-center justify-center flex-shrink-0`}
									>
										<span
											className={`text-sm font-bold ${tech.color === "cyan" ? "text-[var(--color-cyan)]" : "text-[var(--color-amber)]"}`}
										>
											{tech.name.charAt(0)}
										</span>
									</div>
									<div className="text-left">
										<h3
											className={`text-sm font-semibold ${tech.color === "cyan" ? "text-[var(--color-cyan)]" : "text-[var(--color-amber)]"}`}
										>
											{tech.name}
										</h3>
										<p className="text-xs text-[var(--color-ash)]">{tech.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<div
						className="animate-fade-up opacity-0"
						style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
					>
						<a
							href="/"
							className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-[var(--color-bone)] text-sm font-semibold rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)] transition-all duration-300"
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
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to Home
						</a>
					</div>
				</div>
			</div>

			{/* Floating geometric elements */}
			<div className="absolute top-20 right-20 w-2 h-2 bg-[var(--color-amber)] rounded-full animate-float opacity-60" />
			<div
				className="absolute bottom-20 left-20 w-3 h-3 bg-[var(--color-cyan)] rounded-full animate-float opacity-40"
				style={{ animationDelay: "2s" }}
			/>
		</main>
	);
}
