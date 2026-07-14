import { describe, expect, it } from "vitest";
import {
	filterTodos,
	filterTodosByDueDate,
	getGreeting,
} from "./todo.utils.ts";
import type { Todo } from "./types.ts";

const todos: Todo[] = [
	{
		id: "1",
		title: "Work",
		tag: "work",
		dueDate: "2026-07-14",
		completed: false,
	},
	{
		id: "2",
		title: "Today",
		tag: "work",
		dueDate: "2026-07-15",
		completed: true,
	},
	{
		id: "3",
		title: "Workout",
		tag: "workout",
		dueDate: "2026-07-21",
		completed: false,
	},
];

describe("getGreeting", () => {
	it("handles morning, afternoon, and evening boundaries", () => {
		expect(getGreeting(0)).toBe("Good morning");
		expect(getGreeting(11)).toBe("Good morning");
		expect(getGreeting(12)).toBe("Good afternoon");
		expect(getGreeting(17)).toBe("Good afternoon");
		expect(getGreeting(18)).toBe("Good evening");
		expect(getGreeting(23)).toBe("Good evening");
	});

	it("rejects invalid hours", () => {
		expect(() => getGreeting(-1)).toThrow(RangeError);
		expect(() => getGreeting(24)).toThrow(RangeError);
	});
});

describe("filterTodosByDueDate", () => {
	const today = new Date(2026, 6, 14);

	it("filters today, tomorrow, and the next seven days", () => {
		expect(
			filterTodosByDueDate(todos, "today", today).map((todo) => todo.id),
		).toEqual(["1"]);
		expect(
			filterTodosByDueDate(todos, "tomorrow", today).map((todo) => todo.id),
		).toEqual(["2"]);
		expect(
			filterTodosByDueDate(todos, "next7Days", today).map((todo) => todo.id),
		).toEqual(["1", "2", "3"]);
	});

	it("handles a date range that crosses into a new year", () => {
		const yearBoundaryTodos: Todo[] = [
			{
				id: "december",
				title: "December task",
				tag: "work",
				dueDate: "2026-12-31",
				completed: false,
			},
			{
				id: "january",
				title: "January task",
				tag: "personal",
				dueDate: "2027-01-02",
				completed: false,
			},
			{
				id: "unscheduled",
				title: "Unscheduled task",
				tag: "work",
				dueDate: "",
				completed: false,
			},
		];

		expect(
			filterTodosByDueDate(
				yearBoundaryTodos,
				"next7Days",
				new Date(2026, 11, 30),
			).map((todo) => todo.id),
		).toEqual(["december", "january"]);
	});
});

describe("filterTodos", () => {
	it("returns all todos without mutating the source", () => {
		const result = filterTodos(todos, "all");
		expect(result).toEqual(todos);
		expect(result).toBe(todos);
	});

	it("filters completed todos and tags", () => {
		expect(filterTodos(todos, "completed").map((todo) => todo.id)).toEqual([
			"2",
		]);
		expect(filterTodos(todos, "workout").map((todo) => todo.id)).toEqual(["3"]);
		expect(filterTodos([], "personal")).toEqual([]);
	});
});
