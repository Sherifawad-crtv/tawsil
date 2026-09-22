import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import SettingsRounded from "../../components/icons/SettingsRounded";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import GroupsRounded from "../../components/icons/GroupsRounded";
import BoltRounded from "../../components/icons/BoltRounded";
import WarningRounded from "../../components/icons/WarningRounded";
import InboxRounded from "../../components/icons/InboxRounded";
import ChevronRightRounded from "../../components/icons/ChevronRightRounded";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getAvailableOrders, getActiveOrders, getUnassignedOrders } from "../../lib/selectors";

const PREVIEW_COUNT = 3;

export default function HomeScreen() {
  const navigate = useNavigate();
  const { trucks, drivers, orders, profile } = useDataStore();
  const [availableFilter, setAvailableFilter] = useState<"On Demand" | "Monthly">("On Demand");

  const active = useMemo(() => getActiveOrders(orders), [orders]);
  const needsDispatch = useMemo(() => getUnassignedOrders(orders), [orders]);
  // "Active Trips" below covers only in-motion orders - the ones needing dispatch already have their own section above.
  const inProgress = useMemo(() => active.filter((o) => !needsDispatch.includes(o)), [active, needsDispatch]);
  const available = useMemo(() => getAvailableOrders(orders), [orders]);
  const availableFiltered = useMemo(() => available.filter((o) => o.tripType === availableFilter), [available, availableFilter]);

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "24px" }}>
      {/* ── Header ── */}
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
          style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
        >
          <SettingsRounded sx={{ fontSize: 19, color: "#040033" }} />
        </button>
      </div>

      {/* ── Fleet stats - three light tiles instead of one heavy block, so navy stays reserved for calls to action. ── */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <StatTile icon={LocalShippingRounded} label="Trucks" value={trucks.length} onClick={() => navigate("/trucks")} />
        <StatTile icon={GroupsRounded} label="Drivers" value={drivers.length} onClick={() => navigate("/drivers")} />
        <StatTile icon={BoltRounded} label="Active" value={active.length} onClick={() => navigate("/home/active")} />
      </div>

      {/* ── Needs Dispatch - the one thing that actually blocks revenue, surfaced first and only when it exists. ── */}
      {needsDispatch.length > 0 && (
        <div className="mb-6">
          <SectionHeading label="Needs Dispatch" count={needsDispatch.length} accent="#B45309" icon={WarningRounded} />
          <div className="flex flex-col gap-3">
            {needsDispatch.slice(0, PREVIEW_COUNT).map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
            {needsDispatch.length > PREVIEW_COUNT && <ViewAllLink onClick={() => navigate("/home/active")} />}
          </div>
        </div>
      )}

      {/* ── Active Trips - already dispatched, in motion. ── */}
      <div className="mb-6">
        <SectionHeading label="Active Trips" count={inProgress.length} />
        {inProgress.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
            title="No trips in progress"
            subtitle="Dispatched orders will appear here once they're on their way."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {inProgress.slice(0, PREVIEW_COUNT).map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
            {inProgress.length > PREVIEW_COUNT && <ViewAllLink onClick={() => navigate("/home/active")} />}
          </div>
        )}
      </div>

      {/* ── Available Orders - new leads, lowest priority of the three since nothing here is committed yet. ── */}
      <div>
        <SectionHeading label="Available Orders" count={available.length} />
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
            {availableFiltered.length > PREVIEW_COUNT && <ViewAllLink onClick={() => navigate("/home/available")} />}
          </div>
        )}
      </div>
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

function SectionHeading({
  label,
  count,
  accent = "#040033",
  icon: Icon,
}: {
  label: string;
  count: number;
  accent?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      {Icon && <Icon sx={{ fontSize: 15, color: accent }} />}
      <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: accent }}>{label}</h2>
      <span
        className="px-1.5 rounded-md"
        style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11px", color: accent, backgroundColor: accent === "#040033" ? "#F0F0EE" : "#FCF2DE" }}
      >
        {count}
      </span>
    </div>
  );
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
