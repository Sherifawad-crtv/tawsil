import { Calendar } from "react-aria-components";
import type { DateValue } from "react-aria-components";
import { MonthPanel } from "./date-picker/shared";

/**
 * BoardUI's DatePicker calendar (react-aria `Calendar` + their MonthPanel /
 * DayCell) with multi-day selection layered on top.
 *
 * react-aria's Calendar is single-date or range only, so `value` stays null and
 * every press comes back through `onChange` as a toggle — react-aria keeps the
 * grid, month navigation, focus management and keyboard/screen-reader
 * behaviour; the selected set is ours and paints through BoardUI's own cell.
 */
export default function MultiDateCalendar({ value, onChange }: { value: string[]; onChange: (dates: string[]) => void }) {
  const selected = new Set(value);

  function toggle(date: DateValue) {
    const iso = date.toString();
    onChange(selected.has(iso) ? value.filter((d) => d !== iso) : [...value, iso]);
  }

  return (
    <Calendar aria-label="Delivery dates" value={null} onChange={toggle} className="inline-flex flex-col gap-3">
      <div className="rounded-3xl bg-tile p-3">
        <MonthPanel offset={0} showPrev showNext selectedDates={selected} />
      </div>
      <div className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
        {value.length} date{value.length === 1 ? "" : "s"} selected
      </div>
    </Calendar>
  );
}
