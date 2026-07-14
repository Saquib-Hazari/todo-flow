import { ClerkProvider } from "@clerk/tanstack-react-start";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

export default function AppClerkProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			publishableKey={PUBLISHABLE_KEY}
			afterSignOutUrl="/"
			appearance={{
				variables: {
					colorPrimary: "var(--flow-primary)",
					colorPrimaryForeground: "var(--flow-primary-contrast)",
					colorBackground: "var(--flow-surface)",
					colorForeground: "var(--flow-text)",
					colorMutedForeground: "var(--flow-text-secondary)",
					colorInput: "var(--flow-surface-raised)",
					colorInputForeground: "var(--flow-text)",
					colorBorder: "var(--flow-border)",
					colorNeutral: "var(--flow-border-strong)",
					borderRadius: "0.75rem",
					fontFamily: "inherit",
				},
				elements: {
					rootBox: "w-full",
					card: "w-full max-w-md rounded-2xl border border-flow-border bg-flow-surface p-2 shadow-xl",
					headerTitle: "text-flow-text",
					headerSubtitle: "text-flow-text-secondary",
					formFieldLabel: "font-semibold text-flow-text",
					formFieldInput:
						"rounded-xl border-flow-border bg-flow-surface-raised focus:border-flow-primary focus:ring-flow-primary",
					formButtonPrimary:
						"rounded-xl bg-flow-primary font-semibold hover:bg-flow-primary/90",
					socialButtonsBlockButton:
						"!opacity-100 rounded-xl border !border-flow-border-strong !bg-flow-surface-raised !text-flow-text hover:bg-flow-surface-soft",
					socialButtonsBlockButtonText:
						"!opacity-100 !text-flow-text font-semibold",
					socialButtonsProviderIcon: "!opacity-100",
					userButtonPopoverCard:
						"overflow-hidden rounded-2xl !border-flow-border !bg-flow-surface !shadow-xl",
					userButtonPopoverMain: "p-2",
					userButtonPopoverActionButton:
						"rounded-xl !text-flow-text hover:!bg-flow-surface-soft",
					userButtonPopoverActionButton__signOut:
						"!text-flow-danger hover:!bg-flow-primary-soft",
					userButtonPopoverActionButtonIcon: "!text-flow-primary",
					footer: "hidden",
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
}
