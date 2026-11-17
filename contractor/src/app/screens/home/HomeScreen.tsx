import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import AddRounded from "../../components/icons/AddRounded";
import PersonAddRounded from "../../components/icons/PersonAddRounded";
import InboxRounded from "../../components/icons/InboxRounded";
import ChevronRightRounded from "../../components/icons/ChevronRightRounded";
import routeArt from "../../../assets/stat-route.webp";
import truckArt from "../../../assets/stat-truck.webp";
import driversArt from "../../../assets/stat-drivers.webp";
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
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard art={routeArt} label="On the road" value={inProgress.length} onClick={() => navigate("/home/active")} />
        <StatCard art={truckArt} label="Trucks" value={activeTrucks(trucks).length} onClick={() => navigate("/trucks")} />
        <StatCard art={driversArt} label="Drivers" value={activeDrivers(drivers).length} onClick={() => navigate("/drivers")} />
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

function StatCard({ art, label, value, onClick }: { art: string; label: string; value: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      className="relative rounded-[22px] bg-white p-3 text-left cursor-pointer active:scale-[0.97] transition-transform"
      style={{ border: "none" }}
    >
      <ChevronRightRounded sx={{ fontSize: 16, color: "#8A919C", position: "absolute", top: "12px", right: "10px" }} />
      <img src={art} alt="" draggable={false} width={48} height={48} style={{ width: 48, height: 48, objectFit: "contain", mixBlendMode: "multiply" }} />
      <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", lineHeight: 1.1, color: "#040033", marginTop: "8px" }}>{value}</p>
      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", marginTop: "2px" }}>{label}</p>
    </button>
  );
}
