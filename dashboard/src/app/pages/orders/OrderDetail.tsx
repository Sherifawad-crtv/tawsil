import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, UserIcon, MapPointIcon, CameraIcon, UserPlusRoundedIcon, Pen2Icon, ForbiddenIcon, RoutingIcon, RestartIcon } from "@solar-icons/react/linear";
import StatusBadge from "../../components/StatusBadge";
import StatusHistoryList from "../../components/orders/StatusHistoryList";
import BiddingWidget from "../../components/orders/BiddingWidget";
import AssignDriverModal from "../../components/orders/AssignDriverModal";
import OrderFormModal from "../../components/orders/OrderFormModal";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { byId, getTruckType, canAssignDrivers, isReadOnlyRole } from "../../lib/selectors";
import { Button } from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import { truckTypeLabel } from "../../lib/constants";
import { formatDateTime } from "../../lib/format";
import { routeOf, vehiclePosition } from "../../lib/tracking";
import { TRUCK_IMAGES } from "../../lib/truckImages";

// Leaflet only loads on this page.
const OrderMap = lazy(() => import("../../components/orders/OrderMap"));

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, clients, contractors, drivers, vehicles, appendStatusHistory } = useDataStore();
  const { role } = useRole();
  const [showAssign, setShowAssign] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return (
      <div className="text-center py-20 text-body-regular text-muted">
        Order not found. <Link to="/orders" className="text-blue font-semibold">Back to Orders</Link>
      </div>
    );
  }

  const client = byId(clients, order.clientId);
  const contractor = byId(contractors, order.contractorId);
  const driver = byId(drivers, order.driverId);
  const vehicle = byId(vehicles, order.vehicleId);
  const truckType = getTruckType(order.truckTypeId);

  // The stand-in position moves with time, so re-read it every few seconds
  // while the order is on the road. See lib/tracking for what this is.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (order.status !== "In Progress") return;
    const id = window.setInterval(() => setNow(Date.now()), 3000);
    return () => window.clearInterval(id);
  }, [order.status]);
  const route = useMemo(() => routeOf(order), [order]);
  const tracked = vehiclePosition(order, now);

  // Executive is read-only: it keeps everything that just looks at the order
  // (including Track Order) and loses everything that changes it.
  const readOnly = isReadOnlyRole(role);
  const canEditCancel = !readOnly && order.status !== "Completed" && order.status !== "Cancelled";
  const needsAssignment = order.status === "Pending" && canAssignDrivers(role);

  function handleCancel() {
    appendStatusHistory(order!.id, { timestamp: new Date().toISOString(), fromStatus: order!.status, toStatus: "Cancelled", note: "Cancelled from Order Detail", actor: "Operations" }, "Cancelled");
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-1.5 text-body-2-regular text-muted hover:text-navy cursor-pointer w-fit"
      >
        <ArrowLeftIcon size={15} /> Back to Orders
      </button>

      <PageHeader
        title={order.id}
        badge={<StatusBadge status={order.status} />}
        subtitle={`${client?.name ?? "—"} · ${contractor?.name ?? "Not Assigned"}`}
        action={
          <>
            {needsAssignment && (
              <Button leadingIcon={UserPlusRoundedIcon} onClick={() => setShowAssign(true)}>
                Assign Driver
              </Button>
            )}
            {canEditCancel && (
              <>
                <Button variant="secondary" leadingIcon={Pen2Icon} onClick={() => setShowEdit(true)}>
                  Edit
                </Button>
                <Button variant="danger" leadingIcon={ForbiddenIcon} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
            {order.status === "Completed" && (
              <>
                <Button variant="secondary" leadingIcon={RoutingIcon}>
                  Track Order
                </Button>
                {!readOnly && (
                  <Button leadingIcon={RestartIcon} onClick={() => setShowReorder(true)}>
                    Reorder
                  </Button>
                )}
              </>
            )}
          </>
        }
      />

      {/*
        Cards stack in a fixed column on the left so the map has the rest
        of the width and stays in view while the operator scrolls the
        details - the map is what they're here to watch.
      */}
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] items-start">
        <div className="flex flex-col gap-4 min-w-0">
          {/* Driver & Vehicle */}
          <div className="rounded-2xl bg-white border border-border p-4">
            <h3 className="text-body-semibold text-navy mb-3" style={{ fontFamily: "var(--font-sub)" }}>Driver & Vehicle</h3>
            {driver && vehicle ? (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>
                  {driver.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-body-semibold text-navy truncate">{driver.name}</div>
                  <div className="text-caption-1-regular text-muted mt-0.5 truncate">
                    <span style={{ fontFamily: "var(--font-mono)" }}>{vehicle.plateNumber}</span> · {truckTypeLabel(getTruckType(vehicle.truckTypeId))}
                  </div>
                </div>
                <img src={TRUCK_IMAGES[getTruckType(vehicle.truckTypeId).baseClass]} alt="" className="h-12 w-20 object-contain flex-shrink-0" />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 rounded-2lg bg-grey-light">
                <UserIcon size={16} className="text-muted" />
                <span className="text-body-medium text-muted">Not Assigned</span>
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className="rounded-2xl bg-white border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Delivery</h3>
              <div className="flex items-center gap-1.5 text-caption-1-regular text-muted">
                <CameraIcon size={13} />
                POD {order.podRequired ? (order.podUploaded ? "uploaded" : "pending") : "n/a"}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {order.waypoints.map((wp) => (
                <div key={wp.id} className="flex items-start gap-3">
                  <MapPointIcon size={14} className={`mt-0.5 flex-shrink-0 ${wp.type === "Pickup" ? "text-navy" : "text-blue"}`} />
                  <div className="min-w-0">
                    <div className="text-body-2-regular text-navy">
                      <span className="font-semibold">{wp.type}</span> · {wp.name}
                    </div>
                    <div className="text-caption-1-regular text-muted truncate">{wp.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trip & cargo */}
          <div className="rounded-2xl bg-white border border-border p-4">
            <h3 className="text-body-semibold text-navy mb-3" style={{ fontFamily: "var(--font-sub)" }}>Trip & Cargo</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailField label="Trip Type" value={order.tripType} />
              <DetailField label="Truck Type" value={truckTypeLabel(truckType)} />
              <DetailField label="Pickup" value={formatDateTime(order.pickupAt)} />
              <DetailField label="Weight" value={order.weightKg ? `${order.weightKg} kg` : "—"} />
              <DetailField label="Hours" value={order.hours ? `${order.hours}h` : "—"} />
              <DetailField label="Cargo" value={order.cargoTypes.join(", ") || "—"} />
            </div>
            {(order.clientNote || order.supplyNote) && (
              <div className="mt-3 pt-3 border-t border-border grid gap-3">
                {order.clientNote && <DetailField label="Client Note" value={order.clientNote} />}
                {order.supplyNote && <DetailField label="Supply Note" value={order.supplyNote} badge="Internal" />}
              </div>
            )}
          </div>

          <StatusHistoryList history={order.statusHistory} />

          <BiddingWidget bidding={order.bidding} />
        </div>

        {/* Map */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-tile lg:sticky lg:top-4" style={{ height: "calc(100vh - 140px)", minHeight: "560px" }}>
          <Suspense fallback={null}>
            <OrderMap route={route} vehicle={tracked?.position ?? null} className="h-full w-full" />
          </Suspense>

          {/* Floating card over the map, like a pinned popup, for the vehicle being watched. */}
          {tracked && driver && vehicle && (
            <div className="absolute left-4 top-4 z-[1000] w-72 rounded-2xl bg-white border border-border shadow-md p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-caption-2-semibold uppercase tracking-wide ${
                    tracked.live ? "bg-[#DCFCE7] text-status-progress" : "bg-grey-light text-muted"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${tracked.live ? "bg-status-progress" : "bg-muted"}`} />
                  {tracked.live ? "Live" : order.status === "Assigned" ? "At pickup" : "Delivered"}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{vehicle.plateNumber}</div>
                  <div className="text-caption-1-regular text-muted truncate">{driver.name} · {truckTypeLabel(getTruckType(vehicle.truckTypeId))}</div>
                </div>
                <img src={TRUCK_IMAGES[getTruckType(vehicle.truckTypeId).baseClass]} alt="" className="h-10 w-16 object-contain flex-shrink-0" />
              </div>
              <div className="text-caption-1-regular text-muted truncate">
                → {lastDropoff(order.waypoints)?.name ?? order.waypoints[0]?.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAssign && <AssignDriverModal order={order} onClose={() => setShowAssign(false)} />}
      {showEdit && <OrderFormModal mode="edit" initialOrder={order} onClose={() => setShowEdit(false)} />}
      {showReorder && <OrderFormModal mode="create" initialOrder={order} onClose={() => setShowReorder(false)} />}
    </div>
  );
}

function lastDropoff(waypoints: { type: string; name: string }[]) {
  const drops = waypoints.filter((w) => w.type === "Dropoff");
  return drops[drops.length - 1];
}

function DetailField({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-caption-1-regular text-muted uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-mono)" }}>
        {label}
        {badge && <span className="px-1.5 py-0.5 rounded-md bg-[#EEEAFB] text-royal text-caption-2-semibold normal-case">{badge}</span>}
      </div>
      <div className="text-body-regular text-navy">{value}</div>
    </div>
  );
}
