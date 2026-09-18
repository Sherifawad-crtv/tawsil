import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "../../lib/financials";
import { formatEGP } from "../../lib/format";

const SERIES = [
  { key: "receivables", label: "Client receivables", color: "#1253fa" },
  { key: "payables", label: "Contractor payables", color: "#8a4b1f" },
  { key: "earnings", label: "Company earnings", color: "#16803c" },
] as const;

const VAT_COLOR = "#9ca3af";

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(Math.round(value));
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey?: string | number; value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const read = (key: string) => payload.find((p) => p.dataKey === key)?.value ?? 0;

  return (
    <div className="rounded-xl bg-white border border-border shadow-md px-3 py-2.5">
      <p className="text-caption-1-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>{label}</p>
      {SERIES.map((s) => (
        <p key={s.key} className="flex items-center gap-2 text-caption-1-regular text-muted">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
          {s.label}
          <span className="ml-auto text-navy" style={{ fontFamily: "var(--font-mono)" }}>{formatEGP(read(s.key))}</span>
        </p>
      ))}
      <p className="flex items-center gap-2 text-caption-1-regular text-muted">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: VAT_COLOR }} />
        Taxes (VAT)
        <span className="ml-auto text-navy" style={{ fontFamily: "var(--font-mono)" }}>{formatEGP(read("vat"))}</span>
      </p>
    </div>
  );
}

export default function MonthlyTrendChart({ data, year }: { data: TrendPoint[]; year: number }) {
  return (
    <div className="rounded-2xl bg-white border border-border p-4 flex flex-col gap-1">
      <h3 className="text-title-3-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
        Monthly trend · {year}
      </h3>
      <p className="text-body-2-regular text-muted">Receivables, payables and VAT across the year</p>

      <div className="mt-4" style={{ height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="trendReceivables" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1253fa" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#1253fa" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-sub)" }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickFormatter={compact}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#e8e8e5" }} />

            <Area
              type="monotone"
              dataKey="receivables"
              stroke="#1253fa"
              strokeWidth={2}
              fill="url(#trendReceivables)"
              dot={false}
            />
            <Line type="monotone" dataKey="payables" stroke="#8a4b1f" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="earnings" stroke="#16803c" strokeWidth={2} dot={false} />
            <Line
              type="monotone"
              dataKey="vat"
              stroke={VAT_COLOR}
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 flex-wrap pt-3">
        {SERIES.map((s) => (
          <LegendItem key={s.key} color={s.color} label={s.label} />
        ))}
        <LegendItem
          color={VAT_COLOR}
          dashed
          label="Taxes (VAT) — Held for the tax authority, not income"
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-4 flex-shrink-0"
        style={{
          height: "0px",
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      <span className="text-caption-1-regular text-muted">{label}</span>
    </span>
  );
}
