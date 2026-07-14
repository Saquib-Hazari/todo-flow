export type TodoTags = "work" | "personal" | "workout";

export type Todo = {
	id: string;
	title: string;
	description?: string;
	tag: TodoTags;
	dueDate: string;
	completed: boolean;
};
