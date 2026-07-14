import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { DatePicker } from "../../components/DatePicker.tsx";
import { getLocalDateKey } from "./todo.utils.ts";
import type { Todo, TodoTags } from "./types.ts";

type Props = {
	onCreate: (todo: Todo) => Promise<void> | void;
	defaultTag?: TodoTags;
	defaultDueDate?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export function TodoDialog({
	onCreate,
	defaultTag = "today",
	defaultDueDate = getLocalDateKey(),
	open: controlledOpen,
	onOpenChange,
}: Props) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tag, setTag] = useState<TodoTags>(defaultTag);
	const [dueDate, setDueDate] = useState(defaultDueDate);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const open = controlledOpen ?? uncontrolledOpen;

	useEffect(() => {
		if (controlledOpen) {
			setTag(defaultTag);
			setDueDate(defaultDueDate);
		}
	}, [controlledOpen, defaultDueDate, defaultTag]);

	function handleOpenChange(nextOpen: boolean) {
		if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
		if (nextOpen) {
			setTag(defaultTag);
			setDueDate(defaultDueDate);
		}
		onOpenChange?.(nextOpen);
	}

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const cleanTitle = title.trim();

		if (!cleanTitle) return;

		setError(null);
		setSaving(true);

		try {
			await onCreate({
				id: crypto.randomUUID(),
				title: cleanTitle,
				description: description.trim() || undefined,
				tag,
				dueDate,
				completed: false,
			});

			setTitle("");
			setDescription("");
			setTag(defaultTag);
			handleOpenChange(false);
		} catch (cause) {
			const message = cause instanceof Error ? cause.message : "";
			setError(
				message.includes("PERMISSION_DENIED") ||
					message.includes("firestore.googleapis.com")
					? "Todos cannot be saved yet because Firestore is not enabled for this project."
					: "Could not save this todo. Please try again.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="flow-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
				>
					+ Add todo
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-flow-border bg-flow-surface p-6 text-flow-text shadow-2xl">
					<Dialog.Title className="text-xl font-bold">
						Add a new todo
					</Dialog.Title>

					<Dialog.Description className="mt-1 text-sm text-flow-text-secondary">
						Keep it clear, focused, and easy to complete.
					</Dialog.Description>

					<form onSubmit={submit} className="mt-6 space-y-5">
						{error && (
							<p className="rounded-xl bg-red-300 px-3 py-2 text-sm text-red-800">
								{error}
							</p>
						)}
						<div>
							<Label.Root
								htmlFor="todo-title"
								className="mb-2 block text-sm font-semibold"
							>
								Title
							</Label.Root>

							<input
								id="todo-title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="e.g. Send design handoff"
								required
								className="w-full rounded-xl border border-flow-border bg-flow-surface-raised px-4 py-3 text-sm outline-none focus:border-flow-primary"
							/>
						</div>

						<div>
							<Label.Root
								htmlFor="todo-description"
								className="mb-2 block text-sm font-semibold"
							>
								Description{" "}
								<span className="font-normal text-flow-text-muted">
									(optional)
								</span>
							</Label.Root>

							<textarea
								id="todo-description"
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								placeholder="Add a little context..."
								rows={4}
								className="w-full resize-none rounded-xl border border-flow-border bg-flow-surface-raised px-4 py-3 text-sm outline-none focus:border-flow-primary"
							/>
						</div>

						<div>
							<Label.Root
								htmlFor="todo-due-date"
								className="mb-2 block text-sm font-semibold"
							>
								Due date
							</Label.Root>

							<DatePicker
								id="todo-due-date"
								value={dueDate}
								onChange={setDueDate}
							/>
						</div>

						<div>
							<Label.Root className="mb-2 block text-sm font-semibold">
								Tag
							</Label.Root>

							<Select.Root
								value={tag}
								onValueChange={(value) => setTag(value as TodoTags)}
							>
								<Select.Trigger
									aria-label="Tag"
									className="flex w-full items-center justify-between rounded-xl border border-flow-border bg-flow-surface-raised px-4 py-3 text-sm"
								>
									<Select.Value />
									<Select.Icon>⌄</Select.Icon>
								</Select.Trigger>

								<Select.Portal>
									<Select.Content className="z-[60] overflow-hidden rounded-xl border border-flow-border bg-flow-surface p-1 shadow-xl">
										<Select.Viewport>
											{(
												["work", "today", "personal", "workout"] as TodoTags[]
											).map((item) => (
												<Select.Item
													key={item}
													value={item}
													className="cursor-pointer rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-flow-primary-soft"
												>
													<Select.ItemText>
														{item[0].toUpperCase() + item.slice(1)}
													</Select.ItemText>
												</Select.Item>
											))}
										</Select.Viewport>
									</Select.Content>
								</Select.Portal>
							</Select.Root>
						</div>

						<div className="flex justify-end gap-3">
							<Dialog.Close asChild>
								<button
									type="button"
									className="rounded-xl border border-flow-border px-4 py-2.5 text-sm font-semibold"
								>
									Cancel
								</button>
							</Dialog.Close>

							<button
								type="submit"
								disabled={saving}
								className="flow-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
							>
								{saving ? "Saving…" : "Submit"}
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
