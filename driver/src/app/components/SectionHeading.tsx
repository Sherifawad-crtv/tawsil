import type { ReactNode } from "react";

/** Icon-in-a-rounded-box section heading - same convention established in the Contractor app. */
export default function SectionHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(18,83,250,0.10)" }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>{children}</h3>
    </div>
  );
}
