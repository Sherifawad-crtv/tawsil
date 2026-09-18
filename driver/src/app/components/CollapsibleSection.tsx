import { useState, type ReactNode } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";

export default function CollapsibleSection({
  icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[20px] bg-white overflow-hidden" style={{ border: "1px solid #E8E8E5" }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2.5 p-4 cursor-pointer" aria-expanded={open} style={{ minHeight: "44px" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EAF0FE" }}>
          {icon}
        </div>
        <h3 className="flex-1 text-left" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>
          {title}
        </h3>
        <ExpandMoreRounded sx={{ fontSize: 20, color: "#9CA3AF", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
