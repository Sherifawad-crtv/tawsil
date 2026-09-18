import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

/**
 * BoardUI's settings row recipe (components/application/settings/
 * settings-rows.tsx): a card whose rows divide themselves with a border
 * that stops short of the left edge, label left, control right. Structure
 * and spacing are theirs; the surface is this dashboard's own white
 * bordered card, the same shell InsightCard and every other content card
 * here uses - BoardUI's own card token (background/secondary, ~#f7f7f7) is
 * a hair off this app's own page background and would read as an
 * unbordered, barely-visible card next to every neighbouring one.
 */
export function SettingsCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("flex w-full flex-col rounded-2xl bg-white border border-border pl-4", className)}>
      {children}
    </div>
  );
}

export function SettingsSectionLabel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p
      className={cx("w-full text-caption-1-semibold uppercase tracking-wide text-muted", className)}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </p>
  );
}

/** One label + control row. Rows separate themselves; the last has no border. */
export function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-[56px] w-full items-center justify-between gap-4 py-3 pr-4 border-b border-border last:border-b-0">
      <div className="flex min-w-0 flex-col">
        <p className="text-body-2-regular text-navy" style={{ fontFamily: "var(--font-sub)" }}>{label}</p>
        {description && <p className="text-caption-1-regular text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
