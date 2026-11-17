import { useState, useEffect, useRef } from "react";
import ArrowBackIosNewRounded from "./icons/ArrowBackIosNewRounded";
import StarRounded from "./icons/StarRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import VerifiedRounded from "./icons/VerifiedRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import CloseRounded from "./icons/CloseRounded";
import TrendingDownRounded from "./icons/TrendingDownRounded";
import GavelRounded from "./icons/GavelRounded";
import AddRounded from "./icons/AddRounded";
import RemoveRounded from "./icons/RemoveRounded";
import BoltRounded from "./icons/BoltRounded";
import ConfirmSheet from "./ConfirmSheet";
import GoogleMap, { type LatLng } from "./GoogleMap";
import { VEHICLES } from "./VehicleCarouselSelectable";

export type Offer = {
  id: string;
  driverName: string;
  initials: string;
  rating: number;
  trips: number;
  vehicle: string;
  etaMin: number;
  price: number;
  verified: boolean;
  yearsActive: number;
};

const SEED_OFFERS: Offer[] = [
  { id: "o1", driverName: "Rashid A.", initials: "RA", rating: 4.92, trips: 1284, vehicle: "10-Ton Closed", etaMin: 8, price: 320, verified: true, yearsActive: 6 },
  { id: "o2", driverName: "Mahmoud K.", initials: "MK", rating: 4.87, trips: 942, vehicle: "10-Ton Closed", etaMin: 12, price: 295, verified: true, yearsActive: 4 },
  { id: "o3", driverName: "Samir D.", initials: "SD", rating: 4.78, trips: 612, vehicle: "10-Ton Open", etaMin: 6, price: 340, verified: false, yearsActive: 3 },
  { id: "o4", driverName: "Tariq H.", initials: "TH", rating: 4.95, trips: 2103, vehicle: "10-Ton Closed", etaMin: 15, price: 280, verified: true, yearsActive: 8 },
  { id: "o5", driverName: "Yusuf O.", initials: "YO", rating: 4.81, trips: 478, vehicle: "10-Ton Refrigerated", etaMin: 10, price: 365, verified: true, yearsActive: 2 },
];

const RECOMMENDED_PRICE = 310;
const FARE_STEP = 10;
const FARE_MIN = 200;
const FARE_MAX = 500;

const cardStyle = { backgroundColor: "white", border: "1px solid #E8E8E5" } as const;

export default function BiddingScreen({
  onAccept,
  onCancel,
  initialOffer,
  vehicleId,
  start,
  end,
}: {
  onAccept: (offer: Offer) => void;
  onCancel: () => void;
  initialOffer?: number;
  /** The truck picked in the booking, shown at the top of the sheet. */
  vehicleId?: string;
  start: LatLng;
  end: LatLng;
}) {
  // Two phases, like a ride-hailing bid screen: set your fare first, then search and watch offers arrive.
  const [phase, setPhase] = useState<"setup" | "searching">("setup");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [yourOffer, setYourOffer] = useState<number>(initialOffer ?? RECOMMENDED_PRICE);
  const [autoAccept, setAutoAccept] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const idx = useRef(1);
  const vehicle = VEHICLES.find((v) => v.id === vehicleId) ?? VEHICLES[0];
  const searching = phase === "searching";

  useEffect(() => {
    if (!searching) return;
    idx.current = 1;
    setOffers([SEED_OFFERS[0]]);
    setElapsed(0);
    const t = setInterval(() => {
      if (idx.current < SEED_OFFERS.length) {
        const next = SEED_OFFERS[idx.current];
        idx.current += 1;
        setOffers((cur) => [...cur, next]);
        setPulseId(next.id);
        setTimeout(() => setPulseId(null), 700);
      }
    }, 1800);
    const clock = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(t);
      clearInterval(clock);
    };
  }, [searching]);

  // Auto-accept: book the first driver whose price is at or under your fare.
  useEffect(() => {
    if (!searching || !autoAccept) return;
    const hit = offers.find((o) => o.price <= yourOffer);
    if (!hit) return;
    const t = setTimeout(() => onAccept(hit), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, autoAccept, offers, yourOffer]);

  const sorted = [...offers].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0]?.price ?? RECOMMENDED_PRICE;
  const bump = (d: number) => setYourOffer((v) => Math.min(FARE_MAX, Math.max(FARE_MIN, v + d)));
  const handleBack = () => (searching ? setConfirmingCancel(true) : onCancel());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ backgroundColor: "#F5F5F3" }}>
      {/* Route map */}
      <div className="absolute inset-0">
        <GoogleMap start={start} end={end} padding={{ top: 110, right: 50, bottom: searching ? 470 : 400, left: 50 }} />
      </div>

      <button
        onClick={handleBack}
        aria-label="Back"
        className="absolute z-10 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        style={{ top: "max(env(safe-area-inset-top, 16px), 16px)", left: "16px", width: "44px", height: "44px", borderRadius: "16px", backgroundColor: "white", border: "none" }}
      >
        <ArrowBackIosNewRounded sx={{ fontSize: 18, color: "#040033" }} />
      </button>

      {/* Bottom sheet */}
      <div
        className="absolute left-0 right-0 bottom-0 z-20 flex flex-col"
        style={{
          height: searching ? "68dvh" : "auto",
          maxHeight: "85dvh",
          borderRadius: "24px 24px 0 0",
          backgroundColor: "#F5F5F3",
          transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
        </div>

        {!searching ? (
          <>
            <div className="px-4 flex flex-col gap-3">
              {/* Selected vehicle */}
              <div className="rounded-[22px] p-3 flex items-center gap-3" style={cardStyle}>
                <img src={vehicle.image} alt="" draggable={false} className="object-contain flex-shrink-0" style={{ width: "72px", height: "52px" }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "16px", color: "#040033" }}>{vehicle.name}</p>
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#626A76", marginTop: "2px" }}>
                    Nearest driver · {SEED_OFFERS[0].etaMin} min away
                  </p>
                </div>
              </div>

              {/* Fare stepper */}
              <div className="rounded-[22px] p-3 flex items-center gap-3" style={cardStyle}>
                <button
                  onClick={() => bump(-FARE_STEP)}
                  disabled={yourOffer <= FARE_MIN}
                  aria-label="Lower your fare"
                  className="flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-90 transition-transform disabled:opacity-40"
                  style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#F5F5F3", border: "none" }}
                >
                  <RemoveRounded sx={{ fontSize: 24, color: "#040033" }} />
                </button>
                <div className="flex-1 text-center">
                  <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: 1.1 }}>EGP {yourOffer}</p>
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: yourOffer === RECOMMENDED_PRICE ? "#626A76" : "#1253FA", marginTop: "2px" }}>
                    {yourOffer === RECOMMENDED_PRICE ? "Recommended fare" : `Recommended: EGP ${RECOMMENDED_PRICE}`}
                  </p>
                </div>
                <button
                  onClick={() => bump(FARE_STEP)}
                  disabled={yourOffer >= FARE_MAX}
                  aria-label="Raise your fare"
                  className="flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-90 transition-transform disabled:opacity-40"
                  style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#F5F5F3", border: "none" }}
                >
                  <AddRounded sx={{ fontSize: 24, color: "#040033" }} />
                </button>
              </div>

              {/* Auto-accept */}
              <div className="rounded-[22px] p-3 flex items-center gap-3" style={cardStyle}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
                  <BoltRounded sx={{ fontSize: 20, color: "#1253FA" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>Auto-accept offer of EGP {yourOffer}</p>
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", marginTop: "1px" }}>
                    Books the first driver at or under your fare
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={autoAccept}
                  aria-label="Auto-accept"
                  onClick={() => setAutoAccept((v) => !v)}
                  className="relative flex-shrink-0 cursor-pointer"
                  style={{ width: "48px", height: "28px", borderRadius: "14px", border: "none", backgroundColor: autoAccept ? "#1253FA" : "#D8D9D4", transition: "background-color 0.2s ease" }}
                >
                  <span
                    className="absolute rounded-full"
                    style={{ top: "3px", left: autoAccept ? "23px" : "3px", width: "22px", height: "22px", backgroundColor: "white", transition: "left 0.2s ease" }}
                  />
                </button>
              </div>
            </div>

            <div
              className="flex-shrink-0 px-4 pt-3 mt-3"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)", borderTop: "1px solid rgba(232,232,229,0.6)" }}
            >
              <button
                onClick={() => setPhase("searching")}
                className="w-full rounded-2xl flex items-center justify-center active:scale-[0.97] cursor-pointer"
                style={{ backgroundColor: "#1253FA", padding: "16px", border: "none", transition: "transform 0.2s ease" }}
              >
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>Find drivers</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Your offer */}
            <div className="px-4 flex-shrink-0">
              <div className="rounded-[22px] p-4" style={cardStyle}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Your Offer
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1253FA", animation: "pulse 1.4s ease-in-out infinite" }} />
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", letterSpacing: "0.08em" }}>
                        LIVE {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
                      </span>
                    </div>
                    <button
                      onClick={() => setCounterOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer active:opacity-70"
                      style={{ backgroundColor: "#F5F5F3", border: "none" }}
                    >
                      <GavelRounded sx={{ fontSize: 12, color: "#040033" }} />
                      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: "#040033" }}>Adjust</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: 1 }}>EGP {yourOffer}</span>
                  {cheapest < yourOffer && (
                    <div className="flex items-center gap-0.5">
                      <TrendingDownRounded sx={{ fontSize: 14, color: "#1253FA" }} />
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#1253FA" }}>-{yourOffer - cheapest}</span>
                    </div>
                  )}
                </div>
                <p className="mt-1" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76" }}>
                  {offers.length} driver{offers.length !== 1 ? "s" : ""} responding · Avg EGP {Math.round(offers.reduce((s, o) => s + o.price, 0) / Math.max(1, offers.length))}
                  {autoAccept ? " · Auto-accept on" : ""}
                </p>
              </div>
            </div>

            {/* Offers header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#040033" }}>Offers Coming In</span>
              <span
                className="px-2 py-1 rounded-lg"
                style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.08)", letterSpacing: "0.08em" }}
              >
                {offers.length} ACTIVE
              </span>
            </div>

            {/* Offers list */}
            <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ minHeight: 0 }}>
              <div className="flex flex-col gap-2.5">
                {sorted.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} isCheapest={offer.price === cheapest && i === 0} isNew={pulseId === offer.id} onAccept={() => onAccept(offer)} />
                ))}
              </div>

              {offers.length < SEED_OFFERS.length && (
                <div className="mt-2.5 rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: "white", border: "1px dashed #D8D9D4" }}>
                  <div className="w-11 h-11 rounded-full" style={{ backgroundColor: "#F0F0EE", animation: "shimmer 1.5s ease-in-out infinite" }} />
                  <div className="flex-1">
                    <div className="h-3 rounded mb-2" style={{ width: "55%", backgroundColor: "#F0F0EE", animation: "shimmer 1.5s ease-in-out infinite" }} />
                    <div className="h-2.5 rounded" style={{ width: "35%", backgroundColor: "#F0F0EE", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
                  </div>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76", letterSpacing: "0.08em" }}>SEARCHING…</span>
                </div>
              )}
            </div>

            {/* Cancel bar */}
            <div
              className="flex-shrink-0 px-4 pt-3"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)", borderTop: "1px solid rgba(232,232,229,0.6)", backgroundColor: "#F5F5F3" }}
            >
              <button
                onClick={() => setConfirmingCancel(true)}
                className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer"
                style={{ backgroundColor: "white", border: "1px solid #E8E8E5", padding: "14px", transition: "transform 0.2s ease" }}
              >
                <CloseRounded sx={{ fontSize: 16, color: "#DC2626" }} />
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#DC2626", letterSpacing: "0.02em" }}>Cancel Bidding</span>
              </button>
            </div>
          </>
        )}
      </div>

      {confirmingCancel && (
        <ConfirmSheet
          title="Cancel bidding?"
          body="Drivers' offers so far will be discarded and you'll go back to your booking."
          confirmLabel="Cancel Bidding"
          cancelLabel="Keep Bidding"
          onConfirm={onCancel}
          onCancel={() => setConfirmingCancel(false)}
        />
      )}

      {counterOpen && (
        <CounterOfferModal
          current={yourOffer}
          recommended={RECOMMENDED_PRICE}
          onClose={() => setCounterOpen(false)}
          onConfirm={(v) => {
            setYourOffer(v);
            setCounterOpen(false);
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flashBorder {
          0% { box-shadow: 0 0 0 0 rgba(18,83,250,0.5), 0 2px 12px rgba(0,0,0,0.04); }
          100% { box-shadow: 0 0 0 8px rgba(18,83,250,0), 0 2px 12px rgba(0,0,0,0.04); }
        }
      `}</style>
    </div>
  );
}

function OfferCard({
  offer,
  isCheapest,
  isNew,
  onAccept,
}: {
  offer: Offer;
  isCheapest: boolean;
  isNew: boolean;
  onAccept: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: "white",
        border: isCheapest ? "1.5px solid #1253FA" : "1px solid #E8E8E5",
        boxShadow: isCheapest ? "0 4px 20px rgba(18,83,250,0.12)" : "none",
        animation: isNew ? "slideIn 0.5s cubic-bezier(0.16,1,0.3,1), flashBorder 1s ease-out" : "slideIn 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            backgroundColor: "#040033",
            position: "relative",
          }}
        >
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.04em" }}>
            {offer.initials}
          </span>
          {offer.verified && (
            <div
              className="absolute flex items-center justify-center"
              style={{
                bottom: "-2px",
                right: "-2px",
                width: "18px",
                height: "18px",
                borderRadius: "9px",
                backgroundColor: "#1253FA",
                border: "2px solid white",
              }}
            >
              <VerifiedRounded sx={{ fontSize: 10, color: "white" }} />
            </div>
          )}
        </div>

        {/* Driver info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>
              {offer.driverName}
            </span>
            {isCheapest && (
              <span
                className="px-1.5 py-0.5 rounded-md"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "9px",
                  color: "white",
                  backgroundColor: "#1253FA",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Best
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-0.5">
              <StarRounded sx={{ fontSize: 13, color: "#040033" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#040033", fontWeight: 600 }}>
                {offer.rating}
              </span>
            </div>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76" }}>
              · {offer.trips.toLocaleString()} trips · {offer.yearsActive}y
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <LocalShippingRounded sx={{ fontSize: 13, color: "#6B7280" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>
                {offer.vehicle}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <AccessTimeRounded sx={{ fontSize: 13, color: "#6B7280" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>
                {offer.etaMin} min
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#626A76", letterSpacing: "0.1em" }}>
            EGP
          </span>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "#040033", lineHeight: 1 }}>
            {offer.price}
          </span>
        </div>
      </div>

      {/* Accept button */}
      <button
        onClick={onAccept}
        className="w-full mt-3 rounded-xl flex items-center justify-center active:scale-[0.97] cursor-pointer"
        style={{
          backgroundColor: isCheapest ? "#1253FA" : "#040033",
          padding: "11px",
          transition: "transform 0.2s ease",
        }}
      >
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "white", letterSpacing: "0.04em" }}>
          ACCEPT · EGP {offer.price}
        </span>
      </button>
    </div>
  );
}

function CounterOfferModal({
  current,
  recommended,
  onClose,
  onConfirm,
}: {
  current: number;
  recommended: number;
  onClose: () => void;
  onConfirm: (v: number) => void;
}) {
  const [val, setVal] = useState(current);
  const min = 200;
  const max = 500;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ backgroundColor: "rgba(4,0,51,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl p-6"
        style={{
          backgroundColor: "#F5F5F3",
          animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "#040033" }}>
            Adjust Your Offer
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer active:opacity-70"
            style={{ width: "32px", height: "32px", borderRadius: "12px", backgroundColor: "white", border: "none" }}
          >
            <CloseRounded sx={{ fontSize: 16, color: "#040033" }} />
          </button>
        </div>

        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: "white" }}>
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#626A76" }}>EGP</span>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "44px", color: "#040033", lineHeight: 1 }}>
              {val}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={5}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "#1253FA" }}
          />
          <div className="flex justify-between mt-1">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>
              EGP {min}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA" }}>
              Recommended: EGP {recommended}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>
              EGP {max}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {[-20, -10, +10, +20].map((d) => (
            <button
              key={d}
              onClick={() => setVal(Math.min(max, Math.max(min, val + d)))}
              className="flex-1 rounded-xl active:scale-95 cursor-pointer"
              style={{
                backgroundColor: "white",
                border: "1px solid #E8E8E5",
                padding: "10px",
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                color: "#040033",
                transition: "transform 0.15s ease",
              }}
            >
              {d > 0 ? `+${d}` : d}
            </button>
          ))}
        </div>

        <button
          onClick={() => onConfirm(val)}
          className="w-full rounded-2xl active:scale-[0.97] cursor-pointer"
          style={{
            backgroundColor: "#1253FA",
            padding: "16px",
            transition: "transform 0.2s ease",
            border: "none",
          }}
        >
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>
            Update Offer
          </span>
        </button>
      </div>
    </div>
  );
}
