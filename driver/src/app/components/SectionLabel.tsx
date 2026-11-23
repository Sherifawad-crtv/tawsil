import type { ReactNode } from "react";

/** Small uppercase monospace label above a group of cards, with an optional dot and a right-hand action ("View All"). */
export default function SectionLabel({
  children,
  color = "#626A76",
  dot,
  pulse,
  action,
}: {
  children: ReactNode;
  color?: string;
  dot?: boolean;
  pulse?: boolean;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {dot && (
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, animation: pulse ? "pulse 2s ease-in-out infinite" : "none" }} />
        )}
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {children}
        </span>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="cursor-pointer active:opacity-70 transition-opacity"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#1253FA", border: "none", background: "none" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
