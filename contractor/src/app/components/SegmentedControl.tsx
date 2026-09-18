export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-full p-1 rounded-2xl gap-1"
      style={{ backgroundColor: "#F0F0EE" }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className="flex-1 rounded-xl py-2 px-3 text-center cursor-pointer transition-all active:scale-[0.98]"
            style={{
              backgroundColor: active ? "white" : "transparent",
              boxShadow: active ? "0 1px 4px rgba(4,0,51,0.10)" : "none",
              fontFamily: "'Archivo', sans-serif",
              fontWeight: active ? 700 : 500,
              fontSize: "13px",
              color: active ? "#040033" : "#6B7280",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
