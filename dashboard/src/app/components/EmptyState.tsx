import type { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, title, note }: { icon: LucideIcon; title: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 gap-2">
      <div className="w-11 h-11 rounded-2xl bg-grey-light flex items-center justify-center text-muted mb-1">
        <Icon size={20} />
      </div>
      <div className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
        {title}
      </div>
      {note && <div className="text-xs text-muted max-w-xs">{note}</div>}
    </div>
  );
}
