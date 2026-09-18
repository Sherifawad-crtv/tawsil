import { ProgressBar } from "../boardui/ProgressBar";

export default function LocationBarList({ data }: { data: { location: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d.location} className="flex items-center gap-3">
          <span className="text-caption-1-regular text-navy truncate flex-1 min-w-0" style={{ fontFamily: "var(--font-sub)" }}>
            {d.location}
          </span>
          <ProgressBar value={d.count} max={max} size="sm" fillClassName="bg-status-pending" className="w-24 flex-shrink-0" />
          <span className="text-caption-1-regular text-muted w-4 text-right flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}
