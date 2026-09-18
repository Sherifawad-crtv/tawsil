import { useId, useState } from "react";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Chip } from "../Chip";
import { useCountUp } from "../../lib/useCountUp";

/**
 * This week's daily order count as a filled area against last week's line,
 * day-aligned. Hovering a day swaps the headline to that day's count and its
 * week-earlier comparison. Structure, hover behaviour and the count-up
 * headline are BoardUI's revenue/orders chart card recipe; the series draw
 * on the ported chart-6/chart-6-active/chart-neutral/chart-cursor tokens
 * instead of the hand-picked hex this card used before.
 */

type VolumePoint = { label: string; current: number; previous: number };

function describeDelta(current: number, previous: number): { label: string; color: "positive" | "negative" | "neutral" } {
  if (previous === 0) return { label: current > 0 ? "New" : "0%", color: "neutral" };
  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;
  if (rounded === 0) return { label: "0%", color: "neutral" };
  return { label: `${rounded > 0 ? "+" : ""}${rounded}%`, color: rounded > 0 ? "positive" : "negative" };
}

function ActiveDot({ cx: x, cy: y }: { cx?: number; cy?: number }) {
  if (x === undefined || y === undefined) return null;
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="var(--color-chart-6-active)" opacity={0.2} />
      <circle cx={x} cy={y} r={3.5} fill="var(--color-chart-6-active)" stroke="var(--color-background-secondary-default)" strokeWidth={2} />
    </g>
  );
}

export default function OrderVolumeChartCard({ data }: { data: VolumePoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = useId();

  const totalCurrent = data.reduce((sum, d) => sum + d.current, 0);
  const totalPrevious = data.reduce((sum, d) => sum + d.previous, 0);
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;

  const headlineValue = point ? point.current : totalCurrent;
  const comparison = point ? point.previous : totalPrevious;
  const delta = describeDelta(headlineValue, comparison);
  const display = useCountUp(headlineValue);

  return (
    <section className="flex h-[280px] min-w-0 flex-col gap-4 rounded-2xl bg-white border border-border p-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-body-2-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
            {point ? point.label : "Order Volume"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-title-3-medium leading-none text-navy whitespace-nowrap" style={{ fontFamily: "var(--font-heading)" }}>
              {display}
            </p>
            <Chip color={delta.color}>{delta.label}</Chip>
          </div>
          <p className="text-caption-2-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
            {comparison} {point ? "same day last week" : "last week"}
          </p>
        </div>
        <dl className="flex shrink-0 items-center gap-3 text-caption-2-regular text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-chart-6-active)" }} />
            <dt style={{ fontFamily: "var(--font-sub)" }}>This week</dt>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-chart-neutral)" }} />
            <dt style={{ fontFamily: "var(--font-sub)" }}>Last week</dt>
          </div>
        </dl>
      </div>

      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            onMouseMove={(state) => {
              const index = Number(state?.activeTooltipIndex);
              if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-6)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-6)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis
              width={24}
              domain={[0, "dataMax"]}
              tickCount={4}
              allowDecimals={false}
              tickFormatter={(v: number) => Math.round(v).toString()}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
            />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} />
            <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="var(--color-chart-neutral)"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              isAnimationActive
              animationDuration={400}
            />
            <Area type="monotone" dataKey="current" stroke="none" fill={`url(#${gradientId})`} isAnimationActive animationDuration={400} />
            <Line
              type="monotone"
              dataKey="current"
              stroke="var(--color-chart-6-active)"
              strokeWidth={2.25}
              dot={false}
              activeDot={<ActiveDot />}
              isAnimationActive
              animationDuration={400}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
