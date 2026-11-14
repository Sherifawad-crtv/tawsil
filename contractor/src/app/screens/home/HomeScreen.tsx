import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import SettingsRounded from "../../components/icons/SettingsRounded";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import GroupsRounded from "../../components/icons/GroupsRounded";
import BoltRounded from "../../components/icons/BoltRounded";
import InboxRounded from "../../components/icons/InboxRounded";
import IconButton from "../../components/IconButton";
import PageTitle from "../../components/PageTitle";
import SectionLabel from "../../components/SectionLabel";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import Carousel from "../../components/Carousel";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { activeDrivers, activeTrucks, getAvailableOrders, getInProgressOrders, getUnassignedOrders } from "../../lib/selectors";

const PREVIEW_COUNT = 3;

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { trucks, drivers, orders, profile } = useDataStore();
  const [availableFilter, setAvailableFilter] = useState<"On Demand" | "Monthly">("On Demand");
  const [greeting, setGreeting] = useState(() => greetingFor(new Date().getHours()));

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  const needsDispatch = useMemo(() => getUnassignedOrders(orders), [orders]);
  const inProgress = useMemo(() => getInProgressOrders(orders), [orders]);
  const available = useMemo(() => getAvailableOrders(orders), [orders]);
  const availableFiltered = useMemo(() => available.filter((o) => o.tripType === availableFilter), [available, availableFilter]);
  const countOf = (type: "On Demand" | "Monthly") => available.filter((o) => o.tripType === type).length;

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)", paddingBottom: "24px" }}>
      <PageTitle
        title={greeting}
        subtitle={`Welcome back, ${firstName}`}
        trailing={
          <IconButton label="Account" onClick={() => navigate("/account")}>
            <SettingsRounded sx={{ fontSize: 19, color: "#040033" }} />
          </IconButton>
        }
      />

      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <StatTile icon={LocalShippingRounded} label="Trucks" value={activeTrucks(trucks).length} onClick={() => navigate("/trucks")} />
        <StatTile icon={GroupsRounded} label="Drivers" value={activeDrivers(drivers).length} onClick={() => navigate("/drivers")} />
        <StatTile icon={BoltRounded} label="Active" value={inProgress.length} onClick={() => navigate("/home/active")} />
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

      <div className="mb-6">
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

      <div>
        <SectionLabel
          action={availableFiltered.length > PREVIEW_COUNT ? { label: "View All", onClick: () => navigate("/home/available") } : undefined}
        >
          Available Orders
        </SectionLabel>
        <div className="mb-3">
          <SegmentedControl
            ariaLabel="Available order type"
            value={availableFilter}
            onChange={setAvailableFilter}
            options={[
              { value: "On Demand", label: "On Demand", count: countOf("On Demand") },
              { value: "Monthly", label: "Monthly", count: countOf("Monthly") },
            ]}
          />
        </div>
        {availableFiltered.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title="No available orders"
            subtitle="New orders will appear here automatically."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {availableFiltered.slice(0, PREVIEW_COUNT).map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, onClick }: { icon: React.ElementType; label: string; value: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[18px] bg-white p-3.5 flex flex-col items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-transform"
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)", border: "none" }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
        <Icon sx={{ fontSize: 16, color: "#1253FA" }} />
      </div>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "17px", color: "#040033" }}>{value}</span>
      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76" }}>{label}</span>
    </button>
  );
}
