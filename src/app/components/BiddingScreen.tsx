import { useState, useEffect, useRef } from "react";
import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import TrendingDownRounded from "@mui/icons-material/TrendingDownRounded";
import GavelRounded from "@mui/icons-material/GavelRounded";

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

export default function BiddingScreen({
  onAccept,
  onCancel,
  isMobile,
  initialOffer,
}: {
  onAccept: (offer: Offer) => void;
  onCancel: () => void;
  isMobile: boolean;
  initialOffer?: number;
}) {
  const [offers, setOffers] = useState<Offer[]>([SEED_OFFERS[0]]);
  const [yourOffer, setYourOffer] = useState<number>(initialOffer ?? RECOMMENDED_PRICE);
  const [counterOpen, setCounterOpen] = useState(false);
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const idx = useRef(1);

  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current < SEED_OFFERS.length) {
        const next = SEED_OFFERS[idx.current];
        idx.current += 1;
        setOffers((cur) => [...cur, next]);
        setPulseId(next.id);
        setTimeout(() => setPulseId(null), 700);
      }
    }, 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const sorted = [...offers].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0]?.price ?? RECOMMENDED_PRICE;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "#F5F5F3" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 16px), 16px)",
          paddingBottom: "12px",
          backgroundColor: "#040033",
        }}
      >
        <button
          onClick={onCancel}
          className="flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
          style={{ width: "40px", height: "40px", borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.08)", border: "none" }}
        >
          <ArrowBackIosNewRounded sx={{ fontSize: 16, color: "white" }} />
        </button>
        <div className="flex flex-col items-center">
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "white", letterSpacing: "0.04em" }}>
            LIVE BIDDING
          </span>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em" }}>
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")} elapsed
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(18,83,250,0.18)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1253FA", boxShadow: "0 0 8px #1253FA", animation: "pulse 1.4s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", letterSpacing: "0.08em" }}>LIVE</span>
        </div>
      </div>

      {/* Your offer summary */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ backgroundColor: "#040033" }}>
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(18,83,250,0.18), rgba(10,0,112,0.4))",
            border: "1px solid rgba(18,83,250,0.35)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Your Offer
            </span>
            <button
              onClick={() => setCounterOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg cursor-pointer active:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <GavelRounded sx={{ fontSize: 12, color: "white" }} />
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: "white" }}>Adjust</span>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "32px", color: "white", lineHeight: 1 }}>
              EGP {yourOffer}
            </span>
            {cheapest < yourOffer && (
              <div className="flex items-center gap-0.5">
                <TrendingDownRounded sx={{ fontSize: 14, color: "#1253FA" }} />
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#1253FA" }}>
                  -{yourOffer - cheapest}
                </span>
              </div>
            )}
          </div>
          <p className="mt-1.5" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
            {offers.length} driver{offers.length !== 1 ? "s" : ""} responding · Avg EGP {Math.round(offers.reduce((s, o) => s + o.price, 0) / offers.length)}
          </p>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: isMobile ? "16px" : "18px", color: "#040033" }}>
          Offers Coming In
        </span>
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
            <OfferCard
              key={offer.id}
              offer={offer}
              isCheapest={offer.price === cheapest && i === 0}
              isNew={pulseId === offer.id}
              onAccept={() => onAccept(offer)}
            />
          ))}
        </div>

        {/* Skeleton loader for incoming */}
        {offers.length < SEED_OFFERS.length && (
          <div
            className="mt-2.5 rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: "white", border: "1px dashed #D8D9D4" }}
          >
            <div className="w-11 h-11 rounded-full" style={{ backgroundColor: "#F0F0EE", animation: "shimmer 1.5s ease-in-out infinite" }} />
            <div className="flex-1">
              <div className="h-3 rounded mb-2" style={{ width: "55%", backgroundColor: "#F0F0EE", animation: "shimmer 1.5s ease-in-out infinite" }} />
              <div className="h-2.5 rounded" style={{ width: "35%", backgroundColor: "#F0F0EE", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
            </div>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.08em" }}>
              SEARCHING…
            </span>
          </div>
        )}
      </div>

      {/* Cancel bar */}
      <div
        className="flex-shrink-0 px-4 pt-3"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)",
          borderTop: "1px solid rgba(232,232,229,0.6)",
          backgroundColor: "#F5F5F3",
        }}
      >
        <button
          onClick={onCancel}
          className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer"
          style={{
            backgroundColor: "white",
            border: "1px solid #E8E8E5",
            padding: "14px",
            transition: "transform 0.2s ease",
          }}
        >
          <CloseRounded sx={{ fontSize: 16, color: "#DC2626" }} />
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#DC2626", letterSpacing: "0.02em" }}>
            Cancel Bidding
          </span>
        </button>
      </div>

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
        boxShadow: isCheapest ? "0 4px 20px rgba(18,83,250,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
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
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
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
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#9CA3AF", letterSpacing: "0.1em" }}>
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
          boxShadow: isCheapest ? "0 4px 16px rgba(18,83,250,0.25)" : "none",
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
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(4,0,51,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6"
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
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF" }}>EGP</span>
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
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
              EGP {min}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA" }}>
              Recommended: EGP {recommended}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
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
            boxShadow: "0 4px 20px rgba(18,83,250,0.3)",
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
