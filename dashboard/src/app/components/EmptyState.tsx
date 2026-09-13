import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";

export default function EmptyState({ icon: Icon, title, note }: { icon: SolarIcon; title: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 gap-1.5">
      <div className="w-10 h-10 rounded-2xl bg-tile flex items-center justify-center text-muted mb-1">
        <Icon size={18} />
      </div>
      <div className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
        {title}
      </div>
      {note && <div className="text-body-2-regular text-muted max-w-xs">{note}</div>}
    </div>
  );
}
