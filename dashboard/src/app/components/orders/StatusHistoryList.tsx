import { useEffect, useRef } from "react";
import { HistoryIcon } from "@solar-icons/react/linear";
import { cx } from "../../lib/cx";
import { formatDateTime } from "../../lib/format";
import type { StatusHistoryEntry } from "../../lib/types";

/**
 * The order's progress, read left to right — oldest step first, the current
 * one last and emphasised. Horizontal because it leads the order page full
 * width; it scrolls sideways when the steps outgrow the card.
 */
export default function StatusHistoryList({ history }: { history: StatusHistoryEntry[] }) {
  const lastIndex = history.length - 1;
  const scrollerRef = useRef<HTMLOListElement>(null);

  // Where the steps overflow (narrow screens, long histories), the current
  // status is the end of the track — start there rather than at the oldest step.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [history.length]);

  return (
    <div className="rounded-2xl bg-white border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <HistoryIcon size={16} className="text-muted" />
        <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Status History</h3>
      </div>
      <ol ref={scrollerRef} className="flex overflow-x-auto">
        {history.map((entry, i) => {
          const isCurrent = i === lastIndex;
          return (
            <li key={entry.id} className="flex-1 min-w-[170px]">
              <div className="flex items-center">
                <span
                  className={cx(
                    "w-2.5 h-2.5 rounded-full flex-shrink-0",
                    isCurrent ? "bg-blue ring-4 ring-blue-soft" : "bg-blue/40",
                  )}
                />
                {i < lastIndex && <span className="h-px flex-1 bg-border ml-1.5" />}
              </div>
              <div className="mt-3 pr-4">
                <div className={cx("text-body-medium", isCurrent ? "text-navy" : "text-muted")}>
                  {entry.toStatus}
                </div>
                {entry.note && <div className="text-caption-1-regular text-muted mt-0.5">{entry.note}</div>}
                <div className="text-caption-1-regular text-muted mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                  {formatDateTime(entry.timestamp)} · {entry.actor}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
