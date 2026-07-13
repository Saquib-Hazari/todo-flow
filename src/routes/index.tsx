import { Show, SignInButton, SignUpButton } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthActions } from "../components/AuthAction.tsx";
import { Toggle } from "../components/Toggle.tsx";

const SITE_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:3000";
const SHARE_IMAGE = `${SITE_URL}/homepage.png`;

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Flow — A calmer way to get things done" },
			{ name: "description", content: "Turn scattered tasks into a clear, focused plan with Flow." },
			{ property: "og:site_name", content: "Flow" },
			{ property: "og:title", content: "Flow — A calmer way to get things done" },
			{ property: "og:description", content: "Turn scattered tasks into a clear, focused plan with Flow." },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:image", content: SHARE_IMAGE },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: "Flow task management app" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Flow — A calmer way to get things done" },
			{ name: "twitter:description", content: "Turn scattered tasks into a clear, focused plan with Flow." },
			{ name: "twitter:image", content: SHARE_IMAGE },
		],
	}),
	component: HomePage,
});

function HomePage() {
	return (
		<main className="min-h-screen bg-flow-canvas text-flow-text">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
				<Link to="/" className="flex items-center gap-3">
					<span className="grid size-9 place-items-center rounded-xl bg-flow-primary text-lg font-bold text-white">
						✓
					</span>

					<span className="text-xl font-bold tracking-tight">flow</span>
				</Link>

				<div className="flex items-center gap-3">
					<a
						href="#features"
						className="hidden text-sm font-medium text-flow-text-secondary transition hover:text-flow-text sm:block"
					>
						How it works
					</a>

					<Toggle />

					<div>
						<AuthActions />
					</div>
				</div>
			</nav>

			<section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:px-10 lg:pt-32">
				<div>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-flow-primary-soft px-3 py-2 text-xs font-semibold text-flow-primary-hover">
						<span className="size-2 rounded-full bg-flow-primary" />A calmer way
						to get things done
					</div>

					<h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-display">
						Make space for
						<br />
						what matters.
					</h1>

					<p className="mt-7 max-w-xl text-body-lg text-flow-text-secondary">
						Flow turns scattered tasks into a clear, focused plan—so every day
						feels lighter and every next step is obvious.
					</p>

					<div className="mt-2 flex flex-wrap gap-3">
						<Show
							when="signed-in"
							fallback={
								<div className="mt-9 flex flex-wrap gap-3">
									<SignUpButton mode="modal">
										<button
											type="button"
											className="flow-button-primary flow-focus-ring rounded-xl px-5 py-3.5 text-sm font-semibold"
										>
											Get started →
										</button>
									</SignUpButton>

									<SignInButton mode="modal">
										<button
											type="button"
											className="flow-focus-ring rounded-xl border border-flow-border bg-flow-surface px-5 py-3.5 text-sm font-semibold text-flow-text transition hover:border-flow-border-strong"
										>
											Sign in
										</button>
									</SignInButton>
								</div>
							}
						>
							<Link
								to="/dashboard"
								className="flow-button-primary flow-focus-ring mt-9 inline-block rounded-xl px-5 py-3.5 text-sm font-semibold"
							>
								Go to Dashboard →
							</Link>
						</Show>
					</div>

					<p className="mt-6 text-xs font-semibold tracking-wide text-flow-text-subtle">
						FREE TO START · NO CREDIT CARD · BUILT FOR FOCUS
					</p>
				</div>

				<TaskPreview />
			</section>

			<section
				id="features"
				className="mx-auto grid max-w-7xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:px-10"
			>
				<FeatureCard
					title="Clear priorities"
					description="Know what matters now."
				/>
				<FeatureCard
					title="Gentle focus"
					description="Move one step at a time."
				/>
			</section>
		</main>
	);
}

function TaskPreview() {
	return (
		<div className="flow-card relative overflow-hidden bg-flow-primary-wash p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<p className="text-xs font-bold tracking-widest text-flow-text-muted">
						TODAY · 4 TASKS
					</p>
					<h2 className="mt-3 text-2xl font-bold">Good morning, Aisha.</h2>
				</div>

				<div className="rounded-xl bg-flow-primary px-3 py-2 text-sm font-bold text-white">
					87%
				</div>
			</div>

			<div className="mb-5 h-2 overflow-hidden rounded-full bg-flow-progress-track">
				<div className="h-full w-1/2 rounded-full bg-flow-primary" />
			</div>

			<div className="space-y-3">
				<Task title="Plan the client workshop" />
				<Task title="Send design handoff" completed />
				<Task title="Book dentist appointment" />
			</div>
		</div>
	);
}

function Task({
	title,
	completed = false,
}: {
	title: string;
	completed?: boolean;
}) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-flow-border bg-flow-surface-raised p-4">
			<span
				className={`grid size-5 place-items-center rounded-md border text-xs ${
					completed
						? "border-flow-primary bg-flow-primary text-white"
						: "border-flow-border-strong"
				}`}
			>
				{completed ? "✓" : ""}
			</span>

			<span className="text-sm font-semibold text-flow-text">{title}</span>
		</div>
	);
}

function FeatureCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flow-card p-5">
			<div className="mb-4 grid size-8 place-items-center rounded-full bg-flow-primary-soft text-flow-primary">
				✓
			</div>

			<h2 className="font-semibold">{title}</h2>
			<p className="mt-1 text-sm text-flow-text-secondary">{description}</p>
		</div>
	);
}
