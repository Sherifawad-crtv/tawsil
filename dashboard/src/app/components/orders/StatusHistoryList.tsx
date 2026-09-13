import { HistoryIcon } from "@solar-icons/react/linear";
import { formatDateTime } from "../../lib/format";
import type { StatusHistoryEntry } from "../../lib/types";

export default function StatusHistoryList({ history }: { history: StatusHistoryEntry[] }) {
  return (
    <div className="rounded-2xl bg-tile p-4">
      <div className="flex items-center gap-2 mb-4">
        <HistoryIcon size={16} className="text-muted" />
        <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Status History</h3>
      </div>
      <div className="flex flex-col">
        {[...history].reverse().map((entry, i) => (
          <div key={entry.id} className="flex gap-3 pb-4 last:pb-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-blue mt-1.5" />
              {i < history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
            </div>
            <div className="min-w-0 pb-1">
              <div className="text-body-medium text-navy">
                {entry.fromStatus ? `${entry.fromStatus} → ${entry.toStatus}` : entry.toStatus}
              </div>
              {entry.note && <div className="text-caption-1-regular text-muted mt-0.5">{entry.note}</div>}
              <div className="text-caption-1-regular text-muted mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                {formatDateTime(entry.timestamp)} · {entry.actor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
