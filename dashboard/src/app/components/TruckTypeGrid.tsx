import { useState } from "react";
import { SnowflakeIcon, CheckCircleIcon } from "@solar-icons/react/line-duotone";
import { TRUCK_TYPES } from "../lib/constants";
import type { TruckBaseClass } from "../lib/types";
import { TRUCK_IMAGES } from "../lib/truckImages";

const BASE_CLASSES: TruckBaseClass[] = ["Dababa", "Jumbo", "Suzuki Van", "Trailer"];

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
              className={`relative flex flex-col items-center gap-1 p-2 rounded-2xl border cursor-pointer transition-colors ${
                isActive ? "border-blue bg-blue-soft" : "border-border bg-white hover:border-blue/40"
              }`}
            >
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <CheckCircleIcon size={16} className="text-blue" />
                </div>
              )}
              <img src={TRUCK_IMAGES[cls]} alt={cls} className="w-full h-14 object-contain" />
              <span className="text-caption-1-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
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
                className={`text-left px-3 py-1.5 rounded-2lg border cursor-pointer transition-colors ${
                  selected ? "border-blue bg-blue-soft" : "border-border bg-white hover:border-blue/40"
                }`}
              >
                <div className="flex items-center gap-1.5 text-body-2-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
                  {t.config}
                  {t.requiresTempControl && <SnowflakeIcon size={12} className="text-blue" />}
                </div>
                <div className="text-caption-2-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
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
