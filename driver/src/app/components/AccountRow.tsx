import ChevronRightRounded from "./icons/ChevronRightRounded";
import type { ReactNode } from "react";

/** One row of a grouped settings card: icon tile, label, monospace description and a chevron. */
export default function AccountRow({
  icon,
  label,
  description,
  onClick,
  destructive = false,
}: {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 px-5 py-4 cursor-pointer active:bg-[#F5F5F3] transition-colors text-left" style={{ border: "none", background: "none" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: destructive ? "#FDECEC" : "#F5F5F3" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: destructive ? "#DC2626" : "#040033" }}>{label}</p>
        {description && (
          <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", marginTop: "1px" }}>{description}</p>
        )}
      </div>
      <ChevronRightRounded sx={{ fontSize: 20, color: destructive ? "#DC2626" : "#626A76", flexShrink: 0 }} />
    </button>
  );
}
