import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";
import { formatAmount } from "../../lib/format";

/**
 * A headline figure on solid brand fill - the dashboard's existing way of
 * making one number dominate a grid (see the Home overview's stat tiles).
 * Reserved for the two figures an exec reads first; everything else stays
 * on white so these keep their weight.
 */
export default function SolidMoneyStat({
  icon: Icon,
  label,
  value,
  caption,
  background,
  footer,
}: {
  icon: SolarIcon;
  label: string;
  value: number;
  caption: string;
  background: string;
  footer?: string;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl p-4 min-w-0" style={{ backgroundColor: background }}>
      <div className="flex items-center gap-2.5">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
        >
          <Icon size={18} strokeWidth={2.25} color="#ffffff" />
        </span>
        <p className="text-caption-1-regular truncate" style={{ color: "rgba(255,255,255,0.72)" }}>
          {label}
        </p>
      </div>

      <div className="min-w-0">
        <p className="flex items-baseline gap-1.5 min-w-0">
          <span
            className="text-title-1-semibold text-white truncate"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {formatAmount(value)}
          </span>
          <span
            className="text-caption-1-regular flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)" }}
          >
            EGP
          </span>
        </p>
        <p className="mt-1 text-caption-1-regular" style={{ color: "rgba(255,255,255,0.72)" }}>
          {caption}
        </p>
      </div>

      {footer && (
        <p
          className="pt-3 text-caption-1-regular"
          style={{ borderTop: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.72)" }}
        >
          {footer}
        </p>
      )}
    </section>
  );
}
