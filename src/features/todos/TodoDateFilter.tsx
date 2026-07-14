import type { DueDateFilter } from "./todo.utils.ts";

type Props = {
	value: DueDateFilter;
	onChange: (filter: DueDateFilter) => void;
};

const options: Array<{ label: string; value: DueDateFilter }> = [
	{ label: "All", value: "all" },
	{ label: "Today", value: "today" },
	{ label: "Tomorrow", value: "tomorrow" },
	{ label: "Next 7 days", value: "next7Days" },
];

export function TodoDateFilter({ value, onChange }: Props) {
	return (
		<section className="flow-date-filter" aria-label="Filter todos by due date">
			<span className="flow-date-filter-label">Show</span>
			<fieldset className="flow-date-filter-options">
				<legend className="sr-only">Due date</legend>
				{options.map((option) => (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						aria-pressed={value === option.value}
						className={
							value === option.value
								? "flow-date-filter-option flow-date-filter-option-active"
								: "flow-date-filter-option"
						}
					>
						{option.label}
					</button>
				))}
			</fieldset>
		</section>
	);
}
