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

      {/* Stat tiles - light, tappable, same treatment as the contractor app's Home: 2 metrics, correctly simpler than Contractor's 3. */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <StatTile icon={ClockCircleRounded} label="Pending" value={pending.length} onClick={() => navigate("/orders", { state: { tab: "pending" } })} />
        <StatTile icon={RouteRounded} label="Active" value={active.length} onClick={() => navigate("/orders", { state: { tab: "active" } })} />
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

function StatTile({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[18px] bg-white p-3.5 flex flex-col items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-transform"
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EAF0FE" }}>
        <Icon sx={{ fontSize: 16, color: "#1253FA" }} />
      </div>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "17px", color: "#040033" }}>{value}</span>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>{label}</span>
    </button>
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
