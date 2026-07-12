import { auth } from "@clerk/tanstack-react-start/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const requireAuth = createServerFn().handler(async () => {
	const { isAuthenticated, userId } = await auth();

	if (!isAuthenticated) {
		throw redirect({
			to: "/signin",
		});
	}

	return { userId };
});

export const Route = createFileRoute("/app")({
	beforeLoad: async () => {
		return requireAuth();
	},
	component: AppPage,
});

function AppPage() {
	const { userId } = Route.useRouteContext();

	return (
		<main className="min-h-screen bg-flow-canvas p-8 text-flow-text">
			<h1 className="text-2xl font-bold">Your FlowList</h1>
			<p className="mt-2 text-flow-text-secondary">
				Authenticated user: {userId}
			</p>
		</main>
	);
}
