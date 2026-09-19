import { useContext } from "react";
import {
  Button as RACButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarStateContext,
  RangeCalendarStateContext,
} from "react-aria-components";
import type { CalendarCellRenderProps } from "react-aria-components";
import { getLocalTimeZone } from "@internationalized/date";
import { AltArrowLeftIcon, AltArrowRightIcon } from "@solar-icons/react/bold-duotone";
import { cx } from "../../lib/cx";

/**
 * BoardUI's base/date-picker building blocks (components/base/date-picker/
 * shared.tsx), on our tokens. Geometry is 1:1 with theirs: 32px day cells on a
 * 12px border-spacing grid, 24px weekday header cells, 326px month panel.
 *
 * Two additions their pickers don't need: `selectedOverride` and
 * `edgeClassName`, because react-aria's Calendar is single-date/range only and
 * our monthly contracts select many individual days (and mark them executed vs
 * pending). Selection state is then the caller's, painted through BoardUI's
 * own cell chrome.
 */

/** Month-nav chevrons, Solar's alt-arrow pair - the same chevron family WaypointsEditor's reorder buttons already use. */
function ChevronLeft16({ className }: { className?: string }) {
  return <AltArrowLeftIcon size={16} className={className} aria-hidden />;
}

function ChevronRight16({ className }: { className?: string }) {
  return <AltArrowRightIcon size={16} className={className} aria-hidden />;
}

type DayCellProps = CalendarCellRenderProps & {
  isRange: boolean;
  /** Multi-select mode: selection is the caller's, not react-aria's. */
  selectedOverride?: boolean;
  /** Fill for the selected pill. Defaults to BoardUI's mid-accent tint. */
  edgeClassName?: string;
};

function DayCell(props: DayCellProps) {
  const {
    date,
    formattedDate,
    isSelectionStart,
    isSelectionEnd,
    isHovered,
    isFocusVisible,
    isDisabled,
    isOutsideMonth,
    isRange,
    selectedOverride,
    edgeClassName = "bg-blue-mid",
  } = props;

  if (isOutsideMonth) {
    return <div className="size-8" />;
  }

  const isSelected = selectedOverride ?? props.isSelected;
  const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();

  // A plain Calendar never sets isSelectionStart/End — those are range-only,
  // so without isRange the one selected day would fall through to the
  // "middle of a range" backdrop path instead of rendering as its own pill.
  const isSingleDay = isRange ? isSelectionStart && isSelectionEnd : isSelected;
  const isEdge = isRange ? isSelectionStart || isSelectionEnd : isSelected;

  // Cells sit 12px apart, so a selected range bridges that gap by extending
  // 6px toward each selected neighbour — never past the first/last column.
  const extendLeft = isRange && isSelected && !isSelectionStart && dayOfWeek !== 0;
  const extendRight = isRange && isSelected && !isSelectionEnd && dayOfWeek !== 6;

  return (
    <div className="relative size-8 mx-auto">
      <span
        aria-hidden
        className={cx(
          "absolute inset-y-0 bg-blue-soft transition-[opacity,border-radius] duration-100 ease-out",
          isSelectionStart ? "left-1/2" : extendLeft ? "-left-1.5" : "left-0",
          isSelectionEnd ? "right-1/2" : extendRight ? "-right-1.5" : "right-0",
          !isSelectionStart && dayOfWeek === 0 && "rounded-l-lg",
          !isSelectionEnd && dayOfWeek === 6 && "rounded-r-lg",
          isSelected && !isSingleDay ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cx(
          "relative flex size-8 items-center justify-center rounded-lg outline-none",
          !isSelected && isHovered && "bg-grey-light",
          "transition-colors duration-100 ease-out",
          isFocusVisible && "ring-2 ring-inset ring-blue",
        )}
      >
        <span
          aria-hidden
          className={cx(
            "absolute inset-0 transition-[opacity,border-radius] duration-100 ease-out",
            edgeClassName,
            isSingleDay && "rounded-lg",
            isSelectionStart && !isSingleDay && "rounded-l-lg",
            isSelectionEnd && !isSingleDay && "rounded-r-lg",
            isEdge ? "opacity-100" : "opacity-0",
          )}
        />
        <span className={cx("relative text-body-medium text-navy", isDisabled && "text-muted")}>
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

export function MonthPanel({
  offset,
  showPrev,
  showNext,
  bare = false,
  hideHeader = false,
  fluid = false,
  selectedDates,
  edgeClassNameFor,
}: {
  offset: number;
  showPrev?: boolean;
  showNext?: boolean;
  /** Skip the panel's card chrome so a caller can supply its own surface. */
  bare?: boolean;
  /** Skip the title + prev/next row when the caller renders its own. */
  hideHeader?: boolean;
  /** Fill the available width instead of BoardUI's fixed 326px popover panel,
   *  spreading the day columns evenly. For calendars embedded in a layout
   *  (a modal form field, a detail card) rather than a dropdown. */
  fluid?: boolean;
  /** Multi-select mode: ISO (YYYY-MM-DD) days to paint as selected. */
  selectedDates?: Set<string>;
  /** Per-day pill fill, for calendars that mark more than one kind of day. */
  edgeClassNameFor?: (iso: string) => string | undefined;
}) {
  // Works inside either a RangeCalendar or a plain Calendar — exactly one of
  // these contexts is non-null, and both expose the same visibleRange shape.
  const rangeState = useContext(RangeCalendarStateContext);
  const singleState = useContext(CalendarStateContext);
  const state = rangeState ?? singleState;
  const isRange = rangeState != null;
  const panelDate = state ? state.visibleRange.start.add({ months: offset }) : null;
  const title = panelDate
    ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(panelDate.toDate(getLocalTimeZone()))
    : "";

  return (
    <div
      className={cx(
        bare ? "w-[296px] shrink-0" : "w-[326px] shrink-0 rounded-2xl bg-white p-[15px] shadow-xs",
        fluid && "w-auto min-w-0 flex-1",
      )}
    >
      <div className="flex flex-col gap-5">
        {!hideHeader && (
          <div className="flex items-center justify-between">
            {showPrev ? (
              <RACButton
                slot="previous"
                className="flex size-4 cursor-pointer items-center justify-center rounded-[3px] text-muted outline-none transition-colors duration-150 ease hover:bg-grey-light"
              >
                <ChevronLeft16 />
              </RACButton>
            ) : (
              <span className="size-4" aria-hidden />
            )}
            <span className="flex-1 text-center text-body-medium text-navy">{title}</span>
            {showNext ? (
              <RACButton
                slot="next"
                className="flex size-4 cursor-pointer items-center justify-center rounded-[3px] text-muted outline-none transition-colors duration-150 ease hover:bg-grey-light"
              >
                <ChevronRight16 />
              </RACButton>
            ) : (
              <span className="size-4" aria-hidden />
            )}
          </div>
        )}
        <CalendarGrid
          offset={{ months: offset }}
          weekdayStyle="short"
          className={cx("-m-3 border-separate outline-none", fluid ? "w-[calc(100%+24px)]" : "self-start")}
          style={{ borderSpacing: "12px 12px" }}
        >
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="size-6 pb-0 text-center text-body-medium text-muted">
                {day.slice(0, 2)}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell date={date} className="p-0 outline-none">
                {(cellProps) => {
                  const iso = date.toString();
                  return (
                    <DayCell
                      {...cellProps}
                      isRange={isRange}
                      selectedOverride={selectedDates ? selectedDates.has(iso) : undefined}
                      edgeClassName={edgeClassNameFor?.(iso)}
                    />
                  );
                }}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </div>
  );
}
