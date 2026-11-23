import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import ChevronRightRounded from "../../components/icons/ChevronRightRounded";
import InboxRounded from "../../components/icons/InboxRounded";
import routeArt from "../../../assets/stat-route.webp";
import truckArt from "../../../assets/stat-truck.webp";
import HomeHero from "../../components/HomeHero";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getPendingOrders, getActiveOrders } from "../../lib/selectors";

const PREVIEW_COUNT = 3;

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { orders, profile } = useDataStore();
  const pending = useMemo(() => getPendingOrders(orders), [orders]);
  const active = useMemo(() => getActiveOrders(orders), [orders]);
  const firstName = profile.fullName.split(" ")[0];
  const [greeting, setGreeting] = useState(() => greetingFor(new Date().getHours()));

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  return (
    <div>
      <HomeHero
        title={greeting}
        subtitle={`Welcome back, ${firstName}`}
        stats={[
          { label: "Pending", value: pending.length, art: truckArt, onClick: () => navigate("/orders", { state: { tab: "pending" } }) },
          { label: "Active", value: active.length, art: routeArt, onClick: () => navigate("/orders", { state: { tab: "active" } }) },
        ]}
      />

      <div className="w-full max-w-lg mx-auto px-4 pt-5" style={{ paddingBottom: "24px" }}>
        <Section
          title="Pending Orders"
          count={pending.length}
          onViewAll={() => navigate("/orders", { state: { tab: "pending" } })}
        >
          {pending.length === 0 ? (
            <EmptyState icon={<InboxRounded sx={{ fontSize: 24, color: "#626A76" }} />} title="No pending orders" subtitle="Newly assigned orders will appear here." />
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
            <EmptyState icon={<InboxRounded sx={{ fontSize: 24, color: "#626A76" }} />} title="No active orders" subtitle="Trips you've started will appear here." />
          ) : (
            <div className="flex flex-col gap-3">
              {active.slice(0, PREVIEW_COUNT).map((o) => (
                <TripCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </Section>
      </div>
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
