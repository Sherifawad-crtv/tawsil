import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, UserIcon, MapPointIcon, CameraIcon, UserPlusRoundedIcon, Pen2Icon, ForbiddenIcon, RoutingIcon, RestartIcon } from "@solar-icons/react/linear";
import StatusBadge from "../../components/StatusBadge";
import StatusHistoryList from "../../components/orders/StatusHistoryList";
import BiddingWidget from "../../components/orders/BiddingWidget";
import AssignDriverModal from "../../components/orders/AssignDriverModal";
import OrderFormModal from "../../components/orders/OrderFormModal";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { byId, getTruckType, canAssignDrivers } from "../../lib/selectors";
import { Button } from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import { truckTypeLabel } from "../../lib/constants";
import { formatDateTime } from "../../lib/format";

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

  const canEditCancel = order.status !== "Completed" && order.status !== "Cancelled";
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
                <Button leadingIcon={RestartIcon} onClick={() => setShowReorder(true)}>
                  Reorder
                </Button>
              </>
            )}
          </>
        }
      />

      <StatusHistoryList history={order.statusHistory} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Trip & cargo */}
          <div className="rounded-2xl bg-tile p-4">
            <h3 className="text-body-semibold text-navy mb-4" style={{ fontFamily: "var(--font-sub)" }}>Trip & Cargo</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <DetailField label="Trip Type" value={order.tripType} />
              <DetailField label="Truck Type" value={truckTypeLabel(truckType)} />
              <DetailField label="Pickup" value={formatDateTime(order.pickupAt)} />
              <DetailField label="Cargo Types" value={order.cargoTypes.join(", ") || "—"} />
              <DetailField label="Weight" value={order.weightKg ? `${order.weightKg} kg` : "—"} />
              <DetailField label="Hours" value={order.hours ? `${order.hours}h` : "—"} />
            </div>
            {(order.clientNote || order.supplyNote) && (
              <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-4">
                {order.clientNote && <DetailField label="Client Note" value={order.clientNote} />}
                {order.supplyNote && <DetailField label="Supply Note" value={order.supplyNote} badge="Internal" />}
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className="rounded-2xl bg-tile p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Delivery</h3>
              <div className="flex items-center gap-1.5 text-caption-1-regular text-muted">
                <CameraIcon size={13} />
                POD {order.podRequired ? (order.podUploaded ? "uploaded" : "required — pending") : "not required"}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {order.waypoints.map((wp) => (
                <div key={wp.id} className="flex items-start gap-3">
                  <MapPointIcon size={14} className={`mt-0.5 flex-shrink-0 ${wp.type === "Pickup" ? "text-navy" : "text-blue"}`} />
                  <div className="min-w-0">
                    <div className="text-body-regular text-navy">
                      <span className="font-semibold">{wp.type}</span> · {wp.name}
                    </div>
                    <div className="text-caption-1-regular text-muted truncate">{wp.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BiddingWidget bidding={order.bidding} />
        </div>

        <div className="flex flex-col gap-6">
          {/* Driver & Vehicle */}
          <div className="rounded-2xl bg-tile p-4">
            <h3 className="text-body-semibold text-navy mb-4" style={{ fontFamily: "var(--font-sub)" }}>Driver & Vehicle Information</h3>
            {driver && vehicle ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>
                  {driver.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-body-semibold text-navy">{driver.name}</div>
                  <div className="text-caption-1-regular text-muted mt-0.5">{vehicle.plateNumber} · {truckTypeLabel(getTruckType(vehicle.truckTypeId))}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 rounded-2lg bg-grey-light/60">
                <UserIcon size={16} className="text-muted" />
                <span className="text-body-medium text-muted">Not Assigned</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAssign && <AssignDriverModal order={order} onClose={() => setShowAssign(false)} />}
      {showEdit && <OrderFormModal mode="edit" initialOrder={order} onClose={() => setShowEdit(false)} />}
      {showReorder && <OrderFormModal mode="create" initialOrder={order} onClose={() => setShowReorder(false)} />}
    </div>
  );
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
