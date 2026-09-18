import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MONEY_COLORS, type TrendPoint } from "../../lib/financials";
import { formatEGP } from "../../lib/format";

const SERIES = [
  { key: "receivables", label: "Client receivables", color: MONEY_COLORS.receivables },
  { key: "payables", label: "Contractor payables", color: MONEY_COLORS.payables },
  { key: "earnings", label: "Company earnings", color: MONEY_COLORS.earnings },
] as const;

const VAT_COLOR = MONEY_COLORS.vat;

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
      <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
        Monthly trend · {year}
      </h3>
      <p className="text-caption-1-regular text-muted">Receivables, payables and VAT across the year</p>

      <div className="mt-4" style={{ height: "230px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="trendReceivables" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={MONEY_COLORS.receivables} stopOpacity={0.14} />
                <stop offset="100%" stopColor={MONEY_COLORS.receivables} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              // Every other month: at this card's width twelve labels collide.
              interval={1}
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-sub)" }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickFormatter={compact}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#e8e8e5" }} />

            <Area
              type="monotone"
              dataKey="receivables"
              stroke={MONEY_COLORS.receivables}
              strokeWidth={2}
              fill="url(#trendReceivables)"
              dot={false}
            />
            <Line type="monotone" dataKey="payables" stroke={MONEY_COLORS.payables} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="earnings" stroke={MONEY_COLORS.earnings} strokeWidth={2} dot={false} />
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

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3">
        {SERIES.map((s) => (
          <LegendItem key={s.key} color={s.color} label={s.label} />
        ))}
        <LegendItem
          color={VAT_COLOR}
          dashed
          label="Taxes (VAT)"
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span
        className="w-4 flex-shrink-0"
        style={{
          height: "0px",
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      <span className="text-caption-1-regular text-muted truncate">{label}</span>
    </span>
  );
}
