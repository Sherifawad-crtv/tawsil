import { MagnifierIcon } from "@solar-icons/react/linear";

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
        className="w-full h-9 pl-9 pr-3 rounded-2lg bg-grey-light text-body-regular text-navy placeholder:text-muted ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150 ease focus:outline-none focus:ring-blue focus:bg-white"
        style={{ fontFamily: "var(--font-sub)" }}
      />
    </div>
  );
}
