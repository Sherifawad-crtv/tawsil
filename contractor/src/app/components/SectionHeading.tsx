import type { ReactNode } from "react";

/**
 * Icon-in-a-rounded-box section heading, standardized everywhere a form is
 * split into named sections (Truck Information, License Information,
 * Personal Information, ...). Edit Driver previously used a different
 * colored-vertical-bar treatment for the same concept - unified on this,
 * the majority pattern (3 of 4 forms already used it).
 */
export default function SectionHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(18,83,250,0.10)" }}
      >
        {icon}
      </div>
      <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>{children}</h3>
    </div>
  );
}
