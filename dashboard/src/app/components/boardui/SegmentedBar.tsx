import { cx } from "../../lib/cx";

export interface BarSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

/**
 * A total split into parts, drawn once as a stacked bar and again as a
 * legend with each part's share. StatusBreakdownBar and MoneySplitBar were
 * this exact shape twice over - same track, same legend row, different
 * data - so this is the one component both now render through.
 */
export function SegmentedBar({
  segments,
  formatValue,
  showValue = true,
  showPercent = true,
  className,
}: {
  segments: BarSegment[];
  /** How each segment's value reads in the legend; defaults to the raw number. */
  formatValue?: (value: number) => string;
  /** The formatted value in the legend - off for a percent-only legend (the money split). */
  showValue?: boolean;
  /** Percent-of-total in the legend - off for a count-only legend (status breakdown). */
  showPercent?: boolean;
  className?: string;
}) {
  const total = Math.max(1, segments.reduce((sum, s) => sum + s.value, 0));
  const format = formatValue ?? ((v: number) => String(v));

  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-chart-track)" }}>
        {segments.map(
          (s) =>
            s.value > 0 && (
              <div
                key={s.key}
                style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
                title={`${s.label}: ${format(s.value)}`}
              />
            )
        )}
      </div>

      <div className="flex flex-col gap-2">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-caption-1-regular text-navy min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="truncate flex-1" style={{ fontFamily: "var(--font-sub)" }}>
              {s.label}
            </span>
            <span className="text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
              {[showValue && format(s.value), showPercent && `${Math.round((s.value / total) * 100)}%`]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
