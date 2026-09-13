import type { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, title, note }: { icon: LucideIcon; title: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 gap-1.5">
      <div className="w-9 h-9 rounded-[var(--radius-card)] bg-grey-light flex items-center justify-center text-muted mb-1">
        <Icon size={16} />
      </div>
      <div className="text-[13px] font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
        {title}
      </div>
      {note && <div className="text-xs text-muted max-w-xs">{note}</div>}
    </div>
  );
}
