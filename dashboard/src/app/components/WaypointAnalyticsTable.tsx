import { useMemo, useState } from "react";
import { MapPointSearchIcon } from "@solar-icons/react/bold-duotone";
import EmptyState from "./EmptyState";
import CsvExportButton from "./CsvExportButton";
import SegmentedControl from "./SegmentedControl";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "./Table";
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
        <SegmentedControl
          aria-label="Date range"
          value={range}
          onChange={setRange}
          options={(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => ({ value: key, label: RANGE_LABELS[key] }))}
        />
        <CsvExportButton
          filename={`${filenamePrefix}-waypoint-analytics.csv`}
          headers={["Rank", "Location", "Visits", "Last Visited", "Type"]}
          rows={rows.map((r, i) => [i + 1, r.location, r.visits, formatDate(r.lastVisited), r.type])}
        />
      </div>

      <Table aria-label="Waypoint analytics">
        <TableHeader>
          <TableColumn isRowHeader>Rank</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Visits</TableColumn>
          <TableColumn>Last Visited</TableColumn>
          <TableColumn>Type</TableColumn>
        </TableHeader>
        <TableBody renderEmptyState={() => <EmptyState icon={MapPointSearchIcon} title="No waypoint data in this range" />}>
          {rows.map((r, i) => (
            <TableRow key={r.location} id={r.location}>
              <TableCell style={{ fontFamily: "var(--font-mono)" }}>{i + 1}</TableCell>
              <TableCell>{r.location}</TableCell>
              <TableCell style={{ fontFamily: "var(--font-mono)" }}>{r.visits}</TableCell>
              <TableCell className="text-muted" style={{ fontFamily: "var(--font-mono)" }}>{formatDate(r.lastVisited)}</TableCell>
              <TableCell className="text-muted">{r.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
