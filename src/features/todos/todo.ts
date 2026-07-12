import { createServerFn } from "@tanstack/react-start";

export const createTodo = createServerFn()
	.validator(
		(input: {
			title: string;
			description?: string;
			tag: "work" | "today" | "personal" | "workout";
		}) => input,
	)
	.handler(async ({ data }) => {
		const { createTodoRecord } = await import("./todo.server");
		return createTodoRecord(data);
	});

export const listTodos = createServerFn().handler(async () => {
		const { listTodoRecords } = await import("./todo.server");
		return listTodoRecords();
});

export const deleteTodo = createServerFn()
	.validator((todoId: string) => todoId)
	.handler(async ({ data }) => {
		const { deleteTodoRecord } = await import("./todo.server");
		return deleteTodoRecord(data);
	});

export const clearTodos = createServerFn().handler(async () => {
		const { clearTodoRecords } = await import("./todo.server");
		return clearTodoRecords();
	});
