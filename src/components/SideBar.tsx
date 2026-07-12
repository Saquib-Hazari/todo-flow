import { UserButton, useClerk, useUser } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";

export type TodoFilter =
	| "all"
	| "today"
	| "completed"
	| "personal"
	| "work"
	| "workout";

type SidebarProps = {
	filter: TodoFilter;
	onFilterChange: (filter: TodoFilter) => void;
	open: boolean;
	onClose: () => void;
};

export function Sidebar({
	filter,
	onFilterChange,
	open,
	onClose,
}: SidebarProps) {
	const { user } = useUser();
	const { openUserProfile, signOut } = useClerk();
	const userName =
		user?.fullName || user?.firstName || user?.username || "User";
	const item = (value: TodoFilter, label: string, icon: string) => (
		<button
			type="button"
			onClick={() => {
				onFilterChange(value);
				onClose();
			}}
			className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
				filter === value
					? "bg-flow-primary text-white"
					: "text-flow-text-secondary hover:bg-flow-primary-soft hover:text-flow-text"
			}`}
			aria-pressed={filter === value}
		>
			<span>{icon}</span>
			{label}
		</button>
	);

	return (
		<>
			{open && (
				<button
					type="button"
					aria-label="Close sidebar"
					onClick={onClose}
					className="fixed inset-0 z-30 bg-black/30 lg:hidden"
				/>
			)}
			<aside
				id="dashboard-sidebar"
				aria-label="Dashboard sidebar"
				className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto border-r border-flow-border bg-flow-surface px-4 py-5 transition-transform lg:sticky lg:top-0 lg:flex lg:h-screen lg:max-h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
			>
				<Link
					to="/dashboard"
					onClick={onClose}
					className="flex items-center gap-3 px-2"
				>
					<span className="grid size-9 place-items-center rounded-xl bg-flow-primary font-bold text-white">
						✓
					</span>
					<span className="text-xl font-bold tracking-tight">flowlist</span>
				</Link>

				<nav aria-label="Workspace filters" className="mt-10 space-y-1">
					<p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-flow-text-muted">
						Workspace
					</p>
					{item("all", "My todos", "✓")}
					{item("today", "Today", "◷")}
					{item("completed", "Completed", "✓")}
				</nav>

				<nav aria-label="Collection filters" className="mt-8 space-y-1">
					<p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-flow-text-muted">
						Collections
					</p>
					{item("personal", "Personal", "•")}
					{item("work", "Work", "•")}
					{item("workout", "Workout", "•")}
				</nav>

				<div className="mt-auto border-t border-flow-border pt-4">
					<div className="flex items-center gap-3 px-2">
						<UserButton
							showName={false}
							appearance={{
								elements: {
									avatarBox: "h-9 w-9",
								},
							}}
						/>
						<button
							type="button"
							onClick={() => openUserProfile()}
							className="min-w-0 flex-1 text-left"
						>
							<p className="truncate text-sm font-semibold text-flow-text">
								{userName}
							</p>
							<p className="text-xs text-flow-text-muted">Personal workspace</p>
						</button>
					</div>
					<button
						type="button"
						onClick={() => signOut({ redirectUrl: "/" })}
						className="mt-3 w-full rounded-lg px-2 py-2 text-left text-xs font-semibold text-flow-text-muted transition hover:bg-flow-primary-soft hover:text-flow-primary"
					>
						Sign out
					</button>
				</div>
			</aside>
		</>
	);
}
