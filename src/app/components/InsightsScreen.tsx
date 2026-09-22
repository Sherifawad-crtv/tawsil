import { useEffect, useRef, useState } from "react";
import ShowChartRounded from "./icons/ShowChartRounded";
import CheckRounded from "./icons/CheckRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import CloseRounded from "./icons/CloseRounded";
import RouteRounded from "./icons/RouteRounded";
import PaymentsRounded from "./icons/PaymentsRounded";

/* ── Stats Data ── */
const STATS = {
  total: 47,
  completed: 38,
  pending: 3,
  cancelled: 6,
  completionRate: 81,
};

const MONTHLY_DATA = [
  { month: "Oct", trips: 5 },
  { month: "Nov", trips: 8 },
  { month: "Dec", trips: 6 },
  { month: "Jan", trips: 9 },
  { month: "Feb", trips: 7 },
  { month: "Mar", trips: 12 },
];

/* ── Progress Ring ── */
function ProgressRing({ percentage, size = 180, strokeWidth = 12 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(circumference - (percentage / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F0F0EE"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#040033" />
            <stop offset="100%" stopColor="#1253FA" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "42px", color: "#040033", lineHeight: "1" }}>
          {percentage}
        </span>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
          % rate
        </span>
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div
      ref={ref}
      className="rounded-[18px] p-4 flex flex-col gap-2"
      style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}10` }}
        >
          {icon}
        </div>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033" }}>
          {count}
        </span>
      </div>
      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Bar Chart ── */
function MiniBarChart({ data }: { data: typeof MONTHLY_DATA }) {
  const max = Math.max(...data.map((d) => d.trips));
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: "120px", paddingTop: "8px" }}>
      {data.map((d, i) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center" style={{ height: "88px" }}>
            <div
              className="w-full max-w-[36px] rounded-xl"
              style={{
                height: entered ? `${(d.trips / max) * 100}%` : "0%",
                background: i === data.length - 1
                  ? "linear-gradient(180deg, #1253FA, #040033)"
                  : "#F0F0EE",
                transition: `height 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.08 + 0.3}s`,
                minHeight: entered ? "8px" : "0px",
              }}
            />
          </div>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
            {d.month}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function InsightsScreen() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)", paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 96px)" }}>

        {/* ── Header ── */}
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: "1.15", marginBottom: "4px" }}>
          Insights
        </h1>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF", marginBottom: "24px" }}>
          Your logistics performance overview
        </p>

        {/* ── Completion Rate Ring ── */}
        <div
          className="rounded-[22px] p-6 flex flex-col items-center gap-4 mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Completion Rate
          </span>
          <ProgressRing percentage={STATS.completionRate} />
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-xl"
              style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.06)" }}
            >
              {STATS.completed} of {STATS.total} trips completed
            </span>
          </div>
        </div>

        {/* ── Stat Cards Grid ── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            label="Total Trips"
            value={STATS.total}
            color="#040033"
            icon={<ShowChartRounded sx={{ fontSize: 16, color: "#040033" }} />}
          />
          <StatCard
            label="Completed"
            value={STATS.completed}
            color="#059669"
            icon={<CheckRounded sx={{ fontSize: 16, color: "#059669" }} />}
          />
          <StatCard
            label="Pending"
            value={STATS.pending}
            color="#1253FA"
            icon={<AccessTimeRounded sx={{ fontSize: 16, color: "#1253FA" }} />}
          />
          <StatCard
            label="Cancelled"
            value={STATS.cancelled}
            color="#6B7280"
            icon={<CloseRounded sx={{ fontSize: 16, color: "#6B7280" }} />}
          />
        </div>

        {/* ── Monthly Trend ── */}
        <div
          className="rounded-[22px] p-5 mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Monthly Trips
            </span>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#040033" }}>
              Last 6 Months
            </span>
          </div>
          <MiniBarChart data={MONTHLY_DATA} />
        </div>

        {/* ── Quick Stats Row ── */}
        <div
          className="rounded-[22px] p-5"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Performance
          </span>
          <div className="flex flex-col gap-4 mt-4">
            {[
              { label: "Avg. delivery time", value: "42 min", icon: "clock" },
              { label: "Total distance", value: "1,847 km", icon: "route" },
              { label: "Total spent", value: "EGP 14,280", icon: "money" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#F0F0EE" }}
                  >
                    {item.icon === "clock" && <AccessTimeRounded sx={{ fontSize: 16, color: "#6B7280" }} />}
                    {item.icon === "route" && <RouteRounded sx={{ fontSize: 16, color: "#6B7280" }} />}
                    {item.icon === "money" && <PaymentsRounded sx={{ fontSize: 16, color: "#6B7280" }} />}
                  </div>
                  <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 500, fontSize: "13px", color: "#040033" }}>
                    {item.label}
                  </span>
                </div>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#040033" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
