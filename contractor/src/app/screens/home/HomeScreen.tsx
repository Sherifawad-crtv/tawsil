import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import InboxRounded from "../../components/icons/InboxRounded";
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
        stats={[
          { label: "On the road", value: inProgress.length, art: routeArt, onClick: () => navigate("/home/active") },
          { label: "Trucks", value: activeTrucks(trucks).length, art: truckArt, onClick: () => navigate("/trucks") },
          { label: "Drivers", value: activeDrivers(drivers).length, art: driversArt, onClick: () => navigate("/drivers") },
        ]}
      />

      <div className="w-full max-w-lg mx-auto px-4 pt-5" style={{ paddingBottom: "24px" }}>
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
