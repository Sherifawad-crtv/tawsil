import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import AccessTimeRounded from "../../components/icons/AccessTimeRounded";
import PinDropRounded from "../../components/icons/PinDropRounded";
import PaymentsRounded from "../../components/icons/PaymentsRounded";
import GroupsRounded from "../../components/icons/GroupsRounded";
import TaskAltRounded from "../../components/icons/TaskAltRounded";
import PersonRounded from "../../components/icons/PersonRounded";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import PhotoCameraRounded from "../../components/icons/PhotoCameraRounded";
import CheckCircleRounded from "../../components/icons/CheckCircleRounded";
import RadioButtonUncheckedRounded from "../../components/icons/RadioButtonUncheckedRounded";
import HourglassEmptyRounded from "../../components/icons/HourglassEmptyRounded";
import ScreenHeader from "../../components/ScreenHeader";
import { Button } from "../../components/Button";
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
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#626A76" }}>Order not found.</p>
      </div>
    );
  }

  const driver = byId(drivers, order.driverId);
  const truck = byId(trucks, order.truckId);
  const hero = STATUS_STYLE[order.status];
  const unassigned = order.status === "Accepted" && !order.driverId;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Order Details" subtitle={`#${order.id}`} onBack={() => navigate(-1)} />

      <MapSnippet />

      <div className="relative -mt-5 rounded-t-[28px] pt-2" style={{ backgroundColor: "#F5F5F3" }}>
        <div className="flex justify-center py-2">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>

        <div
          className="w-full max-w-lg mx-auto px-4 flex flex-col gap-4"
          style={{ paddingBottom: unassigned ? "calc(env(safe-area-inset-bottom, 16px) + 88px)" : "40px" }}
        >
          <div className="rounded-[20px] p-4" style={{ backgroundColor: hero.bg }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <hero.icon sx={{ fontSize: 20, color: hero.fg, flexShrink: 0 }} />
                <div className="min-w-0">
                  <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: hero.fg }}>{order.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: hero.fg }}>
                  {formatEGP(order.priceEGP)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-4" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
            <StatusStepper status={order.status} />
          </div>

          <div className="rounded-[20px] bg-white overflow-hidden" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
            {driver ? (
              <div className="p-4">
                <PersonCard title="Driver" name={driver.name} subtitle={driver.phone} avatarColor="#0A0070" />
              </div>
            ) : (
              <div className="p-4">
                <UnassignedRow icon={<PersonRounded sx={{ fontSize: 18, color: "#626A76" }} />} label="No driver assigned yet" />
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
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#626A76" }}>Vehicle</p>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#040033" }}>{truckTypeLabel(order)}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>{truck.plateNumber}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <UnassignedRow icon={<LocalShippingRounded sx={{ fontSize: 18, color: "#626A76" }} />} label="No vehicle assigned yet" />
              </div>
            )}
          </div>

          <Section title="Trip" icon={<PinDropRounded sx={{ fontSize: 15, color: "#1253FA" }} />}>
            <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 15, color: "#626A76" }} />} label="Pickup Time" value={formatDateTime(order.pickupAt)} />
            <InfoRow icon={<TaskAltRounded sx={{ fontSize: 15, color: "#626A76" }} />} label="POD Required" value={order.podRequired ? "Yes" : "No"} />
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

          <Section title="Fare" icon={<PaymentsRounded sx={{ fontSize: 15, color: "#1253FA" }} />}>
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

          <Section title="Contacts" icon={<GroupsRounded sx={{ fontSize: 15, color: "#1253FA" }} />}>
            <div className="flex flex-col gap-2.5">
              <PersonCard title="Client" name={order.clientName} subtitle={order.clientPhone} avatarColor="#16803C" />
              <PersonCard title="Contractor" name={profile.fullName} subtitle={profile.phone} avatarColor="#040033" />
            </div>
          </Section>

          <CollapsibleSection icon={<PhotoCameraRounded sx={{ fontSize: 15, color: "#1253FA" }} />} title="Trip Files & Images">
            <FileRow label="Truck's odometer before start" available={!!order.files.odometerBeforeUrl} />
            <FileRow label="Truck's odometer at end" available={!!order.files.odometerAfterUrl} />
            <FileRow label="Additional images" available={order.files.additionalImages.length > 0} />
          </CollapsibleSection>

          <CollapsibleSection icon={<HourglassEmptyRounded sx={{ fontSize: 15, color: "#1253FA" }} />} title="Timeline">
            <div className="flex flex-col">
              {order.statusHistory.map((h, i) => (
                <div key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: "#1253FA" }} />
                    {i < order.statusHistory.length - 1 && <div className="w-px flex-1" style={{ backgroundColor: "#E8E8E5" }} />}
                  </div>
                  <div className="pb-3.5 min-w-0">
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12.5px", color: "#040033" }}>{h.toStatus}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76" }}>{formatDateTime(h.timestamp)}</p>
                    {h.note && <p className="mt-0.5" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#6B7280" }}>{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      </div>

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
            <Button onClick={() => setDispatchOpen(true)}>Dispatch Now</Button>
          </div>
        </div>
      )}

      {dispatchOpen && <DispatchSheet order={order} onClose={() => setDispatchOpen(false)} />}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-4" style={{ boxShadow: "0 2px 14px rgba(4,0,51,0.05)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
          {icon}
        </div>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033", letterSpacing: "0.02em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function UnassignedRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-[18px] p-3.5 flex items-center gap-3" style={{ backgroundColor: "#F5F5F3", border: "1px dashed #D8D9D4" }}>
      {icon}
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "12.5px", color: "#626A76" }}>{label}</span>
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
        <span className="flex items-center gap-1" style={{ color: "#626A76" }}>
          <RadioButtonUncheckedRounded sx={{ fontSize: 16 }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11.5px" }}>Not Available</span>
        </span>
      )}
    </div>
  );
}
