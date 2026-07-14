import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TodoDialog } from "./TodoDialog.tsx";

describe("TodoDialog integration", () => {
	beforeEach(() => {
		vi.stubGlobal("crypto", { randomUUID: () => "todo-123" });
	});

	it("submits a scheduled todo and closes after a successful save", async () => {
		const onCreate = vi.fn().mockResolvedValue(undefined);
		render(<TodoDialog onCreate={onCreate} defaultDueDate="2026-07-15" />);

		fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
		fireEvent.change(screen.getByLabelText("Title"), {
			target: { value: "Prepare weekly review" },
		});
		fireEvent.click(screen.getByLabelText("Due date"));
		fireEvent.click(screen.getByRole("button", { name: /\b16\b/ }));
		fireEvent.click(screen.getByRole("button", { name: "Submit" }));

		await waitFor(() => {
			expect(onCreate).toHaveBeenCalledWith({
				id: "todo-123",
				title: "Prepare weekly review",
				description: undefined,
				tag: "today",
				dueDate: "2026-07-16",
				completed: false,
			});
		});

		await waitFor(() => {
			expect(
				screen.queryByRole("heading", { name: "Add a new todo" }),
			).not.toBeInTheDocument();
		});
	});

	it("keeps the dialog open and shows a useful error when saving fails", async () => {
		const onCreate = vi.fn().mockRejectedValue(new Error("PERMISSION_DENIED"));
		render(<TodoDialog onCreate={onCreate} defaultDueDate="2026-07-15" />);

		fireEvent.click(screen.getByRole("button", { name: /add todo/i }));
		fireEvent.change(screen.getByLabelText("Title"), {
			target: { value: "Blocked task" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Submit" }));

		await waitFor(() => {
			expect(
				screen.getByText(/Firestore is not enabled for this project/i),
			).toBeInTheDocument();
		});
		expect(
			screen.getByRole("heading", { name: "Add a new todo" }),
		).toBeInTheDocument();
	});
});
