import { useRef } from "react";
import UploadFileRounded from "@mui/icons-material/UploadFileRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";

export default function FileUploadRow({
  label,
  hint,
  fileName,
  onSelect,
}: {
  label: string;
  hint: string;
  fileName?: string;
  onSelect: (fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform text-left"
      style={{ backgroundColor: "white", boxShadow: fileName ? "0 0 0 1.5px #1253FA" : "0 1px 6px rgba(0,0,0,0.04)", border: "none" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: fileName ? "rgba(18,83,250,0.08)" : "#F5F5F3" }}
      >
        {fileName ? (
          <CheckCircleRounded sx={{ fontSize: 20, color: "#1253FA" }} />
        ) : (
          <UploadFileRounded sx={{ fontSize: 20, color: "#040033" }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{label}</p>
        <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
          {fileName ?? hint}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f.name);
        }}
      />
    </button>
  );
}
