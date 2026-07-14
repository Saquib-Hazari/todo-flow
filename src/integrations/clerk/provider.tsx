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
					colorPrimary: "#10b981",
					colorPrimaryForeground: "#ffffff",
					colorBackground: "#0d1b16",
					colorForeground: "#f5fbf8",
					colorMutedForeground: "#91a49c",
					colorInput: "#10211a",
					colorInputForeground: "#f5fbf8",
					colorBorder: "#20372e",
					colorNeutral: "#234136",
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
						"!opacity-100 !text-[#f5fbf8] font-semibold",
					socialButtonsProviderIcon: "!opacity-100",
					footer: "hidden",
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
}
