import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

type Task = {
	id: number | string;
	title: string;
	dueDate: string;
	completed: boolean;
};

type CalendarProps = {
	tasks: Task[];
	onDateClick?: (date: string) => void;
};

const Calendar = ({ tasks, onDateClick }: CalendarProps) => {
	const events = tasks
		.filter((task) => task.dueDate)
		.map((task) => ({
			id: String(task.id),
			title: task.title,
			start: task.dueDate,
			allDay: true,
			classNames: [
				"flow-calendar-event",
				task.completed
					? "flow-calendar-event-completed"
					: "flow-calendar-event-open",
			],
		}));
	return (
		<div className="calendar-container flow-calendar">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek",
				}}
				events={events}
				dateClick={(info) => onDateClick?.(info.dateStr)}
				height="auto"
			/>
		</div>
	);
};

export default Calendar;
