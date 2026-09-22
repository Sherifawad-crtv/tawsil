import ChevronRightRounded from "./icons/ChevronRightRounded";
import type { ReactNode } from "react";

export default function AccountRow({
  icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-[18px] bg-white px-4 py-3.5 cursor-pointer active:scale-[0.99] transition-transform"
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: destructive ? "#FDECEC" : "#EAF0FE" }}
      >
        {icon}
      </div>
      <span
        className="flex-1 text-left"
        style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: destructive ? "#DC2626" : "#040033" }}
      >
        {label}
      </span>
      <ChevronRightRounded sx={{ fontSize: 19, color: destructive ? "#DC2626" : "#9CA3AF" }} />
    </button>
  );
}
