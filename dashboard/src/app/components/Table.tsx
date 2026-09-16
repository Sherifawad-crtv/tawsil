import type { Ref } from "react";
import {
  Cell,
  Column,
  Row,
  Table as AriaTable,
  TableBody,
  TableHeader,
} from "react-aria-components";
import type { TableProps as AriaTableProps } from "react-aria-components";
import { cx } from "../lib/cx";

/**
 * BoardUI's base/table primitive — react-aria `Table` for semantic markup,
 * keyboard navigation and row actions.
 *
 * react-aria's `Column`, `Row`, `Cell`, `TableHeader` and `TableBody` are
 * collection components: react-aria introspects them at build time, so they
 * can't be wrapped without losing that behaviour. They are re-exported as-is
 * and BoardUI styling is applied through scoped CSS keyed on `.bui-table`
 * (see styles/index.css). Only the root `<Table>` is wrapped, to add the
 * scroll container and the size flag.
 *
 * Sizes: `md` (default) and `sm` (denser rows), set once via the size flag.
 */

export type TableSize = "sm" | "md";

export interface TableProps extends Omit<AriaTableProps, "className"> {
  size?: TableSize;
  className?: string;
  /** Class for the scroll container that wraps the table. */
  containerClassName?: string;
  ref?: Ref<HTMLTableElement>;
}

export function Table({ size = "md", className, containerClassName, ref, ...props }: TableProps) {
  return (
    <div className={cx("w-full overflow-x-auto rounded-2xl bg-white border border-border", containerClassName)}>
      <AriaTable
        ref={ref}
        {...props}
        className={cx("bui-table", size === "sm" && "bui-table-sm", className)}
      />
    </div>
  );
}

export { TableHeader, Column as TableColumn, TableBody, Row as TableRow, Cell as TableCell };
