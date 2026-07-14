import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import ClerkProvider from "../integrations/clerk/provider";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		title: "Todo Flow",
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "description",
				content:
					"Flow helps you organize tasks into a calm, focused daily plan.",
			},
			{ name: "application-name", content: "Flow" },
			{ name: "color-scheme", content: "light dark" },
			{ name: "theme-color", content: "#0da678" },
			{ name: "referrer", content: "strict-origin-when-cross-origin" },
		],
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "shortcut icon", href: "/favicon.ico" },
			{ rel: "manifest", href: "/manifest.json" },
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrap must run before hydration
					dangerouslySetInnerHTML={{
						__html: `
							(() => {
								try {
									const savedTheme = localStorage.getItem("flow-theme");
									const darkThemes = [
										"cyan-night",
										"ruby-night",
										"gold-night",
										"rose-night",
										"violet-night",
									];
									const validThemes = ["green", "azure", ...darkThemes];
									const theme = validThemes.includes(savedTheme)
										? savedTheme
										: savedTheme === "dark"
											? "cyan-night"
											: "green";

									document.documentElement.dataset.flowTheme = theme;
									document.documentElement.classList.toggle("dark", darkThemes.includes(theme));
								} catch {
									// Fall back to light mode if storage is unavailable.
								}
							})();
						`,
					}}
				/>
			</head>
			<body>
				<ClerkProvider>
					{children}
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				</ClerkProvider>
				<Scripts />
			</body>
		</html>
	);
}
