import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="px-8 py-4 flex items-center justify-center bg-[var(--color-charcoal)]/80 backdrop-blur-md border-b border-[var(--color-mist)] sticky top-0 z-50">
			<div className="flex items-center gap-6">
				{/* Logo */}
				<Link
					to="/"
					className="text-lg font-bold gradient-text tracking-tight hover:opacity-80 transition-opacity"
				>
					TanStack + Hono
				</Link>

				<span className="w-px h-5 bg-[var(--color-mist)]" />

				{/* Navigation */}
				<nav className="flex items-center gap-1">
					<Link
						to="/"
						activeOptions={{ exact: true }}
						className="px-4 py-2 text-sm font-medium text-[var(--color-ash)] hover:text-[var(--color-bone)] hover:bg-[var(--color-mist)] rounded-lg transition-all duration-200 [&.active]:text-[var(--color-cyan)] [&.active]:bg-[var(--color-cyan)]/10"
						activeProps={{ className: "active" }}
					>
						Home
					</Link>
					<Link
						to="/about"
						className="px-4 py-2 text-sm font-medium text-[var(--color-ash)] hover:text-[var(--color-bone)] hover:bg-[var(--color-mist)] rounded-lg transition-all duration-200 [&.active]:text-[var(--color-cyan)] [&.active]:bg-[var(--color-cyan)]/10"
						activeProps={{ className: "active" }}
					>
						About
					</Link>
					<Link
						to="/error"
						className="px-4 py-2 text-sm font-medium text-[var(--color-ash)] hover:text-[var(--color-bone)] hover:bg-[var(--color-mist)] rounded-lg transition-all duration-200 [&.active]:text-[var(--color-cyan)] [&.active]:bg-[var(--color-cyan)]/10"
						activeProps={{ className: "active" }}
					>
						Error
					</Link>
				</nav>
			</div>
		</header>
	);
}
