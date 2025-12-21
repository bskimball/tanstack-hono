import type React from "react";
import logo from "../logo.svg";

interface HeroLink {
	text: string;
	href: string;
}

interface HeroSectionProps {
	title: string;
	description: React.ReactNode;
	links: HeroLink[];
}

export default function HeroSection({ title, description, links }: HeroSectionProps) {
	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
				<img
					src={logo}
					className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
					alt="logo"
				/>
				<h1 className="text-4xl font-bold mb-6">{title}</h1>
				<p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed">{description}</p>
				<div className="flex gap-6 flex-wrap justify-center">
					{links.map((link) => (
						<a
							key={link.href}
							className="text-[#61dafb] hover:underline hover:text-white transition-colors"
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
						>
							{link.text}
						</a>
					))}
				</div>
			</header>
		</div>
	);
}
