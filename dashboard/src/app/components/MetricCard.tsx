import type { LucideIcon } from "lucide-react";

export default function MetricCard({
  label,
  value,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "blue" | "navy" | "amber" | "green";
}) {
  const accentBg: Record<string, string> = {
    blue: "bg-blue-soft text-blue",
    navy: "bg-[#EEEAFB] text-royal",
    amber: "bg-[#FEF3E2] text-status-pending",
    green: "bg-[#E7F6EC] text-status-completed",
  };

  return (
    <div className="rounded-[var(--radius-card)] bg-white border border-border p-4 flex items-center gap-3 shadow-[0_2px_12px_rgba(4,0,51,0.04)]">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accentBg[accent]}`}>
        <Icon size={17} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <div
          className="text-xl leading-none text-navy"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {value}
        </div>
        <div
          className="mt-1 text-[11px] text-muted uppercase tracking-wide leading-snug"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
