import { useMemo } from "react";
import { useNavigate } from "react-router";
import ClockCircleRounded from "@mui/icons-material/AccessTimeRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import InboxRounded from "@mui/icons-material/InboxRounded";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getPendingOrders, getActiveOrders } from "../../lib/selectors";

const PREVIEW_COUNT = 3;

export default function HomeScreen() {
  const navigate = useNavigate();
  const { orders, profile } = useDataStore();
  const pending = useMemo(() => getPendingOrders(orders), [orders]);
  const active = useMemo(() => getActiveOrders(orders), [orders]);
  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "24px" }}>
      {/* Greeting fixed: no license-number parenthetical appended - "Welcome Back Driver" stands alone. */}
      <div className="mb-5">
        <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#9CA3AF" }}>Welcome back, {firstName}</p>
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033", lineHeight: 1.15, marginTop: "2px" }}>Dashboard</h1>
      </div>

      {/* Stat bar: 2 metrics, correctly simpler than Contractor's 3. */}
      <div className="rounded-[22px] p-5 flex items-center mb-6" style={{ backgroundColor: "#040033" }}>
        <StatItem icon={ClockCircleRounded} label="Pending" value={pending.length} />
        <div className="w-px self-stretch my-1" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
        <StatItem icon={RouteRounded} label="Active" value={active.length} />
      </div>

      <Section
        title="Pending Orders"
        count={pending.length}
        onViewAll={() => navigate("/orders", { state: { tab: "pending" } })}
      >
        {pending.length === 0 ? (
          <EmptyState icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />} title="No pending orders" subtitle="Newly assigned orders will appear here." />
        ) : (
          <div className="flex flex-col gap-3">
            {pending.slice(0, PREVIEW_COUNT).map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Active Orders"
        count={active.length}
        onViewAll={() => navigate("/orders", { state: { tab: "active" } })}
      >
        {active.length === 0 ? (
          <EmptyState icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />} title="No active orders" subtitle="Trips you've started will appear here." />
        ) : (
          <div className="flex flex-col gap-3">
            {active.slice(0, PREVIEW_COUNT).map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <Icon sx={{ fontSize: 18, color: "#1253FA" }} />
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "white" }}>{value}</span>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{label}</span>
    </div>
  );
}

function Section({ title, count, onViewAll, children }: { title: string; count: number; onViewAll: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#040033" }}>{title}</h2>
          <span
            className="rounded-full px-1.5 py-0.5"
            style={{ backgroundColor: "#F0F0EE", color: "#6B7280", fontFamily: "'Courier Prime', monospace", fontSize: "11px", fontWeight: 700 }}
          >
            {count}
          </span>
        </div>
        {count > PREVIEW_COUNT && (
          <button onClick={onViewAll} className="flex items-center gap-0.5 cursor-pointer" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12.5px", color: "#1253FA" }}>
            View All <ChevronRightRounded sx={{ fontSize: 15 }} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
