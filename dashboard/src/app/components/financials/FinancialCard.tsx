import type { ReactNode } from "react";
import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";
import { formatAmount } from "../../lib/format";

/**
 * One money figure, as a plain white content card - the same shell as every
 * other card in this dashboard. The only colour is the icon, which carries
 * its series' hue so the card ties back to the split bar; the figure itself
 * stays navy like every other number in the app.
 */
export default function FinancialCard({
  icon: Icon,
  iconColor,
  label,
  value,
  caption,
  footer,
}: {
  icon: SolarIcon;
  iconColor: string;
  label: string;
  value: number;
  caption: string;
  footer?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white border border-border p-4 min-w-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-grey-light flex-shrink-0">
          <Icon size={17} strokeWidth={2.25} color={iconColor} />
        </span>
        <p className="text-body-2-regular text-muted truncate">{label}</p>
      </div>

      <div className="min-w-0">
        <p className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-title-2-semibold text-navy truncate" style={{ fontFamily: "var(--font-heading)" }}>
            {formatAmount(value)}
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
