import BookingTypeSelector from "./BookingTypeSelector";
import type { BookingTypeState } from "./BookingTypeSelector";
import { INITIAL_BOOKING_STATE } from "./BookingTypeSelector";
import VehicleCarouselSelectable from "./VehicleCarouselSelectable";
import TruckConfigGrid from "./TruckConfigGrid";
import WeightInput from "./WeightInput";
import { ScheduleModal } from "./SchedulePicker";
import DropoffStops from "./DropoffStops";
import type { DropoffStop } from "./DropoffStops";
import PickupStepInline from "./PickupStepInline";
import type { AddedLocation } from "./PickupStepInline";
import ReviewStepInline from "./ReviewStepInline";
import BiddingScreen from "./BiddingScreen";
import type { Offer } from "./BiddingScreen";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import NavigationRounded from "@mui/icons-material/NavigationRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#040033;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});
const dropoffIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#1253FA;border:3px solid white;box-shadow:0 2px 8px rgba(18,83,250,0.35);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const PICKUP: [number, number] = [25.204849, 55.270783];
const DROPOFF: [number, number] = [25.117664, 55.200371];
const ROUTE: [number, number][] = [
  PICKUP, [25.198, 55.26], [25.185, 55.245], [25.17, 55.228], [25.155, 55.218], DROPOFF,
];

function LeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: [25.165, 55.238], zoom: 13, zoomControl: false, attributionControl: false });
    mapInstance.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);
    L.marker(PICKUP, { icon: pickupIcon }).addTo(map);
    L.marker(DROPOFF, { icon: dropoffIcon }).addTo(map);
    L.polyline(ROUTE, { color: "#040033", weight: 4, opacity: 0.8 }).addTo(map);
    map.fitBounds([PICKUP, DROPOFF], { padding: [60, 60] });
    return () => {
      try { map.remove(); } catch (_) {}
      mapInstance.current = null;
    };
  }, []);
  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setV(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return v;
}

/* ───────────────────────────────────────────────
   DRAGGABLE BOTTOM SHEET
   ───────────────────────────────────────────── */
const SNAP_COLLAPSED = 0.36;
const SNAP_MID = 0.55;
const SNAP_FULL = 0.92;
const SNAPS = [SNAP_COLLAPSED, SNAP_MID, SNAP_FULL];

function useBottomSheet() {
  const [snapFraction, setSnapFraction] = useState(SNAP_COLLAPSED);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);
  const currentH = useRef(0);
  const sheetEl = useRef<HTMLDivElement | null>(null);

  const expandTo = (snap: number) => {
    setSnapFraction(snap);
    if (sheetEl.current) {
      sheetEl.current.style.transition = "height 0.5s cubic-bezier(0.16,1,0.3,1)";
      sheetEl.current.style.height = `${snap * 100}dvh`;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    startH.current = snapFraction * window.innerHeight;
    currentH.current = startH.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !sheetEl.current) return;
    const delta = startY.current - e.clientY;
    const newH = Math.max(SNAP_COLLAPSED * window.innerHeight, Math.min(SNAP_FULL * window.innerHeight, startH.current + delta));
    currentH.current = newH;
    sheetEl.current.style.height = `${newH}px`;
    sheetEl.current.style.transition = "none";
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const fraction = currentH.current / window.innerHeight;
    let closest = SNAPS[0];
    let minDist = Math.abs(fraction - SNAPS[0]);
    for (const s of SNAPS) {
      const d = Math.abs(fraction - s);
      if (d < minDist) { minDist = d; closest = s; }
    }
    expandTo(closest);
  };

  return { snapFraction, sheetEl, onPointerDown, onPointerMove, onPointerUp, expandTo };
}

/* ── Shared step config ── */
const TOTAL_STEPS = 4;

const STEP_TITLES: { title: string; subtitle: string }[] = [
  { title: "Vehicle & Config", subtitle: "Select your truck type and cargo configuration." },
  { title: "Cargo Weight", subtitle: "Enter your cargo weight and delivery proof." },
  { title: "Pickup & Drop-off", subtitle: "Set your pickup and delivery locations." },
  { title: "Review Booking", subtitle: "Verify all details before confirming." },
];

/* ── Step Indicator ── */
function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-shrink-0">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i + 1 <= step ? "18px" : "6px",
              height: "6px",
              backgroundColor: i + 1 <= step ? "#1253FA" : "#D8D9D4",
              transition: "width 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease",
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, color: "#1253FA", fontSize: "11px", letterSpacing: "0.08em" }}>
        {step} / {TOTAL_STEPS}
      </span>
    </div>
  );
}

/* ── Back Button ── */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 mb-3 cursor-pointer active:opacity-70 transition-opacity flex-shrink-0"
    >
      <ArrowBackIosNewRounded sx={{ fontSize: 14, color: "#040033" }} />
      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>Back</span>
    </button>
  );
}

/* ── CTA Button ── */
function CTAButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed"
      style={{
        backgroundColor: disabled ? "#D8D9D4" : "#1253FA",
        boxShadow: disabled ? "none" : "0 4px 20px rgba(18,83,250,0.3)",
        padding: "16px",
        transition: "background-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease",
      }}
    >
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>
        {label}
      </span>
    </button>
  );
}

/* ── Top Bar ── */
function TopBar({ onBack }: { onBack?: () => void }) {
  if (!onBack) return null;
  return (
    <button
      onClick={onBack}
      className="fixed z-40 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
      style={{
        top: "max(env(safe-area-inset-top, 16px), 16px)",
        left: "16px",
        width: "44px",
        height: "44px",
        borderRadius: "16px",
        backgroundColor: "white",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        border: "none",
      }}
    >
      <ArrowBackIosNewRounded sx={{ fontSize: 18, color: "#040033" }} />
    </button>
  );
}

/* ── Location FAB ─ */
function LocationFAB({ bottomOffset }: { bottomOffset: string }) {
  return (
    <div className="absolute z-10" style={{ right: "16px", bottom: bottomOffset, transition: "bottom 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
      <button className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(0,0,0,0.1)" }}>
        <NavigationRounded sx={{ fontSize: 20, color: "#1253FA" }} />
      </button>
    </div>
  );
}

/* ── Animated Step Wrapper ── */
function StepTransition({ stepKey, children }: { stepKey: number; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setShouldRender(false);
    setVisible(false);
    // Brief unmount for content swap, then gentle fade-up
    const t1 = setTimeout(() => {
      setShouldRender(true);
    }, 60);
    const t2 = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stepKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        filter: visible ? "blur(0px)" : "blur(2px)",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease-out",
        willChange: "opacity, transform, filter",
      }}
    >
      {shouldRender && children}
    </div>
  );
}

/* ── Confirmation Overlay ── */
function ConfirmationOverlay({ onDone, offer }: { onDone: () => void; offer?: Offer | null }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t0 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    const t = setTimeout(onDone, 2400);
    return () => { cancelAnimationFrame(t0); clearTimeout(t); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
      style={{
        backgroundColor: entered ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0)",
        backdropFilter: entered ? "blur(20px)" : "blur(0px)",
        transition: "background-color 0.6s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.6s ease-out",
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "rgba(18,83,250,0.1)",
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.5)",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18L15 25L28 11" stroke="#1253FA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: entered ? 0 : 40,
              transition: "stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }}
          />
        </svg>
      </div>
      <h1 style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease 0.35s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s",
      }}>Booking Confirmed</h1>
      <p style={{
        fontFamily: "'Courier Prime', monospace", fontSize: "14px", color: "#6B7280",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease 0.5s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s",
      }}>
        {offer ? `${offer.driverName} is on the way · ${offer.etaMin} min` : "Your truck is being dispatched."}
      </p>
      <div className="px-5 py-2.5 rounded-2xl" style={{
        backgroundColor: "rgba(18,83,250,0.08)",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease 0.65s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.65s",
      }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#1253FA" }}>
          Order #FLT-{Math.floor(Math.random() * 9000 + 1000)}
        </span>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════��══════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
export function TruckSelectorMap({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1);
  const [prevStep, setPrevStep] = useState(1);
  const [selected, setSelected] = useState<string>("pickup");
  const [config, setConfig] = useState<string>("closed");
  const [weightKg, setWeightKg] = useState(0);
  const [schedule, setSchedule] = useState<{ mode: "now" | "schedule"; date?: Date; time?: string }>({ mode: "now" });
  const [proofOfDelivery, setProofOfDelivery] = useState(true);
  const [pickupLocations, setPickupLocations] = useState<AddedLocation[]>([]);
  const [dropoffStops, setDropoffStops] = useState<DropoffStop[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showBidding, setShowBidding] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState<Offer | null>(null);
  const [clientOffer, setClientOffer] = useState<number | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [bookingType, setBookingType] = useState<BookingTypeState>(INITIAL_BOOKING_STATE);
  const isMobile = useIsMobile();
  const { snapFraction, sheetEl, onPointerDown, onPointerMove, onPointerUp, expandTo } = useBottomSheet();

  const currentStep = STEP_TITLES[step - 1];

  const goTo = (s: number) => {
    setPrevStep(step);
    setStep(s);
    // auto-expand sheet when going to steps with more content
    if (isMobile && s >= 2 && snapFraction < SNAP_MID) {
      expandTo(SNAP_MID);
    }
  };

  const onCTA = () => {
    if (step < TOTAL_STEPS) {
      goTo(step + 1);
    } else {
      // Final step - open live bidding
      setShowBidding(true);
    }
  };

  const onBackClick = () => {
    if (step > 1) goTo(step - 1);
    else if (onBack) onBack();
  };

  const ctaLabel = step === TOTAL_STEPS ? "Confirm Booking" : "Continue";

  /* ── Step content renderer ── */
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* ── Booking Type Selector ── */}
            <BookingTypeSelector
              state={bookingType}
              onChange={(newState) => {
                setBookingType(newState);
                // Sync schedule state for on-demand mode
                if (newState.category === "on-demand") {
                  if (newState.onDemandMode === "now") {
                    setSchedule({ mode: "now" });
                  }
                }
              }}
              onOpenScheduleModal={() => {
                setBookingType({ ...bookingType, onDemandMode: "schedule" });
                setShowScheduleModal(true);
              }}
              scheduleSummary={
                schedule.mode === "schedule" && schedule.date
                  ? `${schedule.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${schedule.time}`
                  : null
              }
            />

            {/* ── Section divider ── */}
            <div className="flex items-center gap-3 my-4 flex-shrink-0">
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Vehicle</span>
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
            </div>

            {/* ── Truck Selection ── */}
            {isMobile ? (
              <div className="flex-shrink-0">
                <div
                  className="flex gap-[9px] py-3 overflow-x-auto"
                  style={{ scrollSnapType: "x mandatory", paddingBottom: "8px", WebkitOverflowScrolling: "touch" }}
                >
                  <VehicleCarouselSelectable selected={selected} onSelect={setSelected} />
                </div>
              </div>
            ) : (
              <div className="grid gap-[9px] py-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <VehicleCarouselSelectable selected={selected} onSelect={setSelected} />
              </div>
            )}

            {/* ── Section divider ── */}
            <div className="flex items-center gap-3 my-4 flex-shrink-0">
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Configuration</span>
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
            </div>

            {/* ── Truck Config ── */}
            <TruckConfigGrid selected={config} onSelect={setConfig} />
          </>
        );
      case 2:
        return (
          <>
            {/* ── Weight ── */}
            <WeightInput value={weightKg} onChange={setWeightKg} vehicleType={selected} />

            {/* ── POD Toggle ── */}
            <div className="flex items-center gap-3 my-5 flex-shrink-0">
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Delivery</span>
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
            </div>
            <div
              className="flex items-center gap-4 p-4 rounded-2xl active:bg-black/[0.02] cursor-pointer"
              style={{
                backgroundColor: "white",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => setProofOfDelivery(!proofOfDelivery)}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-2xl"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: proofOfDelivery ? "rgba(18,83,250,0.08)" : "#F0F0EE",
                  transition: "background-color 0.3s ease",
                }}
              >
                <CameraAltOutlined sx={{ fontSize: 22, color: proofOfDelivery ? "#1253FA" : "#9CA3AF" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>
                    Proof of Delivery
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg"
                    style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.08)", letterSpacing: "0.04em", textTransform: "uppercase" }}
                  >
                    Recommended
                  </span>
                </div>
                <p className="mt-0.5" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", lineHeight: "1.4" }}>
                  Require photo confirmation at drop‑off.
                </p>
              </div>
              <button
                role="switch"
                aria-checked={proofOfDelivery}
                onClick={(e) => { e.stopPropagation(); setProofOfDelivery(!proofOfDelivery); }}
                className="relative flex-shrink-0 cursor-pointer"
                style={{
                  width: "52px", height: "30px", borderRadius: "15px",
                  backgroundColor: proofOfDelivery ? "#1253FA" : "#D8D9D4",
                  transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1)",
                  border: "none", padding: 0, outline: "none",
                }}
              >
                <div style={{
                  position: "absolute", inset: "-3px", borderRadius: "18px",
                  boxShadow: proofOfDelivery ? "0 0 0 3px rgba(18,83,250,0.15)" : "none",
                  transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", top: "3px",
                  left: proofOfDelivery ? "25px" : "3px",
                  width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "white",
                  boxShadow: proofOfDelivery ? "0 2px 8px rgba(18,83,250,0.3)" : "0 1px 4px rgba(0,0,0,0.15)",
                  transition: "left 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s",
                }} />
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* ── Pickup ── */}
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 1.5px #040033" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pickup Locations</span>
            </div>
            <PickupStepInline value={pickupLocations} onChange={setPickupLocations} />

            {/* ── Section divider ── */}
            <div className="flex items-center gap-3 my-5 flex-shrink-0">
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Drop-off Stops</span>
              <div className="flex-1" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />
            </div>

            {/* ── Drop-off ── */}
            <DropoffStops value={dropoffStops} onChange={setDropoffStops} />
          </>
        );
      case 4:
        return (
          <ReviewStepInline
            truckId={selected}
            configId={config}
            weightKg={weightKg}
            schedule={schedule}
            deliverySettings={proofOfDelivery}
            dropoffStops={dropoffStops}
            pickupLocations={pickupLocations}
            clientOffer={clientOffer}
            onClientOfferChange={setClientOffer}
          />
        );
      default:
        return null;
    }
  };

  /* ── Header (steps 2+) with title/subtitle ── */
  const renderStepHeader = () => {
    if (step === 1) return null;
    return (
      <>
        <StepIndicator step={step} />
        <h2
          className="flex-shrink-0"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: isMobile ? "20px" : "26px",
            color: "#040033",
            lineHeight: "1.15",
            marginBottom: "4px",
          }}
        >
          {currentStep.title}
        </h2>
        <p
          className="flex-shrink-0"
          style={{
            fontFamily: "'Courier Prime', monospace",
            color: "#9CA3AF",
            fontSize: isMobile ? "12px" : "13px",
            marginBottom: "16px",
          }}
        >
          {currentStep.subtitle}
        </p>
      </>
    );
  };

  /* ═════════════ DESKTOP / TABLET ═════════════ */
  if (!isMobile) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: "100dvh", backgroundColor: "#F5F5F3" }}>
        <div className="absolute inset-0 z-0"><LeafletMap /></div>
        <TopBar onBack={onBack} />
        <LocationFAB bottomOffset="32px" />

        {/* Side panel */}
        <div
          className="absolute top-0 left-0 bottom-0 z-20 flex flex-col"
          style={{
            width: "min(420px, 35vw)", minWidth: "340px",
            backgroundColor: "rgba(245,245,243,0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            boxShadow: "4px 0 30px rgba(0,0,0,0.06)", padding: "24px",
            paddingTop: "max(env(safe-area-inset-top, 24px), 80px)",
          }}
        >
          {step > 1 && <BackButton onClick={onBackClick} />}

          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <StepTransition stepKey={step}>
              {renderStepHeader()}
              {step === 1 && (
                <>
                  <StepIndicator step={step} />
                  <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033", lineHeight: "1.15" }} className="flex-shrink-0">{currentStep.title}</h1>
                  <p className="mt-1 flex-shrink-0 mb-4" style={{ fontFamily: "'Courier Prime', monospace", color: "#9CA3AF", fontSize: "13px" }}>{currentStep.subtitle}</p>
                  <div className="flex-shrink-0" style={{ height: "1px", backgroundColor: "#E8E8E5", marginBottom: "12px" }} />
                </>
              )}
              {renderStepContent()}
            </StepTransition>
          </div>

          <div className="flex-shrink-0 pt-3 pb-2">
            <CTAButton label={ctaLabel} onClick={onCTA} />
          </div>
        </div>

        {showScheduleModal && (
          <ScheduleModal
            value={{ date: schedule.date, time: schedule.time }}
            onConfirm={({ date, time }) => {
              setSchedule({ mode: "schedule", date, time });
              setShowScheduleModal(false);
            }}
            onClose={() => setShowScheduleModal(false)}
          />
        )}

        {showBidding && (
          <BiddingScreen
            isMobile={isMobile}
            initialOffer={clientOffer ?? undefined}
            onCancel={() => setShowBidding(false)}
            onAccept={(offer) => {
              setAcceptedOffer(offer);
              setShowBidding(false);
              setShowConfirmation(true);
            }}
          />
        )}

        {showConfirmation && (
          <ConfirmationOverlay
            offer={acceptedOffer}
            onDone={() => { setShowConfirmation(false); setAcceptedOffer(null); goTo(1); }}
          />
        )}
      </div>
    );
  }

  /* ═════════════ MOBILE ═════════════ */
  const fabBottom = `calc(${snapFraction * 100}dvh + 16px)`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "100dvh", backgroundColor: "#F5F5F3" }}>
      <div className="absolute inset-0 z-0"><LeafletMap /></div>
      <TopBar onBack={onBack} />
      <LocationFAB bottomOffset={fabBottom} />

      {/* Bottom Sheet */}
      <div
        ref={sheetEl}
        className="absolute left-0 right-0 z-20"
        style={{
          bottom: 0,
          height: `${snapFraction * 100}dvh`,
          transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
          borderRadius: "24px 24px 0 0",
          backgroundColor: "rgba(245,245,243,0.95)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="w-9 h-1 rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
        </div>

        {/* Sheet body */}
        <div className="flex-1 flex flex-col px-4" style={{ minHeight: 0, overflow: "hidden" }}>
          {step > 1 && <BackButton onClick={onBackClick} />}

          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <StepTransition stepKey={step}>
              {renderStepHeader()}
              {renderStepContent()}
            </StepTransition>
            <div style={{ height: "8px" }} />
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          className="flex-shrink-0 px-4 pt-3"
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom, 20px), 20px)",
            borderTop: "1px solid rgba(232,232,229,0.6)",
            backgroundColor: "#F5F5F3",
          }}
        >
          <CTAButton label={ctaLabel} onClick={onCTA} />
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleModal
          value={{ date: schedule.date, time: schedule.time }}
          onConfirm={({ date, time }) => {
            setSchedule({ mode: "schedule", date, time });
            setShowScheduleModal(false);
          }}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

      {showBidding && (
        <BiddingScreen
          isMobile={isMobile}
          onCancel={() => setShowBidding(false)}
          onAccept={(offer) => {
            setAcceptedOffer(offer);
            setShowBidding(false);
            setShowConfirmation(true);
          }}
        />
      )}

      {showConfirmation && (
        <ConfirmationOverlay
          offer={acceptedOffer}
          onDone={() => { setShowConfirmation(false); setAcceptedOffer(null); goTo(1); }}
        />
      )}
    </div>
  );
}