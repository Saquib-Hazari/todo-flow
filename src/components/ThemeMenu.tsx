import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
	applyTheme,
	getSavedTheme,
	type ThemeId,
	themeOptions,
} from "../lib/theme.ts";

export function ThemeMenu() {
	const [theme, setTheme] = useState<ThemeId>("green");
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTheme(getSavedTheme());
	}, []);

	useEffect(() => {
		function closeOnOutsideClick(event: MouseEvent) {
			if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
		}

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}

		document.addEventListener("mousedown", closeOnOutsideClick);
		document.addEventListener("keydown", closeOnEscape);
		return () => {
			document.removeEventListener("mousedown", closeOnOutsideClick);
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, []);

	function selectTheme(nextTheme: ThemeId) {
		applyTheme(nextTheme);
		setTheme(nextTheme);
		setOpen(false);
	}

	return (
		<div ref={menuRef} className="flow-theme-menu">
			<button
				type="button"
				onClick={() => setOpen((current) => !current)}
				aria-expanded={open}
				aria-haspopup="menu"
				className="flow-theme-trigger flow-focus-ring"
			>
				<Palette size={17} />
				<span>Theme</span>
				<ChevronDown
					size={15}
					className={
						open ? "rotate-180 transition-transform" : "transition-transform"
					}
				/>
			</button>

			{open && (
				<div
					className="flow-theme-dropdown"
					role="dialog"
					aria-label="Choose a theme"
				>
					<p>Choose your theme</p>
					<fieldset className="flow-theme-options">
						<legend className="sr-only">Theme options</legend>
						{themeOptions.map((option) => (
							<button
								key={option.id}
								type="button"
								aria-pressed={theme === option.id}
								onClick={() => selectTheme(option.id)}
								className={
									theme === option.id
										? "flow-theme-option is-selected"
										: "flow-theme-option"
								}
							>
								<span
									className="flow-theme-swatch"
									data-theme-swatch={option.id}
								/>
								<span className="flow-theme-option-copy">
									<strong>{option.label}</strong>
									<small>{option.mode}</small>
								</span>
								{theme === option.id && <Check size={15} />}
							</button>
						))}
					</fieldset>
				</div>
			)}
		</div>
	);
}
