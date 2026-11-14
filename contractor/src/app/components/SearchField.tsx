import SearchRounded from "./icons/SearchRounded";

export default function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div
      className="field flex items-center gap-3 rounded-2xl px-4"
      style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", height: "48px" }}
    >
      <SearchRounded sx={{ fontSize: 16, color: "#626A76", flexShrink: 0 }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none"
        style={{ fontFamily: "'Archivo', sans-serif", fontSize: "14px", color: "#040033", caretColor: "#1253FA" }}
      />
    </div>
  );
}
