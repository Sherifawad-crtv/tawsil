import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function ProblemsHourlyChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 4, bottom: 0, left: 4 }} barCategoryGap="28%">
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
          <Tooltip content={() => null} cursor={{ fill: "var(--color-tile)" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={400}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.count > 0 ? "#d97706" : "var(--color-border)"} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              formatter={(value) => (typeof value === "number" && value > 0 ? value : "")}
              style={{ fontSize: 11, fontWeight: 600, fill: "var(--color-navy)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
