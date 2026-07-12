import {
	Show,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";

export function AuthActions() {
	return (
		<Show
			when="signed-in"
			fallback={
				<div className="flex items-center gap-3">
					<SignInButton mode="modal">
						<button
							type="button"
							className="rounded-xl border border-flow-border bg-flow-surface px-4 py-2.5 text-sm font-semibold text-flow-text"
						>
							Sign in
						</button>
					</SignInButton>

					<SignUpButton mode="modal">
						<button
							type="button"
							className="flow-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
						>
							Get started
						</button>
					</SignUpButton>
				</div>
			}
		>
			<div className="flex items-center gap-3">
				<Link
					to="/dashboard"
					className="flow-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
				>
					Dashboard
				</Link>

				<UserButton
					showName={false}
					appearance={{
						elements: {
							avatarBox: "h-9 w-9",
						},
					}}
				/>
			</div>
		</Show>
	);
}
