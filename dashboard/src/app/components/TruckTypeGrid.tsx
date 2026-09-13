import { useState } from "react";
import { Snowflake, Check } from "lucide-react";
import { TRUCK_TYPES } from "../lib/constants";
import type { TruckBaseClass } from "../lib/types";
import imgDababa from "../../assets/truck-dababa.png";
import imgJumbo from "../../assets/truck-jumbo.png";
import imgVan from "../../assets/truck-van.png";
import imgTrailer from "../../assets/truck-trailer.png";

const BASE_CLASSES: TruckBaseClass[] = ["Dababa", "Jumbo", "Suzuki Van", "Trailer"];

const BASE_CLASS_IMAGES: Record<TruckBaseClass, string> = {
  Dababa: imgDababa,
  Jumbo: imgJumbo,
  "Suzuki Van": imgVan,
  Trailer: imgTrailer,
};

export default function TruckTypeGrid({ value, onChange }: { value: string; onChange: (truckTypeId: string) => void }) {
  const selectedType = TRUCK_TYPES.find((t) => t.id === value);
  const [activeClass, setActiveClass] = useState<TruckBaseClass | null>(selectedType?.baseClass ?? null);

  function selectBaseClass(cls: TruckBaseClass) {
    setActiveClass(cls);
    const configs = TRUCK_TYPES.filter((t) => t.baseClass === cls);
    // Keep the equivalent configuration when switching truck body (e.g. stay on
    // "Box" when going from Jumbo to Trailer); otherwise default to the first.
    const keep = configs.find((t) => t.config === selectedType?.config);
    onChange((keep ?? configs[0]).id);
  }

  const activeConfigs = activeClass ? TRUCK_TYPES.filter((t) => t.baseClass === activeClass) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BASE_CLASSES.map((cls) => {
          const isActive = activeClass === cls;
          return (
            <button
              type="button"
              key={cls}
              onClick={() => selectBaseClass(cls)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-[var(--radius-card)] border cursor-pointer transition-colors ${
                isActive ? "border-blue bg-blue-soft" : "border-border bg-white hover:border-blue/40"
              }`}
            >
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              )}
              <img src={BASE_CLASS_IMAGES[cls]} alt={cls} className="w-full h-14 object-contain" />
              <span className="text-[12px] font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
                {cls}
              </span>
            </button>
          );
        })}
      </div>

      {activeClass && (
        <div className="flex flex-wrap gap-2">
          {activeConfigs.map((t) => {
            const selected = value === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`text-left px-3 py-1.5 rounded-[var(--radius-control)] border cursor-pointer transition-colors ${
                  selected ? "border-blue bg-blue-soft" : "border-border bg-white hover:border-blue/40"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
                  {t.config}
                  {t.requiresTempControl && <Snowflake size={12} className="text-blue" />}
                </div>
                <div className="text-[11px] text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                  {t.capacityMinT}–{t.capacityMaxT}t
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
