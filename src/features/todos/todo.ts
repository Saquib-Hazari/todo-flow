import type { Todo, TodoTags } from "./types.ts";

const STORAGE_KEY = "flow-todos";

type TodoInput = Pick<Todo, "title" | "description" | "tag" | "dueDate">;
type StoredTodo = Omit<Todo, "tag"> & { tag: TodoTags | "today" };

function parseTodo(value: unknown): Todo | null {
	if (!value || typeof value !== "object") return null;
	const todo = value as Partial<StoredTodo>;
	const isValidTodo =
		typeof todo.id === "string" &&
		typeof todo.title === "string" &&
		typeof todo.dueDate === "string" &&
		typeof todo.completed === "boolean" &&
		["work", "today", "personal", "workout"].includes(todo.tag as string);

	if (!isValidTodo) return null;
	const storedTodo = todo as StoredTodo;

	return {
		id: storedTodo.id,
		title: storedTodo.title,
		description:
			typeof storedTodo.description === "string"
				? storedTodo.description
				: undefined,
		tag: storedTodo.tag === "today" ? "work" : storedTodo.tag,
		dueDate: storedTodo.dueDate,
		completed: storedTodo.completed,
	};
}

function readTodos(): Todo[] {
	if (typeof window === "undefined") return [];

	try {
		const storedTodos = window.localStorage.getItem(STORAGE_KEY);
		if (!storedTodos) return [];
		const parsedTodos: unknown = JSON.parse(storedTodos);
		return Array.isArray(parsedTodos)
			? parsedTodos.flatMap((todo) => {
					const parsedTodo = parseTodo(todo);
					return parsedTodo ? [parsedTodo] : [];
				})
			: [];
	} catch {
		return [];
	}
}

function writeTodos(todos: Todo[]) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createId() {
	return typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function listTodos() {
	return readTodos();
}

export async function createTodo({ data }: { data: TodoInput }) {
	const todo: Todo = {
		id: createId(),
		title: data.title.trim(),
		description: data.description?.trim() || undefined,
		tag: data.tag,
		dueDate: data.dueDate,
		completed: false,
	};

	writeTodos([...readTodos(), todo]);
	return todo;
}

export async function deleteTodo({ data: todoId }: { data: string }) {
	writeTodos(readTodos().filter((todo) => todo.id !== todoId));
}

export async function updateTodoCompletion({
	data,
}: {
	data: { id: string; completed: boolean };
}) {
	writeTodos(
		readTodos().map((todo) =>
			todo.id === data.id ? { ...todo, completed: data.completed } : todo,
		),
	);
}

export async function clearTodos() {
	writeTodos([]);
}
