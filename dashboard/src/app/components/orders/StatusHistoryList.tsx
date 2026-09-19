import { RoutingIcon } from "@solar-icons/react/bold-duotone";
import { cx } from "../../lib/cx";
import { formatDateTime } from "../../lib/format";
import type { OrderStatus, StatusHistoryEntry } from "../../lib/types";

// The pipeline every order travels. Cancelled isn't a step on it - it's an
// exit, drawn in place of whatever was left when it happened.
const PIPELINE: OrderStatus[] = ["Pending", "Assigned", "In Progress", "Completed"];

/**
 * The trip's progress as a bar: every step of the pipeline, with the ones
 * already passed filled, the current one emphasised, and the ones still to
 * come hollow. Each reached step carries when it happened and who did it,
 * from the order's history. Leads the order page full width.
 */
export default function StatusHistoryList({ history }: { history: StatusHistoryEntry[] }) {
  const last = history[history.length - 1];
  const current: OrderStatus = last?.toStatus ?? "Pending";
  const cancelled = current === "Cancelled";

  // The last pipeline status the order actually reached before it stopped.
  const reachedIndex = cancelled
    ? Math.max(0, ...history.filter((h) => h.toStatus !== "Cancelled").map((h) => PIPELINE.indexOf(h.toStatus)))
    : PIPELINE.indexOf(current);

  // Steps shown: the pipeline up to the reached one, then Cancelled if it
  // ended there, else the rest of the pipeline still ahead.
  const steps: OrderStatus[] = cancelled ? [...PIPELINE.slice(0, reachedIndex + 1), "Cancelled"] : PIPELINE;
  const currentIndex = cancelled ? steps.length - 1 : reachedIndex;

  const entryFor = (status: OrderStatus) => [...history].reverse().find((h) => h.toStatus === status);

  return (
    <div className="rounded-2xl bg-white border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <RoutingIcon size={16} className="text-muted" />
        <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Trip Status</h3>
      </div>
      <ol className="flex overflow-x-auto">
        {steps.map((status, i) => {
          const done = i < currentIndex;
          const isCurrent = i === currentIndex;
          const ahead = i > currentIndex;
          const isCancel = status === "Cancelled";
          const entry = entryFor(status);
          const dot = isCancel
            ? "bg-status-cancelled ring-4 ring-[#FDECEC]"
            : isCurrent
              ? "bg-blue ring-4 ring-blue-soft"
              : done
                ? "bg-blue"
                : "bg-white border-2 border-grey";
          // The track segment after this dot is filled if the step after it has been reached.
          const trackFilled = i < currentIndex;

          return (
            <li key={status} className="flex-1 min-w-[150px]">
              <div className="flex items-center">
                <span className={cx("w-2.5 h-2.5 rounded-full flex-shrink-0", dot)} />
                {i < steps.length - 1 && (
                  <span className={cx("h-0.5 flex-1 ml-1.5 mr-1.5 rounded-full", trackFilled ? "bg-blue" : "bg-border")} />
                )}
              </div>
              <div className="mt-3 pr-4">
                <div
                  className={cx(
                    "text-body-medium",
                    isCancel ? "text-status-cancelled" : isCurrent ? "text-navy" : ahead ? "text-muted" : "text-navy",
                  )}
                >
                  {status}
                </div>
                {entry ? (
                  <>
                    {entry.note && <div className="text-caption-1-regular text-muted mt-0.5">{entry.note}</div>}
                    <div className="text-caption-1-regular text-muted mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                      {formatDateTime(entry.timestamp)} · {entry.actor}
                    </div>
                  </>
                ) : (
                  <div className="text-caption-1-regular text-muted mt-0.5">{ahead ? "Upcoming" : "—"}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
