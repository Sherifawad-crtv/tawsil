import type { ReactNode } from "react";

/** Flat tinted "data card" shell (icon tiles, chart/stat cards) - no border or shadow, unlike the app's bordered-white content cards. */
export default function InsightCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-tile p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-[11px] text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
