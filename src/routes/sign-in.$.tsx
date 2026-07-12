import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/$")({
	head: () => ({ meta: [{ title: "Sign in — Flow" }, { name: "robots", content: "noindex, nofollow, noarchive" }] }),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<SignIn
				routing="path"
				path="/sign-in"
				signUpUrl="/sign-up"
				forceRedirectUrl="/dashboard"
			/>
		</main>
	);
}
