import { MagnifierIcon } from "@solar-icons/react/bold-duotone";
import { cx } from "../lib/cx";
import { FIELD_BASE } from "../lib/fieldClass";

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
    <div className="relative flex-1 min-w-[200px]">
      <MagnifierIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cx(FIELD_BASE, "pl-9 pr-3 placeholder:text-muted")}
        style={{ fontFamily: "var(--font-sub)" }}
      />
    </div>
  );
}
