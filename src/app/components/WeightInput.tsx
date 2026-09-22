import { useState, useRef, useEffect } from "react";
import ScaleRounded from "./icons/ScaleRounded";
import InfoRounded from "./icons/InfoRounded";

type Unit = "kg" | "ton";

interface Chip {
  label: string;
  valueKg: number;
}

// Capacity per vehicle type (kg)
const VEHICLE_CAPACITY: Record<string, number> = {
  pickup: 1000,
  van: 2000,
  trailer: 5000,
  jumbo: 10000,
};

function getCapacityKg(vehicleType: string): number {
  return VEHICLE_CAPACITY[vehicleType] ?? 5000;
}

function getChipsForVehicle(vehicleType: string): Chip[] {
  const cap = getCapacityKg(vehicleType);
  if (cap <= 1000) return [
    { label: "250 kg", valueKg: 250 },
    { label: "500 kg", valueKg: 500 },
    { label: "1 ton", valueKg: 1000 },
  ];
  if (cap <= 2000) return [
    { label: "500 kg", valueKg: 500 },
    { label: "1 ton", valueKg: 1000 },
    { label: "2 tons", valueKg: 2000 },
  ];
  if (cap <= 5000) return [
    { label: "1 ton", valueKg: 1000 },
    { label: "3 tons", valueKg: 3000 },
    { label: "5 tons", valueKg: 5000 },
  ];
  return [
    { label: "3 tons", valueKg: 3000 },
    { label: "5 tons", valueKg: 5000 },
    { label: "10 tons", valueKg: 10000 },
  ];
}

function formatDisplay(valueKg: number, unit: Unit): string {
  if (unit === "ton") {
    const t = valueKg / 1000;
    return t % 1 === 0 ? String(t) : t.toFixed(2);
  }
  return String(valueKg);
}

function parseToKg(input: string, unit: Unit): number {
  const num = parseFloat(input);
  if (isNaN(num) || num < 0) return 0;
  return unit === "ton" ? num * 1000 : num;
}

/* ── Animated ring gauge ── */
function WeightGauge({ fraction, overloaded }: { fraction: number; overloaded: boolean }) {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75; // 270 degree arc
  const filled = arc * Math.min(fraction, 1);
  const color = overloaded ? "#DC2626" : "#1253FA";

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="absolute" style={{ top: "-10px", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke="#E8E8E5"
        strokeWidth="6"
        strokeDasharray={`${arc} ${circ}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform="rotate(135 70 70)"
      />
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${filled} ${circ}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform="rotate(135 70 70)"
        style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1), stroke 0.3s" }}
      />
    </svg>
  );
}

export default function WeightInput({
  value,
  onChange,
  vehicleType = "trailer",
}: {
  value?: number;
  onChange?: (kg: number) => void;
  vehicleType?: string;
}) {
  const [unit, setUnit] = useState<Unit>("kg");
  const [valueKg, setValueKg] = useState(value || 0);
  const [inputValue, setInputValue] = useState(value ? String(value) : "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display when unit changes
  useEffect(() => {
    if (valueKg > 0) {
      setInputValue(formatDisplay(valueKg, unit));
    }
  }, [unit]);

  const handleInputChange = (raw: string) => {
    // Allow only digits and one decimal point
    const cleaned = raw.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setInputValue(cleaned);
    const kg = parseToKg(cleaned, unit);
    setValueKg(kg);
    onChange?.(kg);
  };

  const handleChipSelect = (chip: Chip) => {
    setValueKg(chip.valueKg);
    setInputValue(formatDisplay(chip.valueKg, unit));
    onChange?.(chip.valueKg);
  };

  const handleUnitToggle = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const capacityKg = getCapacityKg(vehicleType);
  const chips = getChipsForVehicle(vehicleType);
  const activeChip = chips.find((c) => c.valueKg === valueKg);
  const gaugeFraction = Math.min(valueKg / capacityKg, 1);
  const overloaded = valueKg > capacityKg;

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── Decorative gauge background + icon ── */}
      <div className="relative flex flex-col items-center mb-2" style={{ height: "120px", width: "140px" }}>
        <WeightGauge fraction={gaugeFraction} overloaded={overloaded} />
        <div className="flex items-center justify-center" style={{ marginTop: "28px" }}>
          <ScaleRounded sx={{ fontSize: 48, color: "#040033" }} />
        </div>
      </div>

      {/* Capacity label */}
      <p className="mb-4" style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: "11px",
        color: overloaded ? "#DC2626" : "#9CA3AF",
        letterSpacing: "0.04em",
        transition: "color 0.3s",
      }}>
        Max capacity: {capacityKg >= 1000 ? `${capacityKg / 1000} ton${capacityKg >= 2000 ? "s" : ""}` : `${capacityKg} kg`}
      </p>

      {/* ── Unit Toggle ── */}
      <div
        className="flex items-center rounded-2xl p-1 mb-6"
        style={{ backgroundColor: "#F0F0EE" }}
      >
        {(["kg", "ton"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => handleUnitToggle(u)}
            className="relative px-6 py-2 rounded-xl cursor-pointer transition-all duration-250"
            style={{
              backgroundColor: unit === u ? "white" : "transparent",
              boxShadow: unit === u ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: unit === u ? "#040033" : "#9CA3AF",
                transition: "color 0.2s",
              }}
            >
              {u === "kg" ? "Kilograms" : "Tons"}
            </span>
          </button>
        ))}
      </div>

      {/* ── Large numeric input ── */}
      <div
        className="relative w-full rounded-2xl transition-all duration-250 cursor-text"
        style={{
          backgroundColor: "white",
          border: focused ? "2.5px solid #1253FA" : "2.5px solid transparent",
          boxShadow: focused
            ? "0 0 0 4px rgba(18,83,250,0.1), 0 4px 20px rgba(18,83,250,0.08)"
            : "0 2px 10px rgba(0,0,0,0.04)",
          padding: "20px 24px",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Subtle inner label */}
        <span
          className="block mb-1"
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "11px",
            color: focused ? "#1253FA" : "#9CA3AF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
          Cargo Weight
        </span>

        <div className="flex items-baseline gap-3">
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 border-none outline-none bg-transparent min-w-0"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "44px",
              color: "#040033",
              lineHeight: "1.1",
              caretColor: "#1253FA",
            }}
          />
          <span
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#9CA3AF",
              flexShrink: 0,
            }}
          >
            {unit}
          </span>
        </div>

        {/* Capacity hint */}
        {valueKg > 0 && (
          <p
            className="mt-2"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "12px",
              color: overloaded ? "#DC2626" : "#9CA3AF",
            }}
          >
            {overloaded
              ? `Exceeds ${capacityKg >= 1000 ? `${capacityKg / 1000} ton` : `${capacityKg} kg`} capacity!`
              : unit === "kg"
                ? `= ${(valueKg / 1000).toFixed(valueKg % 1000 === 0 ? 0 : 2)} ton${valueKg >= 2000 ? "s" : ""}`
                : `= ${valueKg.toLocaleString()} kg`}
          </p>
        )}
      </div>

      {/* ── Suggested Chips ── */}
      <div className="mt-5 w-full">
        <span
          className="block mb-2.5"
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "11px",
            color: "#9CA3AF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Quick Select
        </span>
        <div className="flex gap-2.5">
          {chips.map((chip) => {
            const isActive = activeChip?.valueKg === chip.valueKg;
            return (
              <button
                key={chip.label}
                onClick={() => handleChipSelect(chip)}
                className="flex-1 py-3 rounded-2xl cursor-pointer active:scale-[0.96] transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "#1253FA" : "white",
                  boxShadow: isActive
                    ? "0 4px 16px rgba(18,83,250,0.25)"
                    : "0 1px 6px rgba(0,0,0,0.04)",
                  border: isActive ? "none" : "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: isActive ? "white" : "#040033",
                  }}
                >
                  {chip.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Info note ── */}
      <div
        className="flex items-start gap-2.5 w-full mt-5 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: "rgba(18,83,250,0.05)" }}
      >
        <InfoRounded className="flex-shrink-0 mt-0.5" sx={{ fontSize: 16, color: "#1253FA" }} />
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#6B7280", lineHeight: "1.5" }}>
          Weight must match your cargo documents. Overloading may incur additional fees.
        </p>
      </div>
    </div>
  );
}