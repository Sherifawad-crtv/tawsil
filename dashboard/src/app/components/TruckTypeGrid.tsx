import { Snowflake } from "lucide-react";
import { TRUCK_TYPES, truckTypeLabel } from "../lib/constants";

export default function TruckTypeGrid({ value, onChange }: { value: string; onChange: (truckTypeId: string) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2.5">
      {TRUCK_TYPES.map((t) => {
        const selected = value === t.id;
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`text-left px-4 py-3 rounded-[var(--radius-control)] border cursor-pointer transition-colors ${
              selected ? "border-blue bg-blue-soft" : "border-border bg-white hover:border-blue/40"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
                {truckTypeLabel(t)}
              </span>
              {t.requiresTempControl && <Snowflake size={14} className="text-blue flex-shrink-0" />}
            </div>
            <div className="mt-1 text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
              {t.capacityMinT}–{t.capacityMaxT}t payload
            </div>
          </button>
        );
      })}
    </div>
  );
}
