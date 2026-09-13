import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1 min-w-[180px]">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-3 py-2 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
        style={{ fontFamily: "var(--font-sub)" }}
      />
    </div>
  );
}
