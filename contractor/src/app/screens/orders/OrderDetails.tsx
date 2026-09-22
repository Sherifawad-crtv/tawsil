import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import RefreshRounded from "../../components/icons/RefreshRounded";
import AccessTimeRounded from "../../components/icons/AccessTimeRounded";
import PinDropRounded from "../../components/icons/PinDropRounded";
import TaskAltRounded from "../../components/icons/TaskAltRounded";
import PersonRounded from "../../components/icons/PersonRounded";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import PhotoCameraRounded from "../../components/icons/PhotoCameraRounded";
import CheckCircleRounded from "../../components/icons/CheckCircleRounded";
import RadioButtonUncheckedRounded from "../../components/icons/RadioButtonUncheckedRounded";
import HourglassEmptyRounded from "../../components/icons/HourglassEmptyRounded";
import ScreenHeader from "../../components/ScreenHeader";
import MapSnippet from "../../components/MapSnippet";
import DispatchSheet from "../../components/DispatchSheet";
import { STATUS_STYLE } from "../../components/StatusBadge";
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
  const [dispatchOpen, setDispatchOpen] = useState(false);

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
  const unassigned = order.status === "Accepted" && !order.driverId;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Order Details" onBack={() => navigate(-1)} />

      <MapSnippet />

      {/* Visually a bottom sheet (rounded top, grabber handle, overlaps the map) - scrolls with the page rather than a physically-draggable sheet. */}
      <div className="relative -mt-5 rounded-t-[28px] pt-2" style={{ backgroundColor: "#F5F5F3" }}>
        <div className="flex justify-center py-2">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>

        <div
          className="w-full max-w-lg mx-auto px-4 flex flex-col gap-4"
          style={{ paddingBottom: unassigned ? "calc(env(safe-area-inset-bottom, 16px) + 88px)" : "40px" }}
        >
          {/* 1. Status + fare - the two facts that matter most at a glance, together up top. */}
          <div className="rounded-[20px] p-4" style={{ backgroundColor: hero.bg }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <hero.icon sx={{ fontSize: 20, color: hero.fg, flexShrink: 0 }} />
                <div className="min-w-0">
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", color: hero.fg }}>{order.status}</p>
                  <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: hero.fg, opacity: 0.85 }}>
                    #{order.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: hero.fg }}>
                  {formatEGP(order.priceEGP)}
                </span>
                <button
                  aria-label="Reorder"
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                >
                  <RefreshRounded sx={{ fontSize: 17, color: hero.fg }} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Status stepper - secondary to the hero above, compact progress reference. */}
          <div className="rounded-[20px] bg-white p-4" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
            <StatusStepper status={order.status} />
          </div>

          {/* 3. Driver & Vehicle - the single most important fact once a trip is in motion, promoted right under status. One card, no title chrome. */}
          <div className="rounded-[20px] bg-white overflow-hidden" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
            {driver ? (
              <div className="p-4">
                <PersonCard title="Driver" name={driver.name} subtitle={driver.phone} avatarColor="#0A0070" />
              </div>
            ) : (
              <div className="p-4">
                <UnassignedRow icon={<PersonRounded sx={{ fontSize: 18, color: "#9CA3AF" }} />} label="No driver assigned yet" />
              </div>
            )}
            <div style={{ height: "1px", backgroundColor: "#F0F0EE" }} />
            {truck ? (
              <div className="p-4">
                <div className="rounded-[18px] p-3.5 flex items-center gap-3" style={{ backgroundColor: "#F5F5F3" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1253FA" }}>
                    <LocalShippingRounded sx={{ fontSize: 18, color: "white" }} />
                  </div>
                  <div className="min-w-0">
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Vehicle</p>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#040033" }}>{truckTypeLabel(order)}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>{truck.plateNumber}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <UnassignedRow icon={<LocalShippingRounded sx={{ fontSize: 18, color: "#9CA3AF" }} />} label="No vehicle assigned yet" />
              </div>
            )}
          </div>

          {/* 4. Trip - schedule anchor first, then the route as a single scannable list (no separate map-duplicating section). */}
          <Section title="Trip">
            <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Pickup Time" value={formatDateTime(order.pickupAt)} />
            <InfoRow icon={<TaskAltRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="POD Required" value={order.podRequired ? "Yes" : "No"} />
            {order.waypoints.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-3 pt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
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
            )}
          </Section>

          {/* 5. Fare Breakdown - plain label/value receipt rows, ending in the same total shown in the hero above. */}
          <Section title="Fare Breakdown">
            <InfoRow label="Trip Type" value={order.tripType} />
            <InfoRow label="Truck Type" value={truckTypeLabel(order)} />
            {order.truckTempC !== undefined && <InfoRow label="Truck Temperature" value={`${order.truckTempC}°C`} />}
            {order.weightKg !== undefined && <InfoRow label="Weight" value={`${order.weightKg} kg`} />}
            {order.hours !== undefined && <InfoRow label="Duration" value={`${order.hours}h`} />}
            {order.km !== undefined && <InfoRow label="Distance" value={`${order.km} km`} />}
            <div className="flex items-center justify-between mt-2 pt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#040033" }}>Total</span>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>{formatEGP(order.priceEGP)}</span>
            </div>
          </Section>

          {/* 6. Contacts - secondary to Driver & Vehicle, tucked below the fare. */}
          <Section title="Contacts">
            <div className="flex flex-col gap-2.5">
              <PersonCard title="Client" name={order.clientName} subtitle={order.clientPhone} avatarColor="#16803C" />
              <PersonCard title="Contractor" name={profile.fullName} subtitle={profile.phone} avatarColor="#040033" />
            </div>
          </Section>

          {/* 7. Trip files & images - read-only for Contractor: view-only status, no upload affordance (the Driver app owns submitting these). Collapsed - administrative detail, not glanceable info. */}
          <CollapsibleSection icon={<PhotoCameraRounded sx={{ fontSize: 16, color: "#1253FA" }} />} title="Trip Files & Images">
            <FileRow label="Truck's odometer before start" available={!!order.files.odometerBeforeUrl} />
            <FileRow label="Truck's odometer at end" available={!!order.files.odometerAfterUrl} />
            <FileRow label="Additional images" available={order.files.additionalImages.length > 0} />
          </CollapsibleSection>

          {/* 8. Timeline - collapsed by default, same as Files: a log you check, not something to scan by default. */}
          <CollapsibleSection icon={<HourglassEmptyRounded sx={{ fontSize: 16, color: "#1253FA" }} />} title="Timeline">
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
          </CollapsibleSection>
        </div>
      </div>

      {/* Sticky dispatch bar - only for an unassigned order, always pinned to the bottom of this screen. */}
      {unassigned && (
        <div
          className="fixed left-0 right-0 bottom-0 z-40"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid #F0F0EE",
            padding: "12px 16px calc(env(safe-area-inset-bottom, 12px) + 12px) 16px",
          }}
        >
          <div className="w-full max-w-lg mx-auto">
            <button
              onClick={() => setDispatchOpen(true)}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-transform"
              style={{ backgroundColor: "#040033", border: "none" }}
            >
              <LocalShippingRounded sx={{ fontSize: 14, color: "white" }} />
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "white" }}>
                Dispatch Now
              </span>
            </button>
          </div>
        </div>
      )}

      {dispatchOpen && <DispatchSheet order={order} onClose={() => setDispatchOpen(false)} />}
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
