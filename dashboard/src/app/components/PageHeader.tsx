import type { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-title-1-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-body-2-regular text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
