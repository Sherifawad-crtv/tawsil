import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, type PieLabelRenderProps } from "recharts";
import { blueShade, type AreaCoverage } from "../../lib/coverage";

// Beyond this the slices stop being readable; the tail folds into Other.
const MAX_SLICES = 5;
const OTHER = "var(--color-grey)"; // --color-grey: the tail is not coverage, so not blue

/**
 * Share of orders by area, as a donut on the brand blues: the biggest area
 * is the darkest, down the ramp from there. The lightest step falls below
 * 3:1 against white, so every slice carries its own label in ink, the
 * slices are separated by a white gap, and the legend repeats the numbers.
 */
export default function CoveragePie({ data }: { data: AreaCoverage[] }) {
  const head = data.slice(0, MAX_SLICES);
  const tail = data.slice(MAX_SLICES);
  const slices = [
    ...head.map((d, i) => ({
      ...d,
      color: blueShade(head.length === 1 ? 1 : 1 - i / (head.length - 1)),
    })),
    ...(tail.length
      ? [{
          area: `Other (${tail.length})`,
          orders: tail.reduce((n, d) => n + d.orders, 0),
          share: tail.reduce((n, d) => n + d.share, 0),
          color: OTHER,
        }]
      : []),
  ];

  if (slices.length === 0) {
    return <p className="py-8 text-center text-body-2-regular text-muted">No orders in this period.</p>;
  }

  // The card stretches to the bottom of its column so the right side ends
  // level with the trend chart on the left; the plot takes whatever height
  // that leaves, and the radii are percentages so the donut scales with it.
  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="relative flex-1" style={{ minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="orders"
              nameKey="area"
              cx="50%"
              cy="50%"
              innerRadius="56%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
              isAnimationActive={false}
              labelLine={false}
              label={renderLabel}
            >
              {slices.map((s) => (
                <Cell key={s.area} fill={s.color} />
              ))}
            </Pie>
            <Tooltip content={<CoverageTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* The leader as a hero number in the hole - what the donut is really for. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-title-2-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {Math.round(slices[0].share * 100)}%
          </span>
          <span className="text-caption-1-regular text-muted truncate max-w-[120px]">{slices[0].area}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {slices.map((s) => (
          <div key={s.area} className="flex items-center gap-1.5 text-caption-1-regular text-navy min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="truncate flex-1" style={{ fontFamily: "var(--font-sub)" }}>{s.area}</span>
            <span className="text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
              {s.orders.toLocaleString()} · {Math.round(s.share * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Percentage on each slice, in ink, never the slice colour. Skipped under 6% - it wouldn't fit. */
function renderLabel(props: PieLabelRenderProps) {
  // recharts types every geometry field as optional; they're always set for a rendered slice.
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) / 2;
  const a = (-midAngle * Math.PI) / 180;
  const x = cx + r * Math.cos(a);
  const y = cy + r * Math.sin(a);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#ffffff"
      fontSize={11}
      fontWeight={600}
      fontFamily="var(--font-sub)"
      style={{ paintOrder: "stroke", stroke: "rgba(4,0,51,0.35)", strokeWidth: 2 }}
    >
      {Math.round(percent * 100)}%
    </text>
  );
}

function CoverageTooltip({ active, payload }: { active?: boolean; payload?: { payload?: AreaCoverage }[] }) {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  return (
    <div className="rounded-xl bg-white border border-border shadow-md px-3 py-2">
      <p className="text-caption-1-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>{d.area}</p>
      <p className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
        {d.orders.toLocaleString()} orders · {Math.round(d.share * 100)}%
      </p>
    </div>
  );
}
