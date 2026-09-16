import { Calendar } from "react-aria-components";
import type { DateValue } from "react-aria-components";
import { MonthPanel } from "./date-picker/shared";
import { useMediaQuery } from "../lib/useMediaQuery";

/**
 * BoardUI's DatePicker calendar (react-aria `Calendar` + their MonthPanel /
 * DayCell) with multi-day selection layered on top.
 *
 * react-aria's Calendar is single-date or range only, so `value` stays null and
 * every press comes back through `onChange` as a toggle — react-aria keeps the
 * grid, month navigation, focus management and keyboard/screen-reader
 * behaviour; the selected set is ours and paints through BoardUI's own cell.
 *
 * Laid out like their DateRangePicker: two months side by side once there's
 * room, which both fills the width and covers a contract that runs across a
 * month boundary. One month below `md`.
 */
export default function MultiDateCalendar({ value, onChange }: { value: string[]; onChange: (dates: string[]) => void }) {
  const selected = new Set(value);
  const twoUp = useMediaQuery("(min-width: 768px)");

  function toggle(date: DateValue) {
    const iso = date.toString();
    onChange(selected.has(iso) ? value.filter((d) => d !== iso) : [...value, iso]);
  }

  return (
    <Calendar
      aria-label="Delivery dates"
      value={null}
      onChange={toggle}
      visibleDuration={{ months: twoUp ? 2 : 1 }}
      className="flex w-full flex-col gap-3"
    >
      <div className="flex w-full gap-2 rounded-3xl bg-grey-light p-3">
        <MonthPanel offset={0} showPrev showNext={!twoUp} fluid selectedDates={selected} />
        {twoUp && <MonthPanel offset={1} showNext fluid selectedDates={selected} />}
      </div>
      <div className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
        {value.length} date{value.length === 1 ? "" : "s"} selected
      </div>
    </Calendar>
  );
}
