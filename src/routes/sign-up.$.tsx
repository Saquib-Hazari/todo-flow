import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up/$")({
	head: () => ({ title: "Create your Flow account", meta: [{ name: "robots", content: "noindex, nofollow, noarchive" }] }),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<SignUp
				routing="path"
				path="/sign-up"
				signInUrl="/sign-in"
				forceRedirectUrl="/dashboard"
			/>
		</main>
	);
}
