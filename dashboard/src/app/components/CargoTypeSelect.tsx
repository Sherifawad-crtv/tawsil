export default function CargoTypeSelect({
  allowed,
  value,
  onChange,
}: {
  allowed: string[];
  value: string[];
  onChange: (types: string[]) => void;
}) {
  function toggle(type: string) {
    onChange(value.includes(type) ? value.filter((t) => t !== type) : [...value, type]);
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
        Cargo Type <span className="text-status-cancelled">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {allowed.map((type) => {
          const selected = value.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                selected ? "bg-blue text-white border-blue" : "bg-white text-navy border-border hover:border-blue/40"
              }`}
              style={{ fontFamily: "var(--font-sub)" }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
