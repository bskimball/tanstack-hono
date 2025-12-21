import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "../components/HeroSection";

describe("HeroSection", () => {
	const props = {
		title: "Test Title",
		description: "Test Description",
		links: [
			{ text: "Link 1", href: "https://link1.com" },
			{ text: "Link 2", href: "https://link2.com" },
		],
	};

	it("renders title and description", () => {
		render(<HeroSection {...props} />);
		expect(screen.getByText("Test Title")).toBeDefined();
		expect(screen.getByText("Test Description")).toBeDefined();
	});

	it("renders all links", () => {
		render(<HeroSection {...props} />);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(2);
		expect(links[0].getAttribute("href")).toBe("https://link1.com");
		expect(links[1].getAttribute("href")).toBe("https://link2.com");
	});

	it("renders logo with correct alt text", () => {
		render(<HeroSection {...props} />);
		const logo = screen.getByAltText("logo");
		expect(logo).toBeDefined();
		expect(logo.getAttribute("src")).toContain("logo.svg");
	});
});
