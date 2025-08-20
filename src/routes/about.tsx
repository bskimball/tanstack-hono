import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
				<img
					src={logo}
					className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
					alt="logo"
				/>
				<h1 className="text-4xl font-bold mb-6">About Us</h1>
				<p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
					This is a modern full-stack application built with{" "}
					<span className="text-[#61dafb] font-semibold">TanStack Router</span>{" "}
					and <span className="text-[#61dafb] font-semibold">Hono</span> for
					blazing-fast server-side rendering and an exceptional developer
					experience.
				</p>
				<div className="flex gap-6 flex-wrap justify-center">
					<a
						className="text-[#61dafb] hover:underline hover:text-white transition-colors"
						href="https://tanstack.com/router"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn TanStack Router
					</a>
					<a
						className="text-[#61dafb] hover:underline hover:text-white transition-colors"
						href="https://hono.dev"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn Hono
					</a>
					<a
						className="text-[#61dafb] hover:underline hover:text-white transition-colors"
						href="https://vitejs.dev"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn Vite
					</a>
				</div>
			</header>
		</div>
	);
}
