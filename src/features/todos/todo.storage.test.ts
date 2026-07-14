import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	clearTodos,
	createTodo,
	deleteTodo,
	listTodos,
	updateTodoCompletion,
} from "./todo.ts";

describe("local todo storage", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal("crypto", { randomUUID: () => "local-todo-id" });
	});

	it("creates, updates, deletes, and clears todos in localStorage", async () => {
		const todo = await createTodo({
			data: {
				title: "  Plan deployment  ",
				tag: "work",
				dueDate: "2026-07-15",
			},
		});

		expect(todo).toMatchObject({
			id: "local-todo-id",
			title: "Plan deployment",
			completed: false,
		});
		expect(await listTodos()).toEqual([todo]);

		await updateTodoCompletion({
			data: { id: todo.id, completed: true },
		});
		expect((await listTodos())[0]?.completed).toBe(true);

		await deleteTodo({ data: todo.id });
		expect(await listTodos()).toEqual([]);

		await createTodo({
			data: { title: "Clear me", tag: "work", dueDate: "2026-07-16" },
		});
		await clearTodos();
		expect(await listTodos()).toEqual([]);
	});

	it("recovers safely from invalid stored data", async () => {
		localStorage.setItem("flow-todos", "not valid JSON");
		expect(await listTodos()).toEqual([]);
	});
});
