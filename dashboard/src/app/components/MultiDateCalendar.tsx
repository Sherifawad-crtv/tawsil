import { useMemo } from "react";
import { Calendar } from "react-aria-components";
import type { DateValue } from "react-aria-components";
import { parseDate } from "@internationalized/date";
import { MonthPanel } from "./date-picker/shared";
import { useMediaQuery } from "../lib/useMediaQuery";

/**
 * BoardUI's DatePicker calendar (react-aria `Calendar` + their MonthPanel /
 * DayCell), the one shared implementation for every multi-day calendar in
 * this app. It used to exist twice - this component for the create-order
 * form, and Monthly Order Detail hand-assembling the same Calendar +
 * two-MonthPanel-row + responsive-twoUp scaffolding a second time for its
 * read-only execution view. Now Detail calls this with `onToggle` omitted
 * and its own legend passed in, instead of re-deriving all of it.
 *
 * react-aria's Calendar is single-date or range only, so `value` stays null
 * and every press comes back through `onToggle` - react-aria keeps the grid,
 * month navigation, focus management and keyboard/screen-reader behaviour;
 * the selected set is ours and paints through BoardUI's own cell.
 *
 * Two months side by side once there's room - both fills the width and
 * covers a range that crosses a month boundary - one month below `md`.
 */
export default function MultiDateCalendar({
  selectedDates,
  onToggle,
  focusDate,
  edgeClassNameFor,
  legend,
  className,
  ariaLabel = "Calendar",
}: {
  /** ISO (YYYY-MM-DD) days to paint as selected/marked. */
  selectedDates: Set<string>;
  /** Omit for a read-only calendar - the grid still renders, presses do nothing. */
  onToggle?: (iso: string) => void;
  /** Which month to open on. Defaults to today; pass the range's own start so a contract entirely in the past or future doesn't open on an empty "today". */
  focusDate?: string;
  /** Per-day pill fill, for calendars that mark more than one kind of day (e.g. executed vs pending). */
  edgeClassNameFor?: (iso: string) => string | undefined;
  /** Footer under the grid - a legend, a "N selected" caption, or nothing. */
  legend?: React.ReactNode;
  className?: string;
  /** What this particular calendar is picking/showing - each call site's own label, not a generic one. */
  ariaLabel?: string;
}) {
  const twoUp = useMediaQuery("(min-width: 768px)");
  const readOnly = !onToggle;
  const defaultFocusedValue = useMemo(() => (focusDate ? parseDate(focusDate) : undefined), [focusDate]);

  function handleChange(date: DateValue) {
    onToggle?.(date.toString());
  }

  return (
    <Calendar
      aria-label={ariaLabel}
      isReadOnly={readOnly}
      value={null}
      onChange={readOnly ? undefined : handleChange}
      defaultFocusedValue={defaultFocusedValue}
      visibleDuration={{ months: twoUp ? 2 : 1 }}
      className={`flex w-full flex-col gap-3 ${className ?? ""}`}
    >
      <div className={`flex w-full gap-2 ${readOnly ? "" : "rounded-3xl bg-grey-light p-3"}`}>
        <MonthPanel
          offset={0}
          showPrev
          showNext={!twoUp}
          fluid
          selectedDates={selectedDates}
          edgeClassNameFor={edgeClassNameFor}
        />
        {twoUp && (
          <MonthPanel
            offset={1}
            showNext
            fluid
            selectedDates={selectedDates}
            edgeClassNameFor={edgeClassNameFor}
          />
        )}
      </div>
      {legend}
    </Calendar>
  );
}
