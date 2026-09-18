import { useState, type ReactNode } from "react";
import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../Table";

export interface RollupColumn<T> {
  id: string;
  label: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
}

/**
 * The per-client and per-contractor money rollups. Same shell for both, since
 * they differ only in their columns and their footnote.
 */
export default function RollupTable<T extends { id: string }>({
  icon: Icon,
  title,
  rows,
  columns,
  limit = 5,
  footnote,
  emptyLabel,
}: {
  icon: SolarIcon;
  title: string;
  rows: T[];
  columns: RollupColumn<T>[];
  limit?: number;
  footnote?: string;
  emptyLabel: string;
}) {
  // "See all" expands in place rather than linking away - there's no
  // separate all-rows page for it to point at.
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? rows : rows.slice(0, limit);

  return (
    <div className="rounded-2xl bg-white border border-border p-4 flex flex-col gap-3 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-grey-light flex-shrink-0">
            <Icon size={17} strokeWidth={2.25} className="text-royal" />
          </span>
          <h3 className="text-body-semibold text-navy truncate" style={{ fontFamily: "var(--font-sub)" }}>
            {title}
          </h3>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-caption-1-regular text-muted whitespace-nowrap">
            {expanded ? `Showing all ${rows.length}` : `Showing top ${shown.length} of ${rows.length}`}
          </p>
          {rows.length > limit && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-caption-1-semibold text-blue cursor-pointer hover:underline"
              style={{ fontFamily: "var(--font-sub)" }}
            >
              {expanded ? "Show top " + limit : "See all"}
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-body-2-regular text-muted">{emptyLabel}</p>
      ) : (
        <Table aria-label={title} size="sm" containerClassName="border-0 rounded-none">
          <TableHeader>
            {columns.map((col) => (
              <TableColumn
                key={col.id}
                isRowHeader={col.align !== "right"}
                className={col.align === "right" ? "text-right" : undefined}
              >
                {col.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {shown.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.id} className={col.align === "right" ? "text-right" : undefined}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {footnote && <p className="text-caption-1-regular text-muted">{footnote}</p>}
    </div>
  );
}
