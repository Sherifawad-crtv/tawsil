import { useNavigate, useParams } from "react-router";
import RefreshRounded from "../../components/icons/RefreshRounded";
import AccessTimeRounded from "../../components/icons/AccessTimeRounded";
import PinDropRounded from "../../components/icons/PinDropRounded";
import TaskAltRounded from "../../components/icons/TaskAltRounded";
import PersonRounded from "../../components/icons/PersonRounded";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import ThermostatRounded from "../../components/icons/ThermostatRounded";
import PaymentsRounded from "../../components/icons/PaymentsRounded";
import ScaleRounded from "../../components/icons/ScaleRounded";
import RouteRounded from "../../components/icons/RouteRounded";
import StraightenRounded from "../../components/icons/StraightenRounded";
import PhotoCameraRounded from "../../components/icons/PhotoCameraRounded";
import CheckCircleRounded from "../../components/icons/CheckCircleRounded";
import RadioButtonUncheckedRounded from "../../components/icons/RadioButtonUncheckedRounded";
import ScreenHeader from "../../components/ScreenHeader";
import MapSnippet from "../../components/MapSnippet";
import StatusBadge, { STATUS_STYLE } from "../../components/StatusBadge";
import StatusStepper from "../../components/StatusStepper";
import CollapsibleSection from "../../components/CollapsibleSection";
import { InfoRow, PersonCard } from "../../components/InfoRow";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import { formatEGP, formatDateTime } from "../../lib/format";
import { truckTypeLabel } from "../../lib/constants";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, drivers, trucks, profile } = useDataStore();
  const order = byId(orders, orderId);

  if (!order) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
        <ScreenHeader title="Order Details" onBack={() => navigate(-1)} />
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#9CA3AF" }}>Order not found.</p>
      </div>
    );
  }

  const driver = byId(drivers, order.driverId);
  const truck = byId(trucks, order.truckId);
  const hero = STATUS_STYLE[order.status];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Order Details" onBack={() => navigate(-1)} />

      <MapSnippet />

      {/* Visually a bottom sheet (rounded top, grabber handle, overlaps the map) - scrolls with the page rather than a physically-draggable sheet. */}
      <div className="relative -mt-5 rounded-t-[28px] pt-2" style={{ backgroundColor: "#F5F5F3" }}>
        <div className="flex justify-center py-2">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>

        <div className="w-full max-w-lg mx-auto px-4 pb-10 flex flex-col gap-4">
          {/* 1. Status hero */}
          <div className="rounded-[20px] p-4 flex items-center justify-between gap-3" style={{ backgroundColor: hero.bg }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <hero.icon sx={{ fontSize: 20, color: hero.fg, flexShrink: 0 }} />
              <div className="min-w-0">
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", color: hero.fg }}>{order.status}</p>
                <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: hero.fg, opacity: 0.85 }}>
                  #{order.id}
                </p>
              </div>
            </div>
            <button
              aria-label="Reorder"
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
            >
              <RefreshRounded sx={{ fontSize: 17, color: hero.fg }} />
            </button>
          </div>

          {/* 2. Status stepper */}
          <div className="rounded-[20px] bg-white p-4" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
            <StatusStepper status={order.status} />
          </div>

          {/* 3. Order Information (Order Number lives in the hero card above only - not repeated here) */}
          <Section title="Order Information">
            <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Pickup Time" value={formatDateTime(order.pickupAt)} />
            <InfoRow icon={<PinDropRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Waypoints" value={`${order.waypoints.length} stop${order.waypoints.length === 1 ? "" : "s"}`} />
            <InfoRow icon={<TaskAltRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="POD Required" value={order.podRequired ? "Yes" : "No"} />
          </Section>

          {/* 4. Driver & Truck - moved above Trip Details/files: who's doing this order matters more than cargo specs when checking on it */}
          <Section title="Driver & Truck">
            <div className="flex flex-col gap-2.5">
              {driver ? (
                <PersonCard title="Driver" name={driver.name} subtitle={driver.phone} avatarColor="#0A0070" />
              ) : (
                <UnassignedRow icon={<PersonRounded sx={{ fontSize: 18, color: "#9CA3AF" }} />} label="No driver assigned yet" />
              )}
              {truck ? (
                <div className="rounded-[18px] p-3.5 flex items-center gap-3" style={{ backgroundColor: "#F5F5F3" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1253FA" }}>
                    <LocalShippingRounded sx={{ fontSize: 18, color: "white" }} />
                  </div>
                  <div className="min-w-0">
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Truck</p>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#040033" }}>{truckTypeLabel(order)}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>{truck.plateNumber}</p>
                  </div>
                </div>
              ) : (
                <UnassignedRow icon={<LocalShippingRounded sx={{ fontSize: 18, color: "#9CA3AF" }} />} label="No truck assigned yet" />
              )}
            </div>
          </Section>

          {/* 5. People Involved */}
          <Section title="People Involved">
            <div className="flex flex-col gap-2.5">
              <PersonCard title="Client" name={order.clientName} subtitle={order.clientPhone} avatarColor="#16803C" />
              <PersonCard title="Contractor" name={profile.fullName} subtitle={profile.phone} avatarColor="#040033" />
            </div>
          </Section>

          {/* 6. Trip Details - collapsed by default */}
          <CollapsibleSection icon={<RouteRounded sx={{ fontSize: 16, color: "#1253FA" }} />} title="Trip Details">
            <InfoRow icon={<RouteRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Trip Type" value={order.tripType} />
            <InfoRow icon={<LocalShippingRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Truck Type" value={truckTypeLabel(order)} />
            {order.truckTempC !== undefined && (
              <InfoRow icon={<ThermostatRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Truck Temperature" value={`${order.truckTempC}°C`} />
            )}
            <InfoRow icon={<PaymentsRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Price" value={formatEGP(order.priceEGP)} />
            {order.weightKg !== undefined && <InfoRow icon={<ScaleRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Weight" value={`${order.weightKg} kg`} />}
            {order.hours !== undefined && <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Hours" value={`${order.hours}h`} />}
            {order.km !== undefined && <InfoRow icon={<StraightenRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Distance" value={`${order.km} km`} />}
          </CollapsibleSection>

          {/* 7. Trip files & images - read-only for Contractor: view-only status, no upload affordance (the Driver app owns submitting these) */}
          <CollapsibleSection icon={<PhotoCameraRounded sx={{ fontSize: 16, color: "#1253FA" }} />} title="Trip Files & Images">
            <FileRow label="Truck's odometer before start" available={!!order.files.odometerBeforeUrl} />
            <FileRow label="Truck's odometer at end" available={!!order.files.odometerAfterUrl} />
            <FileRow label="Additional images" available={order.files.additionalImages.length > 0} />
          </CollapsibleSection>

          {/* 8. Route Waypoints */}
          {order.waypoints.length > 0 && (
            <Section title="Route Waypoints">
              <div className="flex flex-col gap-2.5">
                {order.waypoints.map((wp, i) => (
                  <div key={wp.id} className="flex items-start gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: i === 0 ? "#EAF0FE" : "#FDECEC" }}
                    >
                      <PinDropRounded sx={{ fontSize: 13, color: i === 0 ? "#1253FA" : "#DC2626" }} />
                    </div>
                    <div className="min-w-0">
                      <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>{wp.label}</p>
                      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#6B7280" }}>{wp.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 9. Timeline */}
          <Section title="Timeline">
            <div className="flex flex-col">
              {order.statusHistory.map((h, i) => (
                <div key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: "#1253FA" }} />
                    {i < order.statusHistory.length - 1 && <div className="w-px flex-1" style={{ backgroundColor: "#E8E8E5" }} />}
                  </div>
                  <div className="pb-3.5 min-w-0">
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12.5px", color: "#040033" }}>{h.toStatus}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>{formatDateTime(h.timestamp)}</p>
                    {h.note && <p className="mt-0.5" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#6B7280" }}>{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-white p-4" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
      <h3 className="mb-1" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>{title}</h3>
      {children}
    </div>
  );
}

function UnassignedRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-[18px] p-3.5 flex items-center gap-3" style={{ backgroundColor: "#F5F5F3", border: "1px dashed #D8D9D4" }}>
      {icon}
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "12.5px", color: "#9CA3AF" }}>{label}</span>
    </div>
  );
}

function FileRow({ label, available }: { label: string; available: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#6B7280" }}>{label}</span>
      {available ? (
        <span className="flex items-center gap-1" style={{ color: "#16803C" }}>
          <CheckCircleRounded sx={{ fontSize: 16 }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11.5px" }}>Available</span>
        </span>
      ) : (
        <span className="flex items-center gap-1" style={{ color: "#9CA3AF" }}>
          <RadioButtonUncheckedRounded sx={{ fontSize: 16 }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11.5px" }}>Not Available</span>
        </span>
      )}
    </div>
  );
}
