import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<div className="container mx-auto">
				<h1 className="text-6xl text-red-500 font-semibold">About</h1>
			</div>
			<div className="container mx-auto">
				<p>Hello "/about"! and testing</p>
			</div>
		</div>
	);
}
