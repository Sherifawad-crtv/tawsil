export default function HourlyBarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end min-w-0">
          <span className="text-[11px] text-navy font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
            {d.count > 0 ? d.count : ""}
          </span>
          <div
            className="w-full rounded-t-[4px] transition-all"
            style={{
              height: `${Math.max(d.count > 0 ? 6 : 2, (d.count / max) * 76)}px`,
              backgroundColor: d.count > 0 ? "#d97706" : "#e8e8e5",
            }}
          />
          <span className="text-[10px] text-muted whitespace-nowrap" style={{ fontFamily: "var(--font-mono)" }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
