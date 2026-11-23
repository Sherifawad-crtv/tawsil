import { useNavigate, useParams } from "react-router";
import ArrowBackIosNewRounded from "../../components/icons/ArrowBackIosNewRounded";
import PhoneRounded from "../../components/icons/PhoneRounded";
import PhotoCameraRounded from "../../components/icons/PhotoCameraRounded";
import HourglassEmptyRounded from "../../components/icons/HourglassEmptyRounded";
import CheckCircleRounded from "../../components/icons/CheckCircleRounded";
import AddAPhotoRounded from "../../components/icons/AddAPhotoRounded";
import ScreenHeader from "../../components/ScreenHeader";
import MapSnippet from "../../components/MapSnippet";
import { STATUS_STYLE } from "../../components/StatusBadge";
import StatusStepper from "../../components/StatusStepper";
import CollapsibleSection from "../../components/CollapsibleSection";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import { formatDateTime } from "../../lib/format";
import { truckTypeLabel } from "../../lib/constants";
import type { Order } from "../../lib/types";

const MONO = "'Courier Prime', monospace";
const BAND = <div style={{ height: "8px", backgroundColor: "#F5F5F3" }} />;

/** Same layout as the contractor's order details: map pinned behind, details scroll up over it in one white sheet. No price here, and the trip files can be captured. */
export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, profile, captureFile } = useDataStore();
  const order = byId(orders, orderId);

  if (!order) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
        <ScreenHeader title="Order Details" onBack={() => navigate(-1)} />
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#626A76" }}>Order not found.</p>
      </div>
    );
  }

  const status = STATUS_STYLE[order.status];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      {/* The map stays pinned behind; the details scroll up over it */}
      <div className="sticky top-0 z-0" style={{ height: "36dvh", minHeight: "230px", maxHeight: "320px" }}>
        <MapSnippet stops={order.waypoints} />
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="fixed z-40 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
          style={{ top: "max(env(safe-area-inset-top, 16px), 16px)", left: "16px", backgroundColor: "white", boxShadow: "0 2px 12px rgba(4,0,51,0.18)", border: "none" }}
        >
          <ArrowBackIosNewRounded sx={{ fontSize: 17, color: "#040033", marginLeft: "-1px" }} />
        </button>
      </div>

      <div className="relative z-10 -mt-6 rounded-t-[28px] bg-white overflow-hidden" style={{ minHeight: "70dvh", paddingBottom: "40px" }}>
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>

        {/* Headline: status, order id and pickup time */}
        <section className="px-5 pt-3 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className="inline-flex items-center gap-1.5 rounded-xl"
                style={{ backgroundColor: status.bg, color: status.fg, fontFamily: MONO, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px" }}
              >
                <status.icon sx={{ fontSize: 13, color: status.fg }} />
                {order.status}
              </span>
              <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76", marginTop: "8px" }}>#{order.id}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pickup</p>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033", marginTop: "2px" }}>{formatDateTime(order.pickupAt)}</p>
            </div>
          </div>
          <div className="mt-5">
            <StatusStepper status={order.status} />
          </div>
        </section>

        {BAND}

        {/* Route */}
        <section className="px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <Label>Route</Label>
            <div className="flex items-center gap-2">
              <Chip>{order.tripType}</Chip>
              <Chip>POD {order.podRequired ? "required" : "not required"}</Chip>
            </div>
          </div>
          <div className="flex flex-col">
            {order.waypoints.map((wp, i) => {
              const first = i === 0;
              const last = i === order.waypoints.length - 1;
              return (
                <div key={wp.id} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: "16px" }}>
                    <div
                      className="flex-shrink-0"
                      style={{
                        marginTop: "3px",
                        width: "14px",
                        height: "14px",
                        borderRadius: last ? "4px" : "999px",
                        backgroundColor: first ? "#040033" : last ? "#1253FA" : "white",
                        border: first || last ? "none" : "3px solid #1253FA",
                      }}
                    />
                    {!last && <div className="flex-1 w-0.5 my-1" style={{ backgroundColor: "#E8E8E5" }} />}
                  </div>
                  <div className={`min-w-0 ${last ? "" : "pb-5"}`}>
                    <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>{wp.label}</p>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", lineHeight: 1.3, color: "#040033", marginTop: "1px" }}>{wp.address}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {BAND}

        {/* Trip details */}
        <section className="px-5 py-5">
          <Label>Trip details</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
            <Fact label="Trip type" value={order.tripType} />
            <Fact label="Truck type" value={truckTypeLabel(order)} />
            <Fact label="Truck plate" value={order.truckPlate} />
            {order.truckTempC !== undefined && <Fact label="Temperature" value={`${order.truckTempC}°C`} />}
            {order.weightKg !== undefined && <Fact label="Weight" value={`${order.weightKg} kg`} />}
            {order.hours !== undefined && <Fact label="Duration" value={`${order.hours}h`} />}
            {order.km !== undefined && <Fact label="Distance" value={`${order.km} km`} />}
          </div>
        </section>

        {BAND}

        {/* Contacts */}
        <section className="px-5 py-5">
          <Label>Contacts</Label>
          <div className="mt-4 flex flex-col gap-4">
            <Contact role="Client" name={order.clientName} phone={order.clientPhone} />
            <Contact role="Contractor" name={profile.contractorName} />
          </div>
        </section>

        {BAND}

        <CollapsibleSection icon={<PhotoCameraRounded sx={{ fontSize: 18, color: "#1253FA" }} />} title="Trip files & images">
          <FileRow label="Truck's odometer before start" available={!!order.files.odometerBeforeUrl} onCapture={() => captureFile(order.id, "odometerBeforeUrl")} />
          <FileRow label="Truck's odometer at end" available={!!order.files.odometerAfterUrl} onCapture={() => captureFile(order.id, "odometerAfterUrl")} />
          <FileRow label="Additional images" available={order.files.additionalImages.length > 0} onCapture={() => captureFile(order.id, "additionalImage")} />
        </CollapsibleSection>
        <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 20px" }} />
        <CollapsibleSection icon={<HourglassEmptyRounded sx={{ fontSize: 18, color: "#1253FA" }} />} title="Timeline">
          <Timeline order={order} />
        </CollapsibleSection>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76", letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-lg whitespace-nowrap" style={{ fontFamily: MONO, fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
      <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#040033", marginTop: "2px" }}>{value}</p>
    </div>
  );
}

function CallButton({ phone, label }: { phone: string; label: string }) {
  return (
    <a
      href={`tel:${phone.replace(/\s+/g, "")}`}
      aria-label={label}
      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
      style={{ backgroundColor: "#F5F5F3" }}
    >
      <PhoneRounded sx={{ fontSize: 20, color: "#040033" }} />
    </a>
  );
}

function Contact({ role, name, phone }: { role: string; name: string; phone?: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F0F0EE" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "17px", color: "#040033" }}>{name[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>{role}</p>
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#040033" }}>{name}</p>
        {phone && <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>{phone}</p>}
      </div>
      {phone && role === "Client" && <CallButton phone={phone} label={`Call ${name}`} />}
    </div>
  );
}

function FileRow({ label, available, onCapture }: { label: string; available: boolean; onCapture: () => void }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ minHeight: "44px" }}>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#6B7280" }}>{label}</span>
      {available ? (
        <span className="flex items-center gap-1" style={{ color: "#16803C" }}>
          <CheckCircleRounded sx={{ fontSize: 16 }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11.5px" }}>Available</span>
        </span>
      ) : (
        <button
          onClick={onCapture}
          className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5 cursor-pointer active:scale-95 transition-transform"
          style={{ backgroundColor: "#EAF0FE", border: "none" }}
        >
          <AddAPhotoRounded sx={{ fontSize: 14, color: "#1253FA" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11.5px", color: "#1253FA" }}>Capture</span>
        </button>
      )}
    </div>
  );
}

function Timeline({ order }: { order: Order }) {
  return (
    <div className="flex flex-col">
      {order.statusHistory.map((h, i) => (
        <div key={h.id} className="flex gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: "#1253FA" }} />
            {i < order.statusHistory.length - 1 && <div className="w-px flex-1" style={{ backgroundColor: "#E8E8E5" }} />}
          </div>
          <div className="pb-3.5 min-w-0">
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12.5px", color: "#040033" }}>{h.toStatus}</p>
            <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>{formatDateTime(h.timestamp)}</p>
            {h.note && <p className="mt-0.5" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#6B7280" }}>{h.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
