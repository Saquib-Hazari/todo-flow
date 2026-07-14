import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { Todo, TodoTags } from "./types.ts";

type AnalyticsPeriod = "today" | "week" | "month" | "year";

type Props = {
	todos: Todo[];
};

const periods: Array<{ label: string; value: AnalyticsPeriod }> = [
	{ label: "Today", value: "today" },
	{ label: "Week", value: "week" },
	{ label: "Month", value: "month" },
	{ label: "Year", value: "year" },
];

const tags: TodoTags[] = ["work", "personal", "workout"];
const tagLabels: Record<TodoTags, string> = {
	work: "Work",
	personal: "Personal",
	workout: "Workout",
};

function toDateKey(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function createDate(date: Date, daysToAdd = 0) {
	const result = new Date(date);
	result.setHours(0, 0, 0, 0);
	result.setDate(result.getDate() + daysToAdd);
	return result;
}

function getRange(period: AnalyticsPeriod, now = new Date()) {
	const today = createDate(now);
	if (period === "today") return { start: today, end: today };
	if (period === "week") {
		const weekday = (today.getDay() + 6) % 7;
		return {
			start: createDate(today, -weekday),
			end: createDate(today, 6 - weekday),
		};
	}
	if (period === "month") {
		return {
			start: new Date(today.getFullYear(), today.getMonth(), 1),
			end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
		};
	}
	return {
		start: new Date(today.getFullYear(), 0, 1),
		end: new Date(today.getFullYear(), 11, 31),
	};
}

function chartTooltipStyle() {
	return {
		background: "var(--flow-surface-raised)",
		border: "1px solid var(--flow-border)",
		borderRadius: "12px",
		boxShadow: "0 12px 28px rgb(7 16 13 / 12%)",
		color: "var(--flow-text)",
		fontSize: "12px",
	};
}

export function TaskAnalytics({ todos }: Props) {
	const [period, setPeriod] = useState<AnalyticsPeriod>("week");

	const analytics = useMemo(() => {
		const { start, end } = getRange(period);
		const startKey = toDateKey(start);
		const endKey = toDateKey(end);
		const scopedTodos = todos.filter(
			(todo) => todo.dueDate >= startKey && todo.dueDate <= endKey,
		);
		const completed = scopedTodos.filter((todo) => todo.completed).length;
		const total = scopedTodos.length;
		const completionRate =
			total === 0 ? 0 : Math.round((completed / total) * 100);
		const tagData = tags.map((tag) => ({
			name: tagLabels[tag],
			tasks: scopedTodos.filter((todo) => todo.tag === tag).length,
		}));

		const timeline = [] as Array<{
			key: string;
			label: string;
			tasks: number;
			completed: number;
		}>;
		if (period === "year") {
			for (let month = 0; month < 12; month += 1) {
				const date = new Date(start.getFullYear(), month, 1);
				const key = `${date.getFullYear()}-${String(month + 1).padStart(2, "0")}`;
				timeline.push({
					key,
					label: date.toLocaleDateString(undefined, { month: "short" }),
					tasks: 0,
					completed: 0,
				});
			}
		} else {
			for (
				let date = createDate(start);
				date <= end;
				date = createDate(date, 1)
			) {
				timeline.push({
					key: toDateKey(date),
					label:
						period === "month"
							? String(date.getDate())
							: date.toLocaleDateString(undefined, { weekday: "short" }),
					tasks: 0,
					completed: 0,
				});
			}
		}

		const points = new Map(timeline.map((point) => [point.key, point]));
		for (const todo of scopedTodos) {
			const key = period === "year" ? todo.dueDate.slice(0, 7) : todo.dueDate;
			const point = points.get(key);
			if (!point) continue;
			point.tasks += 1;
			if (todo.completed) point.completed += 1;
		}

		return {
			completionRate,
			completed,
			pending: total - completed,
			tagData,
			timeline,
			total,
		};
	}, [period, todos]);

	const statusData = [
		{
			name: "Completed",
			value: analytics.completed,
			color: "var(--flow-primary)",
		},
		{
			name: "Remaining",
			value: analytics.pending,
			color: "var(--flow-border-strong)",
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="inline-flex rounded-full bg-flow-primary-soft px-3 py-1 text-sm font-semibold uppercase tracking-wide text-flow-primary">
						Dashboard
					</p>
					<h1 className="mt-3 text-3xl font-bold tracking-tight">
						Your task dashboard
					</h1>
					<p className="mt-2 text-flow-text-secondary">
						Track scheduled work and completion progress at a glance.
					</p>
				</div>
				<fieldset className="flow-analytics-filter">
					<legend className="sr-only">Analytics period</legend>
					{periods.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => setPeriod(option.value)}
							aria-pressed={period === option.value}
							className={
								period === option.value ? "flow-analytics-filter-active" : ""
							}
						>
							{option.label}
						</button>
					))}
				</fieldset>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<Kpi label="Scheduled tasks" value={analytics.total} />
				<Kpi label="Completed" value={analytics.completed} accent />
				<Kpi label="Open tasks" value={analytics.pending} />
				<Kpi
					label="Completion rate"
					value={`${analytics.completionRate}%`}
					accent
				/>
			</div>

			<div className="grid gap-6 xl:grid-cols-3">
				<ChartCard
					className="xl:col-span-2"
					title="Completion trend"
					subtitle="Scheduled versus completed tasks"
				>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={analytics.timeline}
							margin={{ top: 8, right: 6, left: -20, bottom: 0 }}
						>
							<XAxis
								dataKey="label"
								tickLine={false}
								axisLine={false}
								tick={{ fill: "var(--flow-text-muted)", fontSize: 11 }}
							/>
							<YAxis
								allowDecimals={false}
								tickLine={false}
								axisLine={false}
								tick={{ fill: "var(--flow-text-muted)", fontSize: 11 }}
							/>
							<Tooltip contentStyle={chartTooltipStyle()} />
							<Legend
								wrapperStyle={{
									fontSize: 12,
									color: "var(--flow-text-secondary)",
								}}
							/>
							<Line
								type="monotone"
								dataKey="tasks"
								name="Scheduled"
								stroke="var(--flow-highlight)"
								strokeWidth={3}
								dot={false}
								activeDot={{ r: 5 }}
							/>
							<Line
								type="monotone"
								dataKey="completed"
								name="Completed"
								stroke="var(--flow-primary)"
								strokeWidth={3}
								dot={false}
								activeDot={{ r: 5 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard
					title="Completion gauge"
					subtitle="Tasks completed in this period"
				>
					<div className="flow-gauge-chart">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={[
										{ value: analytics.completionRate },
										{ value: 100 - analytics.completionRate },
									]}
									dataKey="value"
									startAngle={180}
									endAngle={0}
									innerRadius="66%"
									outerRadius="90%"
									paddingAngle={0}
									stroke="none"
								>
									<Cell fill="var(--flow-primary)" />
									<Cell fill="var(--flow-progress-track)" />
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<div className="flow-gauge-value">
							<strong>{analytics.completionRate}%</strong>
							<span>complete</span>
						</div>
					</div>
				</ChartCard>

				<ChartCard
					className="xl:col-span-2"
					title="Tasks by collection"
					subtitle="Scheduled task volume"
				>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={analytics.tagData}
							margin={{ top: 8, right: 6, left: -20, bottom: 0 }}
						>
							<XAxis
								dataKey="name"
								tickLine={false}
								axisLine={false}
								tick={{ fill: "var(--flow-text-muted)", fontSize: 11 }}
							/>
							<YAxis
								allowDecimals={false}
								tickLine={false}
								axisLine={false}
								tick={{ fill: "var(--flow-text-muted)", fontSize: 11 }}
							/>
							<Tooltip
								contentStyle={chartTooltipStyle()}
								cursor={{ fill: "var(--flow-primary-soft)" }}
							/>
							<Bar
								dataKey="tasks"
								name="Tasks"
								fill="var(--flow-primary)"
								radius={[8, 8, 2, 2]}
								maxBarSize={46}
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				<ChartCard title="Task status" subtitle="Completion breakdown">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={statusData}
								dataKey="value"
								nameKey="name"
								innerRadius="56%"
								outerRadius="82%"
								paddingAngle={4}
								stroke="none"
							>
								{statusData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
							<Tooltip contentStyle={chartTooltipStyle()} />
							<Legend
								iconType="circle"
								wrapperStyle={{
									fontSize: 12,
									color: "var(--flow-text-secondary)",
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</ChartCard>
			</div>
		</div>
	);
}

function Kpi({
	label,
	value,
	accent = false,
}: {
	label: string;
	value: string | number;
	accent?: boolean;
}) {
	return (
		<div className="flow-analytics-kpi">
			<p>{label}</p>
			<strong className={accent ? "text-flow-primary" : ""}>{value}</strong>
		</div>
	);
}

function ChartCard({
	children,
	className = "",
	subtitle,
	title,
}: {
	children: React.ReactNode;
	className?: string;
	subtitle: string;
	title: string;
}) {
	return (
		<section className={`flow-analytics-card ${className}`}>
			<div>
				<h2>{title}</h2>
				<p>{subtitle}</p>
			</div>
			<div className="flow-chart-canvas">{children}</div>
		</section>
	);
}
