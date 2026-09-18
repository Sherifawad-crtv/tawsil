import type { ReactNode } from "react";
import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";

const TONE = {
  blue: { value: "text-blue", tile: "bg-blue-soft", icon: "text-blue" },
  amber: { value: "text-status-pending", tile: "bg-[#FEF3E2]", icon: "text-status-pending" },
  green: { value: "text-status-completed", tile: "bg-[#E7F6EC]", icon: "text-status-completed" },
  navy: { value: "text-navy", tile: "bg-tile", icon: "text-navy" },
} as const;

/**
 * One headline money figure. `liability` marks a figure that is held rather
 * than owned - drawn with a dashed edge and a badge so VAT never reads as
 * income sitting next to the earnings card.
 */
export default function FinancialCard({
  icon: Icon,
  label,
  value,
  caption,
  tone = "blue",
  liability = false,
  footer,
}: {
  icon: SolarIcon;
  label: string;
  value: string;
  caption: string;
  tone?: keyof typeof TONE;
  liability?: boolean;
  footer?: ReactNode;
}) {
  const t = TONE[tone];

  return (
    <section
      className={`relative flex flex-col gap-3 rounded-2xl bg-white p-4 min-w-0 ${
        liability ? "border border-dashed border-grey" : "border border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 ${t.tile}`}>
          <Icon size={17} strokeWidth={2.25} className={t.icon} />
        </span>
        {liability && (
          <span
            className="rounded-md px-1.5 py-0.5 text-caption-2-semibold uppercase tracking-wide text-muted bg-grey-light"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Liability
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-body-2-regular text-muted">{label}</p>
        <p className="mt-1.5 flex items-baseline gap-1.5 min-w-0">
          <span className={`text-title-1-semibold ${t.value} truncate`} style={{ fontFamily: "var(--font-heading)" }}>
            {value}
          </span>
          <span className="text-caption-1-regular text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
            EGP
          </span>
        </p>
        <p className="mt-1 text-caption-1-regular text-muted">{caption}</p>
      </div>

      {footer && <div className="pt-3 border-t border-border text-caption-1-regular text-muted">{footer}</div>}
    </section>
  );
}
