export const themeOptions = [
	{ id: "green", label: "Evergreen", mode: "light" },
	{ id: "azure", label: "Azure", mode: "light" },
	{ id: "cyan-night", label: "Cyan Night", mode: "dark" },
	{ id: "ruby-night", label: "Ruby Night", mode: "dark" },
	{ id: "gold-night", label: "Golden Night", mode: "dark" },
	{ id: "rose-night", label: "Rose Night", mode: "dark" },
	{ id: "violet-night", label: "Violet Night", mode: "dark" },
] as const;

export type ThemeId = (typeof themeOptions)[number]["id"];

const fallbackTheme: ThemeId = "green";

export function isThemeId(value: string | null): value is ThemeId {
	return themeOptions.some((theme) => theme.id === value);
}

export function applyTheme(theme: ThemeId) {
	const option = themeOptions.find((item) => item.id === theme);
	if (!option) return;

	document.documentElement.dataset.flowTheme = theme;
	document.documentElement.classList.toggle("dark", option.mode === "dark");
	localStorage.setItem("flow-theme", theme);
	window.dispatchEvent(
		new CustomEvent<ThemeId>("flow-theme-change", { detail: theme }),
	);
}

export function getSavedTheme(): ThemeId {
	const savedTheme = localStorage.getItem("flow-theme");
	if (isThemeId(savedTheme)) return savedTheme;
	if (savedTheme === "dark") return "cyan-night";
	return fallbackTheme;
}
