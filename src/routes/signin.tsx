import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
	head: () => ({ title: "Sign in — Flow", meta: [{ name: "robots", content: "noindex, nofollow, noarchive" }] }),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="grid min-h-screen place-items-center bg-flow-canvas text-flow-text">
			<div className="flow-card p-8">
				<h1 className="text-2xl font-bold">Sign in</h1>
				<p className="mt-2 text-flow-text-secondary">
					Your sign-in page goes here.
				</p>
			</div>
		</main>
	);
}
