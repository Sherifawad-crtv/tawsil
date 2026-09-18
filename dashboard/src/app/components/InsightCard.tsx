import type { ReactNode } from "react";

/** Flat tinted "data card" shell (icon tiles, chart/stat cards) - no border or shadow, unlike the app's bordered-white content cards. */
export default function InsightCard({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** For layout only - e.g. flex-1 so the card fills its column. */
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl bg-white border border-border p-4 flex flex-col gap-3 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-caption-1-regular text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
