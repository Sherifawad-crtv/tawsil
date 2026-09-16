import type { ReactNode } from "react";

/**
 * The one page header. Title (plus an optional badge beside it) on the left,
 * actions opposite on the right; stacked on phones, side by side from `sm`.
 * Every screen uses this so headers line up across pages and devices.
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
}: {
  title: string;
  /** A line under the title — text, or a row of contact details. */
  subtitle?: ReactNode;
  /** Sits inline after the title (status, active state). */
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-title-1-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <div className="mt-1 text-body-2-regular text-muted">{subtitle}</div>}
      </div>
      {action && <div className="flex items-center gap-2 flex-wrap flex-shrink-0">{action}</div>}
    </div>
  );
}
