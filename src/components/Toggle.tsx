import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const Toggle = () => {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const current = document.documentElement.classList.contains("dark")
			? "dark"
			: "light";

		setTheme(current);
	}, []);

	function toggleTheme() {
		const nextTheme = theme === "dark" ? "light" : "dark";

		document.documentElement.classList.toggle("dark", nextTheme === "dark");

		localStorage.setItem("flow-theme", nextTheme);
		setTheme(nextTheme);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
			aria-pressed={theme === "dark"}
			className="flow-focus-ring rounded-full border border-flow-border bg-flow-surface px-2 py-2 text-flow-text cursor-pointer"
		>
			{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	);
};
