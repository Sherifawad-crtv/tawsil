import SearchRounded from "@mui/icons-material/SearchRounded";

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
      className="flex items-center gap-2 rounded-2xl px-3.5"
      style={{ backgroundColor: "#F0F0EE", height: "44px" }}
    >
      <SearchRounded sx={{ fontSize: 19, color: "#9CA3AF", flexShrink: 0 }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none"
        style={{ fontFamily: "'Archivo', sans-serif", fontSize: "14px", color: "#040033" }}
      />
    </div>
  );
}
