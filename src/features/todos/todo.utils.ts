import type { Todo } from "./types.ts";

export type TodoFilter =
	| "all"
	| "today"
	| "completed"
	| "personal"
	| "work"
	| "workout";
export type DueDateFilter = "all" | "today" | "tomorrow" | "next7Days";

export function getLocalDateKey(date = new Date()) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

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
	if (filter === "today") {
		return todos.filter((todo) => todo.dueDate === getLocalDateKey());
	}
	return todos.filter((todo) => todo.tag === filter);
}

export function filterTodosByDueDate(
	todos: Todo[],
	filter: DueDateFilter,
	today = new Date(),
) {
	if (filter === "all") return todos;

	const startDate = new Date(today);
	startDate.setHours(0, 0, 0, 0);
	const startKey = getLocalDateKey(startDate);

	if (filter === "today") {
		return todos.filter((todo) => todo.dueDate === startKey);
	}

	const tomorrowDate = new Date(startDate);
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
	const tomorrowKey = getLocalDateKey(tomorrowDate);

	if (filter === "tomorrow") {
		return todos.filter((todo) => todo.dueDate === tomorrowKey);
	}

	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + 7);
	const endKey = getLocalDateKey(endDate);

	return todos.filter(
		(todo) => todo.dueDate >= tomorrowKey && todo.dueDate <= endKey,
	);
}
