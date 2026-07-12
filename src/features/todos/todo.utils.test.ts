import { describe, expect, it } from "vitest";
import { filterTodos, getGreeting } from "./todo.utils.ts";
import type { Todo } from "./types.ts";

const todos: Todo[] = [
	{ id: "1", title: "Work", tag: "work", completed: false },
	{ id: "2", title: "Today", tag: "today", completed: true },
	{ id: "3", title: "Workout", tag: "workout", completed: false },
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

describe("filterTodos", () => {
	it("returns all todos without mutating the source", () => {
		const result = filterTodos(todos, "all");
		expect(result).toEqual(todos);
		expect(result).toBe(todos);
	});

	it("filters completed todos and tags", () => {
		expect(filterTodos(todos, "completed").map((todo) => todo.id)).toEqual(["2"]);
		expect(filterTodos(todos, "workout").map((todo) => todo.id)).toEqual(["3"]);
		expect(filterTodos([], "personal")).toEqual([]);
	});
});
