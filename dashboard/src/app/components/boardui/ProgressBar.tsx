import { cx } from "../../lib/cx";

/**
 * One shared linear-progress primitive, replacing five near-identical
 * hand-drawn bars that had each grown its own div-and-inline-width markup
 * (Stepper's form-step track, the monthly-contract % bar on both the list
 * and the detail page, and VehicleInspector's six-month traffic bars).
 * Track on the ported chart-track token; fill stays brand blue, the
 * dashboard's own "in progress toward completion" color everywhere else.
 *
 * `segments` draws N discrete pips instead of one continuous fill - the
 * form Stepper's shape - and `direction="vertical"` draws bottom-up bars
 * of independent heights for a small bar-chart, not a single 0..100 value.
 */
export function ProgressBar({
  value,
  max = 100,
  segments,
  activeSegment,
  direction = "horizontal",
  bars,
  peak,
  size = "md",
  fillClassName = "bg-blue",
  className,
}: {
  /** 0..max, for the continuous (non-segmented, non-vertical) form. */
  value?: number;
  max?: number;
  /** Discrete step count - draws `segments` pips, `activeSegment` of them filled. */
  segments?: number;
  activeSegment?: number;
  direction?: "horizontal" | "vertical";
  /** Vertical form: one bar per entry, each independently sized against `peak`. */
  bars?: { label: string; value: number }[];
  peak?: number;
  size?: "sm" | "md";
  /** Continuous form only - defaults to brand blue; override when the fill carries its own meaning (e.g. amber for a ranking, not progress). */
  fillClassName?: string;
  className?: string;
}) {
  const trackHeight = size === "sm" ? "h-1.5" : "h-2";

  if (direction === "vertical" && bars) {
    const top = Math.max(1, peak ?? Math.max(...bars.map((b) => b.value)));
    return (
      <div className={cx("flex flex-col gap-1.5", className)}>
        <div className="flex items-end gap-1.5 h-12" aria-hidden>
          {bars.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max(4, (b.value / top) * 100)}%`,
                  backgroundColor: b.value ? "var(--color-chart-6-active)" : "var(--color-chart-track)",
                }}
                title={`${b.label}: ${b.value}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {bars.map((b) => (
            <span
              key={b.label}
              className="text-caption-2-regular text-muted flex-1 text-center"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (segments) {
    return (
      <div className={cx("flex items-center gap-1.5", className)}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={cx("rounded-full flex-1 transition-colors", trackHeight)}
            style={{ backgroundColor: i + 1 <= (activeSegment ?? 0) ? "var(--color-blue)" : "var(--color-chart-track)" }}
          />
        ))}
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100));
  return (
    <div
      className={cx("rounded-full overflow-hidden", trackHeight, className)}
      style={{ backgroundColor: "var(--color-chart-track)" }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cx("h-full rounded-full transition-[width]", fillClassName)} style={{ width: `${pct}%` }} />
    </div>
  );
}
