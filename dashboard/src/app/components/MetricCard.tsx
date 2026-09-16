import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";
import { Chip } from "./Chip";

const ACCENT_ICON: Record<string, string> = {
  blue: "text-blue",
  navy: "text-royal",
  amber: "text-status-pending",
  green: "text-status-completed",
};

export default function MetricCard({
  label,
  value,
  icon: Icon,
  accent = "blue",
  delta,
  deltaColor,
}: {
  label: string;
  value: number | string;
  icon: SolarIcon;
  accent?: "blue" | "navy" | "amber" | "green";
  /** Comparison readout ("+2 vs yesterday") - omit when there's no honest baseline to compare against. */
  delta?: string;
  deltaColor?: "positive" | "negative" | "neutral";
}) {
  return (
    <section className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white border border-border p-4 min-w-0">
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-grey-light flex-shrink-0">
        <Icon size={18} strokeWidth={2.25} className={ACCENT_ICON[accent]} />
      </span>
      <div className="flex flex-col gap-0.5 w-full min-w-0">
        <p className="text-body-2-regular text-muted truncate" style={{ fontFamily: "var(--font-sub)" }}>
          {label}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-title-1-medium leading-none text-navy whitespace-nowrap" style={{ fontFamily: "var(--font-heading)" }}>
            {value}
          </p>
          {delta && <Chip color={deltaColor ?? "neutral"}>{delta}</Chip>}
        </div>
      </div>
    </section>
  );
}
