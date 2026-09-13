import { useMemo, useState } from "react";
import { MapPointSearchIcon } from "@solar-icons/react/linear";
import EmptyState from "./EmptyState";
import CsvExportButton from "./CsvExportButton";
import { waypointAnalytics } from "../lib/selectors";
import { formatDate } from "../lib/format";
import type { Order } from "../lib/types";

type RangeKey = "week" | "month" | "quarter" | "year" | "all";
const RANGE_DAYS: Record<RangeKey, number | null> = { week: 7, month: 30, quarter: 90, year: 365, all: null };
const RANGE_LABELS: Record<RangeKey, string> = { week: "Week", month: "Month", quarter: "Quarter", year: "Year", all: "All Time" };

export default function WaypointAnalyticsTable({ orders, filenamePrefix }: { orders: Order[]; filenamePrefix: string }) {
  const [range, setRange] = useState<RangeKey>("month");

  const filteredOrders = useMemo(() => {
    const days = RANGE_DAYS[range];
    if (days === null) return orders;
    const cutoff = Date.now() - days * 86400_000;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
  }, [orders, range]);

  const rows = useMemo(() => waypointAnalytics(filteredOrders), [filteredOrders]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="inline-flex rounded-2lg border border-border p-1 bg-grey-light">
          {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1.5 rounded-lg text-caption-1-medium cursor-pointer transition-colors ${
                range === key ? "bg-white text-navy shadow-xs" : "text-muted"
              }`}
              style={{ fontFamily: "var(--font-sub)" }}
            >
              {RANGE_LABELS[key]}
            </button>
          ))}
        </div>
        <CsvExportButton
          filename={`${filenamePrefix}-waypoint-analytics.csv`}
          headers={["Rank", "Location", "Visits", "Last Visited", "Type"]}
          rows={rows.map((r, i) => [i + 1, r.location, r.visits, formatDate(r.lastVisited), r.type])}
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={MapPointSearchIcon} title="No waypoint data in this range" />
      ) : (
        <div className="overflow-x-auto rounded-2lg border border-border">
          <table className="w-full text-body-2-regular">
            <thead>
              <tr className="bg-grey-light text-left text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                <th className="px-4 py-2.5 font-medium">Rank</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium">Visits</th>
                <th className="px-4 py-2.5 font-medium">Last Visited</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.location} className="border-t border-border">
                  <td className="px-4 py-2.5 text-navy">{i + 1}</td>
                  <td className="px-4 py-2.5 text-navy">{r.location}</td>
                  <td className="px-4 py-2.5 text-navy">{r.visits}</td>
                  <td className="px-4 py-2.5 text-muted" style={{ fontFamily: "var(--font-mono)" }}>{formatDate(r.lastVisited)}</td>
                  <td className="px-4 py-2.5 text-navy">{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
