import { useUser } from "@clerk/tanstack-react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Menu, Trash2 } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Calendar from "../components/Calendar.tsx";
import { Sidebar } from "../components/SideBar.tsx";
import { ThemeMenu } from "../components/ThemeMenu.tsx";
import { TodoDateFilter } from "../features/todos/TodoDateFilter.tsx";
import { TodoDialog } from "../features/todos/TodoDialog.tsx";
import {
	clearTodos,
	createTodo as createTodoServer,
	deleteTodo,
	listTodos,
	updateTodoCompletion,
} from "../features/todos/todo.ts";
import {
	type DueDateFilter,
	filterTodos,
	filterTodosByDueDate,
	getGreeting,
	getLocalDateKey,
	type TodoFilter,
} from "../features/todos/todo.utils.ts";
import type { Todo } from "../features/todos/types.ts";

const TaskAnalytics = lazy(() =>
	import("../features/todos/TaskAnalytics.tsx").then((module) => ({
		default: module.TaskAnalytics,
	})),
);

type DashboardView = "todos" | "calendar" | "analytics";

type DashboardSearch = {
	view?: DashboardView;
	filter?: TodoFilter;
	dueDateFilter?: DueDateFilter;
};

const todoFilterLabels: Record<TodoFilter, string> = {
	all: "My todos",
	today: "Today",
	completed: "Completed",
	personal: "Personal",
	work: "Work",
	workout: "Workout",
};

function getDashboardView(value: unknown): DashboardView | undefined {
	return value === "todos" || value === "calendar" || value === "analytics"
		? value
		: undefined;
}

function getTodoFilter(value: unknown): TodoFilter | undefined {
	return value === "all" ||
		value === "today" ||
		value === "completed" ||
		value === "personal" ||
		value === "work" ||
		value === "workout"
		? value
		: undefined;
}

function getDueDateFilter(value: unknown): DueDateFilter | undefined {
	return value === "all" ||
		value === "today" ||
		value === "tomorrow" ||
		value === "next7Days"
		? value
		: undefined;
}

const requireUser = createServerFn().handler(async () => {
	const { isAuthenticated, userId } = await auth();

	if (!isAuthenticated) {
		throw redirect({
			to: "/signin",
		});
	}

	return { userId };
});

export const Route = createFileRoute("/dashboard")({
	validateSearch: (search: Record<string, unknown>): DashboardSearch => {
		const view = getDashboardView(search.view);
		const filter = getTodoFilter(search.filter);
		const dueDateFilter = getDueDateFilter(search.dueDateFilter);
		return {
			...(view ? { view } : {}),
			...(filter ? { filter } : {}),
			...(dueDateFilter ? { dueDateFilter } : {}),
		};
	},
	head: () => ({
		title: "Dashboard — Flow",
		meta: [{ name: "robots", content: "noindex, nofollow, noarchive" }],
	}),
	beforeLoad: async () => {
		return requireUser();
	},
	component: DashboardPage,
});

function DashboardPage() {
	const { user, isLoaded } = useUser();
	const {
		view,
		filter: urlFilter,
		dueDateFilter: urlDueDateFilter,
	} = Route.useSearch();
	const activeView = view ?? "analytics";
	const navigate = Route.useNavigate();

	const [todos, setTodos] = useState<Todo[]>([]);
	const filter = urlFilter ?? "all";
	const todoPageLabel = todoFilterLabels[filter];
	const dueDateFilter = urlDueDateFilter ?? "all";
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [todoDialogOpen, setTodoDialogOpen] = useState(false);
	const [selectedDueDate, setSelectedDueDate] = useState(() =>
		getLocalDateKey(),
	);
	const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);
	const lastScrollY = useRef(0);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	);

	function setActiveView(view: DashboardView) {
		navigate({
			search: (previous) => ({ ...previous, view }),
		});
	}

	function setTodoFilter(nextFilter: TodoFilter) {
		navigate({
			search: (previous) => ({
				...previous,
				view: "todos",
				filter: nextFilter,
			}),
		});
	}

	function setDueDateFilter(nextDueDateFilter: DueDateFilter) {
		navigate({
			search: (previous) => ({
				...previous,
				dueDateFilter: nextDueDateFilter,
			}),
		});
	}

	useEffect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY;
			const scrollingUp = currentScrollY < lastScrollY.current;

			setMobileHeaderVisible(currentScrollY < 16 || scrollingUp);
			lastScrollY.current = currentScrollY;
		}

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		listTodos()
			.then((savedTodos) => setTodos(savedTodos))
			.catch((error) => console.error("Could not load todos", error));
	}, []);

	const userName =
		user?.fullName || user?.firstName || user?.username || "there";

	const completedTodos = todos.filter((todo) => todo.completed).length;
	const focusScore =
		todos.length === 0 ? 0 : Math.round((completedTodos / todos.length) * 100);

	const progress = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;
	const defaultTodoDueDate =
		dueDateFilter === "tomorrow" || dueDateFilter === "next7Days"
			? getLocalDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000))
			: getLocalDateKey();
	const visibleTodos = filterTodosByDueDate(
		filterTodos(todos, filter),
		dueDateFilter,
	);

	const handleCreateTodo = async (todo: Todo) => {
		const savedTodo = await createTodoServer({
			data: {
				title: todo.title,
				description: todo.description,
				tag: todo.tag,
				dueDate: todo.dueDate,
			},
		});

		setTodos((currentTodos) => [
			{ ...todo, id: savedTodo.id },
			...currentTodos,
		]);
	};

	async function toggleTodo(todoId: string) {
		const todo = todos.find((item) => item.id === todoId);
		if (!todo) return;

		const completed = !todo.completed;
		setTodos((currentTodos) =>
			currentTodos.map((item) =>
				item.id === todoId ? { ...item, completed } : item,
			),
		);

		try {
			await updateTodoCompletion({ data: { id: todoId, completed } });
		} catch (error) {
			console.error("Could not update todo completion", error);
			setTodos((currentTodos) =>
				currentTodos.map((item) =>
					item.id === todoId ? { ...item, completed: todo.completed } : item,
				),
			);
		}
	}

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (!over || active.id === over.id) return;

		const oldIndex = visibleTodos.findIndex((todo) => todo.id === active.id);
		const newIndex = visibleTodos.findIndex((todo) => todo.id === over.id);
		const reorderedVisible = arrayMove(visibleTodos, oldIndex, newIndex);
		const visibleIds = new Set(visibleTodos.map((todo) => todo.id));
		let visibleIndex = 0;

		setTodos((currentTodos) =>
			currentTodos.map((todo) => {
				if (!visibleIds.has(todo.id)) return todo;
				return reorderedVisible[visibleIndex++];
			}),
		);
	}

	async function handleDeleteTodo(todoId: string) {
		await deleteTodo({ data: todoId });
		setTodos((currentTodos) =>
			currentTodos.filter((todo) => todo.id !== todoId),
		);
	}

	async function handleClearTodos() {
		if (!window.confirm("Delete all todos? This cannot be undone.")) return;
		await clearTodos();
		setTodos([]);
	}

	return (
		<main className="flex min-h-screen bg-flow-canvas text-flow-text">
			<Sidebar
				filter={filter}
				onFilterChange={setTodoFilter}
				activeView={activeView}
				onCalendarOpen={() => setActiveView("calendar")}
				onAnalyticsOpen={() => setActiveView("analytics")}
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<div className="min-w-0 flex-1">
				<div className="hidden justify-end border-b border-flow-border bg-flow-surface/95 px-6 py-4 backdrop-blur lg:flex">
					<ThemeMenu />
				</div>
				<div
					className={`sticky top-0 z-20 flex items-center justify-between border-b border-flow-border bg-flow-surface/95 px-5 py-4 backdrop-blur transition-transform duration-300 lg:hidden ${
						mobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
					}`}
				>
					<button
						type="button"
						aria-label="Open sidebar"
						aria-expanded={sidebarOpen}
						aria-controls="dashboard-sidebar"
						onClick={() => setSidebarOpen(true)}
						className="rounded-lg border border-flow-border px-3 py-2 text-xl"
					>
						<Menu />
					</button>
					<ThemeMenu />
				</div>

				<section className="mx-auto max-w-7xl px-6 py-10">
					{activeView === "analytics" ? (
						<Suspense
							fallback={
								<div className="flow-card p-8 text-sm text-flow-text-secondary">
									Loading analytics…
								</div>
							}
						>
							<TaskAnalytics todos={todos} />
						</Suspense>
					) : activeView === "calendar" ? (
						<div className="flow-card p-5">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div>
									<p className="inline-flex rounded-full bg-flow-primary-soft px-3 py-1 text-sm font-semibold uppercase tracking-wide text-flow-primary">
										Calendar
									</p>
									<h1 className="mt-3 text-3xl font-bold tracking-tight">
										Plan your tasks
									</h1>
									<p className="mt-2 text-flow-text-secondary">
										Select a date to add a task, or browse your scheduled work.
									</p>
								</div>
								<TodoDialog
									onCreate={handleCreateTodo}
									defaultDueDate={selectedDueDate}
									open={todoDialogOpen}
									onOpenChange={setTodoDialogOpen}
								/>
							</div>

							<div className="mt-6">
								<Calendar
									tasks={todos}
									onDateClick={(date) => {
										setSelectedDueDate(date);
										setTodoDialogOpen(true);
									}}
								/>
							</div>
						</div>
					) : (
						<>
							<p className="inline-flex rounded-full bg-flow-primary-soft px-3 py-1 text-sm font-semibold uppercase tracking-wide text-flow-primary">
								{todoPageLabel}
							</p>

							<h1 className="mt-3 text-3xl font-bold tracking-tight">
								{isLoaded
									? `${getGreeting(new Date().getHours())}, ${userName}.`
									: "Welcome"}
							</h1>

							<p className="mt-2 text-flow-text-secondary">
								Here’s a clear view of what needs your attention today.
							</p>

							<div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								<div className="flow-card p-5">
									<p className="text-sm text-flow-text-secondary">
										Today’s progress
									</p>

									<p className="mt-3 text-3xl font-bold">
										{completedTodos} / {todos.length}
									</p>

									<div
										className="mt-4 h-2 overflow-hidden rounded-full bg-flow-progress-track"
										role="progressbar"
										aria-label="Today’s todo progress"
										aria-valuemin={0}
										aria-valuemax={100}
										aria-valuenow={progress}
									>
										<div
											className="h-full rounded-full bg-flow-primary transition-all"
											style={{ width: `${progress}%` }}
										/>
									</div>
								</div>

								<div className="flow-card p-5">
									<p className="text-sm text-flow-text-secondary">
										Focus score
									</p>

									<p className="mt-3 text-3xl font-bold text-flow-primary">
										{focusScore}%
									</p>
								</div>

								<div className="flow-card p-5">
									<p className="text-sm text-flow-text-secondary">Open tasks</p>

									<p className="mt-3 text-3xl font-bold">
										{todos.length - completedTodos}
									</p>
								</div>
							</div>

							<div className="mt-8 flow-card p-5">
								<div className="flex items-center justify-between gap-4">
									<div>
										<h2 className="text-lg font-bold">Your focus list</h2>

										<p className="mt-1 text-sm text-flow-text-secondary">
											Keep your next steps clear and manageable.
										</p>
									</div>

									<TodoDialog
										defaultTag={
											filter === "personal" ||
											filter === "work" ||
											filter === "workout"
												? filter
												: "work"
										}
										defaultDueDate={defaultTodoDueDate}
										onCreate={handleCreateTodo}
									/>
								</div>

								<TodoDateFilter
									value={dueDateFilter}
									onChange={setDueDateFilter}
								/>

								<div className="mt-5 space-y-3">
									{visibleTodos.length === 0 ? (
										<div className="rounded-xl border border-dashed border-flow-border-strong p-8 text-center">
											<p className="font-semibold">No todos yet</p>

											<p className="mt-1 text-sm text-flow-text-secondary">
												Add your first task to start your flow.
											</p>
										</div>
									) : (
										<DndContext
											sensors={sensors}
											collisionDetection={closestCenter}
											onDragEnd={handleDragEnd}
										>
											<SortableContext
												items={visibleTodos.map((todo) => todo.id)}
												strategy={verticalListSortingStrategy}
											>
												{visibleTodos.map((todo) => (
													<SortableTask
														key={todo.id}
														todo={todo}
														onToggle={() => toggleTodo(todo.id)}
														onDelete={() => handleDeleteTodo(todo.id)}
													/>
												))}
											</SortableContext>
										</DndContext>
									)}
								</div>
								{todos.length > 0 && (
									<div className="mt-6 flex justify-end border-t border-flow-border pt-4">
										<button
											type="button"
											onClick={handleClearTodos}
											className="inline-flex items-center gap-2 rounded-xl border border-2 cursor-pointer border-red-500 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
										>
											<Trash2 size={16} /> Clear all
										</button>
									</div>
								)}
							</div>
						</>
					)}
				</section>
			</div>
		</main>
	);
}

function SortableTask({
	todo,
	onToggle,
	onDelete,
}: {
	todo: Todo;
	onToggle: () => void;
	onDelete: () => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: todo.id });

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={isDragging ? "relative z-10 opacity-70" : ""}
		>
			<Task
				todo={todo}
				onToggle={onToggle}
				onDelete={onDelete}
				dragAttributes={attributes}
				dragListeners={listeners}
			/>
		</div>
	);
}

function Task({
	todo,
	onToggle,
	onDelete,
	dragAttributes,
	dragListeners,
}: {
	todo: Todo;
	onToggle: () => void;
	onDelete: () => void;
	dragAttributes?: React.HTMLAttributes<HTMLButtonElement>;
	dragListeners?: React.HTMLAttributes<HTMLButtonElement>;
}) {
	return (
		<div className="flex items-start gap-3 rounded-xl border border-flow-border bg-flow-surface-raised p-4 transition hover:border-flow-border-strong">
			<button
				type="button"
				onClick={onToggle}
				aria-label={`Mark ${todo.title} as ${
					todo.completed ? "incomplete" : "complete"
				}`}
				className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border text-xs transition ${
					todo.completed
						? "border-flow-primary bg-flow-primary text-white"
						: "border-flow-border-strong hover:border-flow-primary"
				}`}
			>
				{todo.completed ? "✓" : ""}
			</button>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-4">
					<h3
						className={`text-sm font-semibold ${
							todo.completed
								? "text-flow-text-muted line-through"
								: "text-flow-text"
						}`}
					>
						{todo.title}
					</h3>

					<span className="shrink-0 rounded-full bg-flow-primary-soft px-2.5 py-1 text-xs font-semibold capitalize text-flow-primary-hover">
						{todo.tag}
					</span>
				</div>

				{todo.description && (
					<p className="mt-1 text-sm leading-relaxed text-flow-text-secondary">
						{todo.description}
					</p>
				)}
			</div>

			<button
				type="button"
				aria-label={`Drag ${todo.title}`}
				{...dragAttributes}
				{...dragListeners}
				className="cursor-grab px-1 text-lg leading-none text-flow-text-muted active:cursor-grabbing"
			>
				⠿
			</button>

			<button
				type="button"
				onClick={onDelete}
				aria-label={`Delete ${todo.title}`}
				className="rounded-lg p-1.9 text-flow-text-muted transition  hover:text-red-600"
			>
				<Trash2 size={18} />
			</button>
		</div>
	);
}
