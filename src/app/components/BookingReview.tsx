import { useState } from "react";
import { VEHICLES } from "./VehicleCarouselSelectable";
import type { DeliverySettings } from "./DeliveryOptions";
import type { DropoffStop } from "./DropoffStops";
import type { AddedLocation } from "./PickupLocationScreen";

/* ══════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════ */
interface BookingReviewProps {
  isMobile: boolean;
  truckId: string;
  configId: string;
  weightKg: number;
  schedule: { mode: "now" | "schedule"; date?: Date; time?: string };
  deliverySettings: DeliverySettings;
  dropoffStops: DropoffStop[];
  pickupLocations: AddedLocation[];
  onBack: () => void;
  onConfirm: () => void;
}

/* ── config label map ── */
const CONFIG_LABELS: Record<string, { name: string; detail: string }> = {
  frozen: { name: "Frozen", detail: "Below -18°C" },
  chilled: { name: "Chilled", detail: "0°C to 5°C" },
  open: { name: "Open", detail: "Flatbed cargo" },
  closed: { name: "Closed", detail: "Sealed box" },
};

/* ── helpers ── */
function formatDate(d?: Date) {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/* ══════════════════════════════════════════
   SECTION WRAPPER
   ══════════════════════════════════════════ */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(18,83,250,0.07)" }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9CA3AF",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return <div className="my-5" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />;
}

/* ── Row ── */
function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF" }}>
        {label}
      </span>
      <span
        className="text-right"
        style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          color: accent ? "#1253FA" : "#040033",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Status Pill ── */
function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
      style={{
        backgroundColor: active ? "rgba(18,83,250,0.07)" : "rgba(0,0,0,0.03)",
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 600,
        fontSize: "12px",
        color: active ? "#1253FA" : "#9CA3AF",
      }}
    >
      <div
        className="w-[6px] h-[6px] rounded-full"
        style={{ backgroundColor: active ? "#1253FA" : "#D8D9D4" }}
      />
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════
   ICONS (inline SVG)
   ══════════════════════════════════════════ */
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="9" height="8" rx="1.5" stroke="#1253FA" strokeWidth="1.4" />
    <path d="M10 7H13L15 10V12H10V7Z" stroke="#1253FA" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="4" cy="13" r="1.5" stroke="#1253FA" strokeWidth="1.2" />
    <circle cx="12.5" cy="13" r="1.5" stroke="#1253FA" strokeWidth="1.2" />
  </svg>
);
const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke="#1253FA" strokeWidth="1.4" />
    <path d="M8 1V3M8 13V15M1 8H3M13 8H15M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M12.95 3.05L11.54 4.46M4.46 11.54L3.05 12.95" stroke="#1253FA" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.24 10.76 1 8 1Z" stroke="#1253FA" strokeWidth="1.4" fill="none" />
    <circle cx="8" cy="6" r="2" fill="#1253FA" />
  </svg>
);
const WeightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 14H13L11 5H5L3 14Z" stroke="#1253FA" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="8" cy="3.5" r="2" stroke="#1253FA" strokeWidth="1.3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="#1253FA" strokeWidth="1.4" />
    <path d="M8 4.5V8L10.5 10" stroke="#1253FA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1L2.5 3.5V7.5C2.5 11 5 13.5 8 15C11 13.5 13.5 11 13.5 7.5V3.5L8 1Z" stroke="#1253FA" strokeWidth="1.4" fill="none" />
    <path d="M5.5 8L7 9.5L10.5 6" stroke="#1253FA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function BookingReview({
  isMobile,
  truckId,
  configId,
  weightKg,
  schedule,
  deliverySettings,
  dropoffStops,
  pickupLocations,
  onBack,
  onConfirm,
}: BookingReviewProps) {
  const [confirmed, setConfirmed] = useState(false);

  const truck = VEHICLES.find((v) => v.id === truckId) || VEHICLES[0];
  const config = CONFIG_LABELS[configId] || CONFIG_LABELS["closed"];

  /* fake price calc */
  const basePrice = truck.id === "jumbo" ? 850 : truck.id === "trailer" ? 620 : truck.id === "van" ? 380 : 280;
  const configMult = configId === "frozen" ? 1.4 : configId === "chilled" ? 1.2 : 1;
  const weightSurcharge = weightKg > 1000 ? 120 : weightKg > 500 ? 60 : 0;
  const stopFee = Math.max(0, dropoffStops.length - 1) * 45;
  const insuranceFee = deliverySettings.insurance ? 75 : 0;
  const subtotal = Math.round(basePrice * configMult + weightSurcharge + stopFee + insuranceFee);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => onConfirm(), 1500);
  };

  /* ── Confirmed state ── */
  if (confirmed) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-6"
        style={{
          minHeight: "100dvh",
          backgroundColor: "#F5F5F3",
          padding: "40px 24px",
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18L15 25L28 11" stroke="#1253FA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-center">
          <h1
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "28px",
              color: "#040033",
              marginBottom: "8px",
            }}
          >
            Booking Confirmed
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "14px", color: "#9CA3AF" }}>
            Your truck is being dispatched. Track it in real-time.
          </p>
        </div>
        <div
          className="px-5 py-3 rounded-2xl"
          style={{ backgroundColor: "rgba(18,83,250,0.06)" }}
        >
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "#1253FA" }}>
            Order #FLT-{Math.floor(Math.random() * 9000 + 1000)}
          </span>
        </div>
      </div>
    );
  }

  /* ── Main Review Content ── */
  const content = (
    <div className="flex flex-col" style={{ minHeight: 0 }}>
      {/* ─── TRUCK TYPE ─── */}
      <Section title="Vehicle" icon={<TruckIcon />}>
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#F8F8F6" }}
          >
            <img src={truck.image} alt={truck.name} className="w-16 h-16 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "18px",
                color: "#040033",
              }}
            >
              {truck.name}
            </h3>
            <span
              className="inline-block mt-1 px-2.5 py-1 rounded-lg"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "11px",
                color: "#1253FA",
                backgroundColor: "rgba(18,83,250,0.06)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {truck.id === "jumbo" ? "Heavy Duty" : truck.id === "trailer" ? "Long Haul" : truck.id === "van" ? "Mid-Range" : "Light Load"}
            </span>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 opacity-30">
            <path d="M7 5L12 10L7 15" stroke="#040033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Section>

      <Divider />

      {/* ─── CONFIGURATION ─── */}
      <Section title="Configuration" icon={<GearIcon />}>
        <div
          className="flex items-center justify-between p-4 rounded-2xl"
          style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: "#040033",
              }}
            >
              {config.name}
            </span>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
              {config.detail}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(18,83,250,0.06)" }}
          >
            {configId === "frozen" && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2V16M2 9H16" stroke="#1253FA" strokeWidth="1.6" strokeLinecap="round" /><path d="M5 5L13 13M13 5L5 13" stroke="#1253FA" strokeWidth="1.2" strokeLinecap="round" /></svg>
            )}
            {configId === "chilled" && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="7" y="3" width="4" height="10" rx="2" stroke="#1253FA" strokeWidth="1.4" /><circle cx="9" cy="14" r="2.5" stroke="#1253FA" strokeWidth="1.4" /></svg>
            )}
            {(configId === "open" || configId === "closed") && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="10" rx="2" stroke="#1253FA" strokeWidth="1.4" /><path d="M2 8H16" stroke="#1253FA" strokeWidth="1.2" /></svg>
            )}
          </div>
        </div>
      </Section>

      <Divider />

      {/* ─── ROUTE ─── */}
      <Section title="Route" icon={<PinIcon />}>
        <div
          className="p-4 rounded-2xl"
          style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          {/* Pickup */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 2px #040033" }} />
              <div style={{ width: "2px", height: "24px", backgroundColor: "#E8E8E5", margin: "4px 0" }} />
            </div>
            <div className="flex-1 min-w-0 -mt-1">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pickup</span>
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033", marginTop: "1px" }}>
                {pickupLocations.length > 0 ? pickupLocations[0].address : "Al Quoz Industrial Area"}
              </p>
            </div>
          </div>

          {/* Drop-offs */}
          {(dropoffStops.length > 0 ? dropoffStops : [{ id: "default", address: "Jebel Ali Free Zone, Gate 3", label: "Warehouse A" }]).map((stop, i, arr) => (
            <div key={stop.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 2px #1253FA" }} />
                {i < arr.length - 1 && (
                  <div style={{ width: "2px", height: "24px", backgroundColor: "#E8E8E5", margin: "4px 0" }} />
                )}
              </div>
              <div className="flex-1 min-w-0 -mt-1">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Drop-off {arr.length > 1 ? `#${i + 1}` : ""}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: "10px",
                      color: "#1253FA",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033", marginTop: "1px" }}>
                  {stop.address}
                </p>
              </div>
            </div>
          ))}
        </div>
        {dropoffStops.length > 1 && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
              {dropoffStops.length} stops • ~{dropoffStops.length * 18 + 22} min est.
            </span>
          </div>
        )}
      </Section>

      <Divider />

      {/* ─── WEIGHT & SCHEDULE ─── */}
      <div className="grid grid-cols-2 gap-3">
        <Section title="Weight" icon={<WeightIcon />}>
          <div
            className="p-4 rounded-2xl"
            style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "#040033" }}>
              {weightKg > 0 ? weightKg.toLocaleString() : "—"}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF", marginLeft: "4px" }}>
              kg
            </span>
          </div>
        </Section>

        <Section title="Schedule" icon={<ClockIcon />}>
          <div
            className="p-4 rounded-2xl"
            style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            {schedule.mode === "now" ? (
              <>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#040033" }}>
                  ASAP
                </span>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                  ~15 min dispatch
                </p>
              </>
            ) : (
              <>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
                  {formatDate(schedule.date)}
                </span>
                {schedule.time && (
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#1253FA", marginTop: "2px" }}>
                    {schedule.time}
                  </p>
                )}
              </>
            )}
          </div>
        </Section>
      </div>

      <Divider />

      {/* ─── DELIVERY OPTIONS / POD ─── */}
      <Section title="Delivery & POD" icon={<ShieldIcon />}>
        <div
          className="p-4 rounded-2xl flex flex-wrap gap-2"
          style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <StatusPill active={deliverySettings.proofOfDelivery} label="Proof of Delivery" />
          <StatusPill active={deliverySettings.signatureRequired} label="Signature" />
          <StatusPill active={deliverySettings.insurance} label="Cargo Insurance" />
          <StatusPill active={deliverySettings.liveNotifications} label="Live Tracking" />
          <StatusPill active={deliverySettings.driverNotes} label="Driver Notes" />
        </div>
      </Section>

      <Divider />

      {/* ─── PRICE BREAKDOWN ─── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "2px solid #040033" }}
      >
        {/* header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: "#040033" }}
        >
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Price Estimate
          </span>
          <span
            className="px-2.5 py-1 rounded-lg"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            Final at delivery
          </span>
        </div>

        {/* breakdown rows */}
        <div className="px-5 py-4" style={{ backgroundColor: "white" }}>
          <InfoRow label="Base fare" value={`EGP ${basePrice}`} />
          {configMult > 1 && (
            <InfoRow label="Config surcharge" value={`EGP ${Math.round(basePrice * (configMult - 1))}`} />
          )}
          {weightSurcharge > 0 && <InfoRow label="Weight surcharge" value={`EGP ${weightSurcharge}`} />}
          {stopFee > 0 && <InfoRow label={`Multi-stop (×${dropoffStops.length - 1})`} value={`EGP ${stopFee}`} />}
          {insuranceFee > 0 && <InfoRow label="Cargo insurance" value={`EGP ${insuranceFee}`} />}

          <div className="my-3" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />

          <div className="flex items-center justify-between py-1">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>
              Subtotal
            </span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
              EGP {subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>
              VAT (5%)
            </span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#9CA3AF" }}>
              EGP {vat}
            </span>
          </div>

          <div className="my-3" style={{ height: "1.5px", backgroundColor: "#040033" }} />

          {/* TOTAL */}
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#040033",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "28px",
                color: "#040033",
                lineHeight: "1.1",
              }}
            >
              EGP {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── Booking ID ── */}
      <div
        className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: "rgba(4,0,51,0.03)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="2" stroke="#9CA3AF" strokeWidth="1.2" />
          <path d="M3.5 5H8.5M3.5 7.5H6.5" stroke="#9CA3AF" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
          Booking Ref: FLT-{Math.floor(1000 + Math.random() * 9000)} • {schedule.mode === "now" ? "Immediate" : "Scheduled"}
        </span>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     FULL SCREEN LAYOUT
     ══════════════════════════════════════════ */
  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#F5F5F3",
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center gap-3 flex-shrink-0 px-5"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 16px), 16px)",
          paddingBottom: "12px",
          backgroundColor: "rgba(245,245,243,0.98)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #E8E8E5",
        }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer active:opacity-70 transition-opacity flex-shrink-0"
          style={{ backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="#040033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: isMobile ? "20px" : "24px",
              color: "#040033",
              lineHeight: "1.15",
            }}
          >
            Review Booking
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginTop: "1px" }}>
            Verify all details before confirming.
          </p>
        </div>
        {/* Step indicator pill */}
        <div
          className="flex-shrink-0 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: "rgba(18,83,250,0.06)" }}
        >
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: "#1253FA", letterSpacing: "0.06em" }}>
            FINAL
          </span>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: isMobile ? "20px 16px" : "28px 24px",
          maxWidth: isMobile ? "100%" : "520px",
          marginLeft: isMobile ? undefined : "auto",
          marginRight: isMobile ? undefined : "auto",
          width: "100%",
        }}
      >
        {content}
      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="flex-shrink-0"
        style={{
          padding: isMobile ? "16px 16px" : "16px 24px",
          paddingBottom: isMobile ? "max(env(safe-area-inset-bottom, 20px), 20px)" : "20px",
          borderTop: "1px solid #E8E8E5",
          backgroundColor: "rgba(245,245,243,0.98)",
          backdropFilter: "blur(16px)",
          maxWidth: isMobile ? "100%" : "520px",
          marginLeft: isMobile ? undefined : "auto",
          marginRight: isMobile ? undefined : "auto",
          width: "100%",
        }}
      >
        {/* Total summary above CTA */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF" }}>
            Total (incl. VAT)
          </span>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "#040033" }}>
            EGP {total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full rounded-2xl flex items-center justify-center gap-3 active:scale-[0.97] transition-transform cursor-pointer"
          style={{
            backgroundColor: "#040033",
            padding: "18px",
            boxShadow: "0 6px 24px rgba(4,0,51,0.3)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8.5 14.5L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "16px",
              color: "white",
              letterSpacing: "0.03em",
            }}
          >
            Confirm Booking
          </span>
        </button>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0.5L1 2.5V5C1 7.5 3 9 5 10C7 9 9 7.5 9 5V2.5L5 0.5Z" fill="#D8D9D4" />
            </svg>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
              Secure booking
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#D8D9D4" strokeWidth="1.2" />
              <path d="M5 2.5V5L6.5 6.5" stroke="#D8D9D4" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
              Cancel anytime
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="2.5" width="8" height="5.5" rx="1" stroke="#D8D9D4" strokeWidth="1" />
              <path d="M1 4.5H9" stroke="#D8D9D4" strokeWidth="0.8" />
            </svg>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
              Pay on delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}