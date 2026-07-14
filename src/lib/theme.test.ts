import { beforeEach, describe, expect, it } from "vitest";
import { applyTheme, getSavedTheme } from "./theme.ts";

describe("theme persistence", () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.classList.remove("dark");
		document.documentElement.removeAttribute("data-flow-theme");
	});

	it("applies and saves a light theme", () => {
		applyTheme("azure");

		expect(document.documentElement.dataset.flowTheme).toBe("azure");
		expect(document.documentElement).not.toHaveClass("dark");
		expect(localStorage.getItem("flow-theme")).toBe("azure");
	});

	it("applies and saves a dark theme", () => {
		applyTheme("gold-night");

		expect(document.documentElement.dataset.flowTheme).toBe("gold-night");
		expect(document.documentElement).toHaveClass("dark");
		expect(getSavedTheme()).toBe("gold-night");
	});

	it("migrates the legacy dark preference and ignores invalid values", () => {
		localStorage.setItem("flow-theme", "dark");
		expect(getSavedTheme()).toBe("cyan-night");

		localStorage.setItem("flow-theme", "not-a-theme");
		expect(getSavedTheme()).toBe("green");
	});
});
