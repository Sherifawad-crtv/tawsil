/** Pill tabs with a count on each, same as the client app's Activity tabs. */
export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex rounded-2xl p-1" style={{ backgroundColor: "#E8E8E5" }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            style={{
              backgroundColor: active ? "white" : "transparent",
              boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              border: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: active ? 700 : 500,
                fontSize: "13px",
                color: active ? "#040033" : "#6B7280",
                transition: "color 0.3s",
              }}
            >
              {opt.label}
            </span>
            {opt.count !== undefined && (
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: "10px",
                  color: active ? "#1253FA" : "#626A76",
                  backgroundColor: active ? "rgba(18,83,250,0.08)" : "rgba(107,114,128,0.06)",
                  transition: "all 0.3s",
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
