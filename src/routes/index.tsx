import { Show, SignInButton, SignUpButton } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	CalendarDays,
	ChartNoAxesCombined,
	ListTodo,
	Sparkles,
} from "lucide-react";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { AuthActions } from "../components/AuthAction.tsx";
import { ThemeMenu } from "../components/ThemeMenu.tsx";

const SITE_URL = (
	import.meta.env.VITE_APP_URL ?? "https://todo-flow.vercel.app"
).replace(/\/$/, "");
const SHARE_IMAGE = `${SITE_URL}/homepage.png`;

export const Route = createFileRoute("/")({
	head: () => ({
		title: "Flow — A calmer way to get things done",
		meta: [
			{
				name: "description",
				content: "Turn scattered tasks into a clear, focused plan with Flow.",
			},
			{ property: "og:site_name", content: "Flow" },
			{
				property: "og:title",
				content: "Flow — A calmer way to get things done",
			},
			{
				property: "og:description",
				content: "Turn scattered tasks into a clear, focused plan with Flow.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:image", content: SHARE_IMAGE },
			{ property: "og:image:width", content: "3360" },
			{ property: "og:image:height", content: "2100" },
			{ property: "og:image:alt", content: "Flow task management app" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Flow — A calmer way to get things done",
			},
			{
				name: "twitter:description",
				content: "Turn scattered tasks into a clear, focused plan with Flow.",
			},
			{ name: "twitter:image", content: SHARE_IMAGE },
		],
		links: [{ rel: "canonical", href: SITE_URL }],
	}),
	component: HomePage,
});

function HomePage() {
	const pageRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const page = pageRef.current;
		if (
			!page ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		gsap.registerPlugin(ScrollTrigger);
		const context = gsap.context(() => {
			gsap.from("[data-flow-nav]", {
				y: -18,
				opacity: 0,
				duration: 0.55,
				ease: "power2.out",
			});
			gsap.from("[data-flow-hero-copy] > *", {
				y: 24,
				opacity: 0,
				stagger: 0.1,
				delay: 0.12,
				duration: 0.65,
				ease: "power3.out",
			});
			gsap.from("[data-flow-preview]", {
				x: 34,
				y: 12,
				opacity: 0,
				delay: 0.25,
				duration: 0.8,
				ease: "power3.out",
			});
			gsap.utils
				.toArray<HTMLElement>("[data-flow-reveal]")
				.forEach((element) => {
					gsap.from(element, {
						y: 28,
						opacity: 0,
						duration: 0.65,
						ease: "power2.out",
						scrollTrigger: {
							trigger: element,
							start: "top 86%",
						},
					});
				});
		}, page);

		return () => context.revert();
	}, []);

	return (
		<main
			ref={pageRef}
			className="min-h-screen overflow-hidden bg-flow-canvas text-flow-text"
		>
			<nav
				data-flow-nav
				className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"
			>
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

					<ThemeMenu />

					<div>
						<AuthActions />
					</div>
				</div>
			</nav>

			<section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:px-10 lg:pt-32">
				<div data-flow-hero-copy>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-flow-primary-soft px-3 py-2 text-xs font-semibold text-flow-primary-hover">
						<Sparkles size={14} aria-hidden="true" />A calmer way to get things
						done
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

				<div data-flow-preview>
					<TaskPreview />
				</div>
			</section>

			<section
				id="features"
				data-flow-reveal
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

			<section
				data-flow-reveal
				className="mx-auto max-w-7xl px-6 pb-28 pt-4 text-center lg:px-10"
			>
				<p className="text-sm font-bold uppercase tracking-[0.2em] text-flow-primary">
					Built for real life
				</p>
				<h2 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
					Your tasks, calendar, and progress—finally in one clear place.
				</h2>
				<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-flow-text-secondary">
					Capture the small things before they slip away, plan the week with
					confidence, and use your dashboard to build a rhythm that lasts.
				</p>
				<a
					href="#how-it-works"
					className="flow-button-primary flow-focus-ring mt-9 inline-flex rounded-xl px-5 py-3.5 text-sm font-semibold"
				>
					See how Flow works →
				</a>
			</section>

			<section
				id="how-it-works"
				data-flow-reveal
				className="mx-auto max-w-7xl px-6 pb-24 lg:px-10"
			>
				<div className="rounded-3xl border border-flow-border bg-flow-surface-soft p-7 sm:p-10">
					<p className="text-sm font-bold uppercase tracking-widest text-flow-primary">
						How Flow works
					</p>
					<h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
						A simple system for a calmer day.
					</h2>
					<div className="mt-10 grid gap-5 md:grid-cols-3">
						<Step
							number="01"
							icon={<ListTodo size={20} />}
							title="Capture the task"
							description="Add what needs doing and give it a meaningful category."
						/>
						<Step
							number="02"
							icon={<CalendarDays size={20} />}
							title="Plan your time"
							description="Schedule it for today, tomorrow, or a date that works for you."
						/>
						<Step
							number="03"
							icon={<ChartNoAxesCombined size={20} />}
							title="See your progress"
							description="Use your dashboard to spot momentum and keep your focus."
						/>
					</div>
				</div>
			</section>

			<section
				id="faq"
				data-flow-reveal
				className="mx-auto max-w-3xl px-6 pb-24 lg:px-10"
			>
				<div className="text-center">
					<p className="text-sm font-bold uppercase tracking-widest text-flow-primary">
						FAQ
					</p>
					<h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
						A few helpful answers.
					</h2>
				</div>
				<div className="mt-9 space-y-3">
					<Faq
						question="Is Flow free to use?"
						answer="Yes. Flow is free to start and built to keep task planning simple."
					/>
					<Faq
						question="Can I plan tasks for future dates?"
						answer="Absolutely. Use the calendar or date picker to schedule tasks for tomorrow, next week, or any date you choose."
					/>
					<Faq
						question="Where is my task data stored?"
						answer="Your tasks are stored safely in your browser's local storage, so Flow stays fast and frontend-only."
					/>
				</div>
			</section>

			<footer className="border-t border-flow-border bg-flow-surface">
				<div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
					<Link to="/" className="flex items-center gap-2 font-bold">
						<span className="grid size-7 place-items-center rounded-lg bg-flow-primary text-sm text-white">
							✓
						</span>
						flow
					</Link>
					<p className="text-sm text-flow-text-secondary">
						Plan with clarity. Make room for what matters.
					</p>
					<div className="flex gap-4 text-sm font-medium text-flow-text-secondary">
						<a
							href="#how-it-works"
							className="transition hover:text-flow-primary"
						>
							How it works
						</a>
						<a href="#faq" className="transition hover:text-flow-primary">
							FAQ
						</a>
					</div>
				</div>
			</footer>
		</main>
	);
}

function TaskPreview() {
	return (
		<div className="flow-card relative overflow-hidden bg-flow-primary-wash p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
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

function Step({
	number,
	icon,
	title,
	description,
}: {
	number: string;
	icon: ReactNode;
	title: string;
	description: string;
}) {
	return (
		<article className="rounded-2xl border border-flow-border bg-flow-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-flow-primary">
			<div className="flex items-center justify-between">
				<span className="grid size-10 place-items-center rounded-xl bg-flow-primary-soft text-flow-primary">
					{icon}
				</span>
				<span className="text-xs font-bold tracking-widest text-flow-text-muted">
					{number}
				</span>
			</div>
			<h3 className="mt-6 text-lg font-bold">{title}</h3>
			<p className="mt-2 text-sm leading-6 text-flow-text-secondary">
				{description}
			</p>
		</article>
	);
}

function Faq({ question, answer }: { question: string; answer: string }) {
	return (
		<details className="group rounded-2xl border border-flow-border bg-flow-surface px-5 py-4 transition hover:border-flow-border-strong">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
				<span>{question}</span>
				<span className="text-xl text-flow-primary transition-transform duration-300 ease-out group-open:rotate-45">
					+
				</span>
			</summary>
			<div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-open:grid-rows-[1fr] group-open:opacity-100">
				<div className="overflow-hidden">
					<p className="max-w-2xl pt-3 text-sm leading-6 text-flow-text-secondary">
						{answer}
					</p>
				</div>
			</div>
		</details>
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
