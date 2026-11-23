import type { ReactNode } from "react";

/** Large screen title with a monospace subtitle, as on the client app's Home, Activity and Profile screens. */
export default function PageTitle({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: "1.15" }}>{title}</h1>
        {subtitle && (
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#626A76", marginTop: "6px" }}>{subtitle}</p>
        )}
      </div>
      {trailing}
    </div>
  );
}
