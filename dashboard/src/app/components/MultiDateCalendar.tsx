import { useState } from "react";
import { AltArrowLeftIcon, AltArrowRightIcon } from "@solar-icons/react/linear";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toISODate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function MultiDateCalendar({ value, onChange }: { value: string[]; onChange: (dates: string[]) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const selected = new Set(value);

  function toggle(iso: string) {
    onChange(selected.has(iso) ? value.filter((d) => d !== iso) : [...value, iso]);
  }

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="rounded-2lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-grey-light cursor-pointer">
          <AltArrowLeftIcon size={16} />
        </button>
        <span className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
          {new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button type="button" onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-grey-light cursor-pointer">
          <AltArrowRightIcon size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-caption-2-regular text-muted uppercase py-1" style={{ fontFamily: "var(--font-mono)" }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = toISODate(viewYear, viewMonth, day);
          const isSelected = selected.has(iso);
          return (
            <button
              type="button"
              key={i}
              onClick={() => toggle(iso)}
              className={`aspect-square rounded-lg text-caption-1-medium cursor-pointer transition-colors ${
                isSelected ? "bg-blue text-white" : "text-navy hover:bg-grey-light"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-border text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
        {value.length} date{value.length === 1 ? "" : "s"} selected
      </div>
    </div>
  );
}
