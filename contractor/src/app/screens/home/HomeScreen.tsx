import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import SettingsRounded from "../../components/icons/SettingsRounded";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import GroupsRounded from "../../components/icons/GroupsRounded";
import BoltRounded from "../../components/icons/BoltRounded";
import InboxRounded from "../../components/icons/InboxRounded";
import ChevronRightRounded from "../../components/icons/ChevronRightRounded";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getAvailableOrders, getActiveOrders, activeTrucks, activeDrivers } from "../../lib/selectors";

const PREVIEW_COUNT = 3;

export default function HomeScreen() {
  const navigate = useNavigate();
  const { trucks, drivers, orders, profile } = useDataStore();
  const [view, setView] = useState<"available" | "active">("available");
  const [availableFilter, setAvailableFilter] = useState<"On Demand" | "Monthly">("On Demand");

  const available = useMemo(() => getAvailableOrders(orders), [orders]);
  const active = useMemo(() => getActiveOrders(orders), [orders]);
  const availableFiltered = useMemo(() => available.filter((o) => o.tripType === availableFilter), [available, availableFilter]);

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "24px" }}>
      {/* ── Header: single native large-title, not two stacked heading blocks ── */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#9CA3AF" }}>Welcome back, {firstName}</p>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033", lineHeight: 1.15, marginTop: "2px" }}>
            Dashboard
          </h1>
        </div>
        <button
          onClick={() => navigate("/account")}
          aria-label="Account & Preferences"
          className="w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
          style={{ backgroundColor: "white", boxShadow: "0 1px 4px rgba(4,0,51,0.08)" }}
        >
          <SettingsRounded sx={{ fontSize: 19, color: "#040033" }} />
        </button>
      </div>

      {/* ── Stat summary bar ── */}
      <div
        className="rounded-[22px] p-5 flex items-center mb-5"
        style={{ backgroundColor: "#040033" }}
      >
        <StatItem icon={LocalShippingRounded} label="Trucks" value={trucks.length} />
        <Divider />
        <StatItem icon={GroupsRounded} label="Drivers" value={drivers.length} />
        <Divider />
        <StatItem icon={BoltRounded} label="Active" value={active.length} />
      </div>

      {/* ── Available | Active segmented control - replaces the chip row + two stacked "Orders" sections ── */}
      <SegmentedControl
        ariaLabel="Orders view"
        value={view}
        onChange={setView}
        options={[
          { value: "available", label: `Available (${available.length})` },
          { value: "active", label: `Active (${active.length})` },
        ]}
      />

      <div className="mt-4">
        {view === "available" ? (
          <>
            <div className="mb-3">
              <SegmentedControl
                ariaLabel="Available order type"
                value={availableFilter}
                onChange={setAvailableFilter}
                options={[
                  { value: "On Demand", label: "On Demand" },
                  { value: "Monthly", label: "Monthly" },
                ]}
              />
            </div>
            {availableFiltered.length === 0 ? (
              <EmptyState
                icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
                title="No Available orders"
                subtitle="You have no orders right now. New orders will appear here automatically."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {availableFiltered.slice(0, PREVIEW_COUNT).map((o) => (
                  <TripCard key={o.id} order={o} />
                ))}
                {availableFiltered.length > PREVIEW_COUNT && (
                  <ViewAllLink onClick={() => navigate("/home/available")} />
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {active.length === 0 ? (
              <EmptyState
                icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
                title="No Active trips"
                subtitle="You have no active trips right now. Accepted orders will appear here automatically."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {active.slice(0, PREVIEW_COUNT).map((o) => (
                  <TripCard key={o.id} order={o} />
                ))}
                {active.length > PREVIEW_COUNT && <ViewAllLink onClick={() => navigate("/home/active")} />}
              </div>
            )}
          </>
        )}
      </div>
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

function Divider() {
  return <div className="w-px self-stretch my-1" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />;
}

function ViewAllLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-1 py-2.5 cursor-pointer"
      style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1253FA" }}
    >
      View All <ChevronRightRounded sx={{ fontSize: 16 }} />
    </button>
  );
}
