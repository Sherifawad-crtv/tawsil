import type { ReactNode } from "react";

export function InfoRow({ icon, label, value }: { icon?: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#6B7280" }}>{label}</span>
      </div>
      <span className="text-right" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
        {value}
      </span>
    </div>
  );
}

export function PersonCard({ title, name, subtitle, avatarColor = "#040033" }: { title: string; name: string; subtitle?: string; avatarColor?: string }) {
  return (
    <div className="rounded-[18px] p-3.5 flex items-center gap-3" style={{ backgroundColor: "#F5F5F3" }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: avatarColor }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "white" }}>{name[0]}</span>
      </div>
      <div className="min-w-0">
        <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>{title}</p>
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#040033" }}>{name}</p>
        {subtitle && (
          <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
