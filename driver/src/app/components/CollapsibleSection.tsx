import { useState, type ReactNode } from "react";
import ExpandMoreRounded from "./icons/ExpandMoreRounded";

/** Flat section whose header expands and collapses its content. Collapsed by default. */
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
    <div>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer" aria-expanded={open} style={{ border: "none", background: "none" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F5F5F3" }}>
          {icon}
        </div>
        <span className="flex-1 text-left" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
          {title}
        </span>
        <ExpandMoreRounded sx={{ fontSize: 22, color: "#626A76", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}
