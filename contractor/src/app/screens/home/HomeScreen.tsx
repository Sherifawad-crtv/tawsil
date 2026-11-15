import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import AddRounded from "../../components/icons/AddRounded";
import PersonAddRounded from "../../components/icons/PersonAddRounded";
import InboxRounded from "../../components/icons/InboxRounded";
import SectionLabel from "../../components/SectionLabel";
import TripCard from "../../components/TripCard";
import Carousel from "../../components/Carousel";
import WalletHero from "../../components/WalletHero";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { activeDrivers, activeTrucks, getInProgressOrders, getUnassignedOrders, revenueSummary } from "../../lib/selectors";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { trucks, drivers, orders, profile } = useDataStore();
  const [greeting, setGreeting] = useState(() => greetingFor(new Date().getHours()));

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  const needsDispatch = useMemo(() => getUnassignedOrders(orders), [orders]);
  const inProgress = useMemo(() => getInProgressOrders(orders), [orders]);

  const revenue = useMemo(() => revenueSummary(orders), [orders]);
  const firstName = profile.fullName.split(" ")[0];

  return (
    <div>
      <WalletHero
        title={greeting}
        subtitle={`Welcome back, ${firstName}`}
        summary={revenue}
        onSettings={() => navigate("/account")}
        actions={[
          { label: "Dispatch", icon: LocalShippingRounded, badge: needsDispatch.length, onClick: () => navigate("/home/dispatch") },
          { label: "Add truck", icon: AddRounded, onClick: () => navigate("/trucks/new") },
          { label: "Add driver", icon: PersonAddRounded, onClick: () => navigate("/drivers/new") },
        ]}
      />

      <div className="w-full max-w-lg mx-auto px-4 pt-5" style={{ paddingBottom: "24px" }}>
      <div className="grid grid-cols-3 rounded-[22px] bg-white mb-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
        <Figure label="Trucks" value={activeTrucks(trucks).length} onClick={() => navigate("/trucks")} />
        <Figure label="Drivers" value={activeDrivers(drivers).length} onClick={() => navigate("/drivers")} divider />
        <Figure label="On the road" value={inProgress.length} onClick={() => navigate("/home/active")} divider />
      </div>

      {needsDispatch.length > 0 && (
        <div className="mb-6">
          <SectionLabel
            dot
            color="#B45309"
            action={needsDispatch.length > 1 ? { label: "View All", onClick: () => navigate("/home/dispatch") } : undefined}
          >
            Needs Dispatch · {needsDispatch.length}
          </SectionLabel>
          <Carousel>
            {needsDispatch.map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </Carousel>
        </div>
      )}

      <div>
        <SectionLabel
          dot
          pulse
          color="#1253FA"
          action={inProgress.length > 1 ? { label: "View All", onClick: () => navigate("/home/active") } : undefined}
        >
          Active Trips · {inProgress.length}
        </SectionLabel>
        {inProgress.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title="No trips in progress"
            subtitle="Dispatched orders will appear here once they're on their way."
          />
        ) : (
          <Carousel>
            {inProgress.map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </Carousel>
        )}
      </div>

      </div>
    </div>
  );
}

function Figure({ label, value, onClick, divider }: { label: string; value: number; onClick: () => void; divider?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="py-4 px-4 text-left cursor-pointer active:bg-[#F5F5F3] transition-colors first:rounded-l-[22px] last:rounded-r-[22px]"
      style={{ border: "none", background: "none", borderLeft: divider ? "1px solid #F0F0EE" : "none" }}
    >
      <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", lineHeight: 1.1, color: "#040033" }}>{value}</p>
      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", marginTop: "2px" }}>{label}</p>
    </button>
  );
}
