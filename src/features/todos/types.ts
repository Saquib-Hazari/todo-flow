export type TodoTags = "work" | "today" | "personal" | "workout";

export type Todo = {
	id: string;
	title: string;
	description?: string;
	tag: TodoTags;
	completed: boolean;
};
