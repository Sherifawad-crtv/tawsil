export default function LocationBarList({ data }: { data: { location: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d.location} className="flex items-center gap-3">
          <span className="text-xs text-navy truncate flex-1 min-w-0" style={{ fontFamily: "var(--font-sub)" }}>
            {d.location}
          </span>
          <div className="w-24 h-1.5 rounded-full bg-white overflow-hidden flex-shrink-0">
            <div className="h-full rounded-full bg-status-pending" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="text-xs text-muted w-4 text-right flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}
