import type { ReactNode } from "react";

export default function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-6">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#F0F0EE" }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#040033" }}>{title}</p>
        <p className="mt-1" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
