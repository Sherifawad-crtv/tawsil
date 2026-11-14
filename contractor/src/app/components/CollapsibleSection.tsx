import { useState, type ReactNode } from "react";
import ExpandMoreRounded from "./icons/ExpandMoreRounded";

/** Card with a header that expands and collapses its content. Collapsed by default. */
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
    <div className="rounded-3xl bg-white overflow-hidden" style={{ boxShadow: "0 2px 14px rgba(4,0,51,0.05)" }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2 p-4 cursor-pointer" aria-expanded={open} style={{ border: "none", background: "none" }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
          {icon}
        </div>
        <span className="flex-1 text-left" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033", letterSpacing: "0.02em" }}>
          {title}
        </span>
        <ExpandMoreRounded sx={{ fontSize: 20, color: "#626A76", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
