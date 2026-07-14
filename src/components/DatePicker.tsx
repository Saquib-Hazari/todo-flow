import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { getLocalDateKey } from "../features/todos/todo.utils.ts";

type Props = {
	id: string;
	value: string;
	onChange: (value: string) => void;
};

function dateFromKey(value: string) {
	const [year, month, day] = value.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function formatDate(value: string) {
	return dateFromKey(value).toLocaleDateString(undefined, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function DatePicker({ id, value, onChange }: Props) {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState(() => dateFromKey(value));
	const pickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMonth(dateFromKey(value));
	}, [value]);

	useEffect(() => {
		function closeOnOutsideClick(event: MouseEvent) {
			if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
		}

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}

		document.addEventListener("mousedown", closeOnOutsideClick);
		document.addEventListener("keydown", closeOnEscape);
		return () => {
			document.removeEventListener("mousedown", closeOnOutsideClick);
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, []);

	const days = useMemo(() => {
		const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
		const gridStart = new Date(firstDay);
		gridStart.setDate(firstDay.getDate() - firstDay.getDay());

		return Array.from({ length: 42 }, (_, index) => {
			const date = new Date(gridStart);
			date.setDate(gridStart.getDate() + index);
			return date;
		});
	}, [month]);

	const monthLabel = month.toLocaleDateString(undefined, {
		month: "long",
		year: "numeric",
	});

	return (
		<div ref={pickerRef} className="flow-date-picker">
			<button
				id={id}
				type="button"
				onClick={() => setOpen((current) => !current)}
				aria-expanded={open}
				aria-haspopup="dialog"
				className="flow-date-picker-trigger"
			>
				<span>{formatDate(value)}</span>
				<CalendarDays size={18} />
			</button>

			{open && (
				<div
					className="flow-date-picker-popover"
					role="dialog"
					aria-label="Choose due date"
				>
					<div className="flow-date-picker-header">
						<button
							type="button"
							aria-label="Previous month"
							onClick={() =>
								setMonth(
									(current) =>
										new Date(current.getFullYear(), current.getMonth() - 1, 1),
								)
							}
						>
							<ChevronLeft size={18} />
						</button>
						<strong>{monthLabel}</strong>
						<button
							type="button"
							aria-label="Next month"
							onClick={() =>
								setMonth(
									(current) =>
										new Date(current.getFullYear(), current.getMonth() + 1, 1),
								)
							}
						>
							<ChevronRight size={18} />
						</button>
					</div>
					<div className="flow-date-picker-weekdays">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<span key={day}>{day}</span>
						))}
					</div>
					<div className="flow-date-picker-days">
						{days.map((date) => {
							const dateKey = getLocalDateKey(date);
							const inCurrentMonth = date.getMonth() === month.getMonth();
							const selected = dateKey === value;
							const today = dateKey === getLocalDateKey();

							return (
								<button
									key={dateKey}
									type="button"
									onClick={() => {
										onChange(dateKey);
										setOpen(false);
									}}
									aria-label={formatDate(dateKey)}
									aria-pressed={selected}
									className={`flow-date-picker-day ${
										!inCurrentMonth ? "is-outside" : ""
									} ${today ? "is-today" : ""} ${selected ? "is-selected" : ""}`}
								>
									{date.getDate()}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
