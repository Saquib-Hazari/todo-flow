import type { Todo } from "./types.ts";

export type TodoFilter = "all" | "today" | "completed" | "personal" | "work" | "workout";

export function getGreeting(hour: number) {
	if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
		throw new RangeError("Hour must be an integer from 0 through 23");
	}
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

export function filterTodos(todos: Todo[], filter: TodoFilter) {
	if (filter === "all") return todos;
	if (filter === "completed") return todos.filter((todo) => todo.completed);
	if (filter === "today") return todos.filter((todo) => todo.tag === "today");
	return todos.filter((todo) => todo.tag === filter);
}
