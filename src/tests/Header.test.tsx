import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import Header from "../components/Header";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

describe("Header", () => {
	it("renders navigation links", () => {
		render(<Header />);

		expect(screen.getByText("Home")).toBeDefined();
		expect(screen.getByText("About")).toBeDefined();
		expect(screen.getByText("Error")).toBeDefined();
	});

	it("has navigation links with correct hrefs", () => {
		render(<Header />);

		const links = screen.getAllByRole("link");
		expect(links.length).toBe(4);
		expect(links[0].getAttribute("href")).toBe("/");
		expect(links[1].getAttribute("href")).toBe("/");
		expect(links[2].getAttribute("href")).toBe("/about");
		expect(links[3].getAttribute("href")).toBe("/error");
	});
});
