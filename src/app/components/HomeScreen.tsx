import { useState, useEffect } from "react";
import { VEHICLES } from "./VehicleCarouselSelectable";
import SearchRounded from "./icons/SearchRounded";
import onDemandArt from "../../assets/tab-ondemand.webp";
import rentalArt from "../../assets/tab-rental.webp";
import CalendarMonthRounded from "./icons/CalendarMonthRounded";
import type { BookingPreset } from "./TruckSelectorMap";
import ChevronRightRounded from "./icons/ChevronRightRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import PhoneRounded from "./icons/PhoneRounded";
import CheckRounded from "./icons/CheckRounded";
import CloseRounded from "./icons/CloseRounded";
import { useAuth } from "../lib/AuthContext";
import { displayName } from "../lib/authTypes";

/* ── Mock Data ── */
const RECENT_TRIPS = [
  { id: "t1", from: "Al Quoz Industrial 3", to: "Jebel Ali Free Zone", date: "Apr 3, 2026", status: "completed" as const, vehicle: "Pickup", price: "EGP 285" },
  { id: "t2", from: "Dubai Marina Office", to: "Business Bay", date: "Apr 2, 2026", status: "completed" as const, vehicle: "Van", price: "EGP 145" },
  { id: "t3", from: "DAFZA East Wing", to: "Al Quoz Industrial 1", date: "Apr 1, 2026", status: "cancelled" as const, vehicle: "Trailer", price: "EGP 520" },
];

const ACTIVE_TRIP = {
  id: "at1",
  from: "Main Warehouse",
  to: "Dubai Silicon Oasis",
  vehicle: "Trailer",
  driver: "Mohammed R.",
  eta: "24 min",
  progress: 0.62,
  orderId: "FLT-4821",
};

interface HomeScreenProps {
  onStartBooking: (preset?: BookingPreset) => void;
  onViewActivity: () => void;
  onOpenOrder?: () => void;
}

export default function HomeScreen({ onStartBooking, onViewActivity, onOpenOrder }: HomeScreenProps) {
  const { user } = useAuth();
  const [hasActiveTrip] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");
  // Home is always the on-demand entry; the Rental tab opens the rental scheduling in the booking flow.
  const category = "on-demand" as const;

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // A business's name doesn't read naturally in "Good morning, X" - only
  // greet by name for individuals, first name only.
  const greetName = user?.type === "individual" ? displayName(user).split(" ")[0] : undefined;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)", paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 96px)" }}>

        {/* ── Greeting ── */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: "1.15" }}>
            {greeting}{greetName ? `, ${greetName}` : ""}
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#626A76", marginTop: "6px" }}>
            What would you like to ship today?
          </p>
        </div>

        {/* ── Booking: type tabs and a "where to" bar with scheduling inside it ── */}
        <div className="mb-6">
          <div className="flex" style={{ borderBottom: "1px solid #E8E8E5" }} role="tablist" aria-label="Booking type">
            {([
              { id: "on-demand" as const, label: "On-Demand", art: onDemandArt },
              { id: "rental" as const, label: "Rental", art: rentalArt },
            ]).map(({ id, label, art }) => {
              const active = id === "on-demand";
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => (id === "rental" ? onStartBooking({ category: "rental" }) : undefined)}
                  className="flex-1 flex items-center justify-center gap-2 pt-1 pb-3 cursor-pointer relative"
                  style={{ border: "none", background: "none" }}
                >
                  <img src={art} alt="" draggable={false} width={20} height={20} style={{ width: 20, height: 20, objectFit: "contain", mixBlendMode: "multiply" }} />
                  <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: active ? 700 : 500, fontSize: "15px", color: active ? "#040033" : "#8A919C" }}>
                    {label}
                  </span>
                  {active && <span className="absolute left-6 right-6 bottom-[-1px] rounded-t-full" style={{ height: "3px", backgroundColor: "#040033" }} />}
                </button>
              );
            })}
          </div>

          <div
            className="mt-4 flex items-center rounded-full"
            style={{ backgroundColor: "white", border: "1.5px solid #E8E8E5", height: "56px", padding: "0 8px 0 0" }}
          >
            <button
              onClick={() => onStartBooking({ category })}
              className="flex-1 flex items-center gap-3 h-full cursor-pointer active:opacity-70 transition-opacity text-left"
              style={{ border: "none", background: "none", paddingLeft: "18px" }}
            >
              <SearchRounded sx={{ fontSize: 22, color: "#040033" }} />
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "17px", color: "#626A76" }}>Where to?</span>
            </button>
            <button
              onClick={() => onStartBooking({ category, openSchedule: true })}
              className="flex items-center gap-1.5 rounded-full cursor-pointer active:scale-95 transition-transform"
              style={{ backgroundColor: "#F5F5F3", border: "none", height: "40px", padding: "0 14px" }}
            >
              <CalendarMonthRounded sx={{ fontSize: 17, color: "#040033" }} />
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
                Later
              </span>
            </button>
          </div>
        </div>

        {/* ── Active Trip (conditional) ── */}
        {hasActiveTrip && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1253FA", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#1253FA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Active Trip
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenOrder}
              aria-label={`Open order ${ACTIVE_TRIP.orderId}`}
              className="w-full text-left rounded-[22px] p-5 mb-6 cursor-pointer active:scale-[0.99] transition-transform"
              style={{ backgroundColor: "white", border: "none" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-xl"
                    style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.08)" }}
                  >
                    {ACTIVE_TRIP.orderId}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-xl"
                    style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280", backgroundColor: "#F0F0EE", textTransform: "uppercase", letterSpacing: "0.04em" }}
                  >
                    {ACTIVE_TRIP.vehicle}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AccessTimeRounded sx={{ fontSize: 14, color: "#1253FA" }} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#040033" }}>
                    {ACTIVE_TRIP.eta}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="flex gap-3 mb-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 1.5px #040033" }} />
                  <div className="flex-1 w-0.5 my-1" style={{ backgroundColor: "#E8E8E5" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 1.5px #1253FA" }} />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{ACTIVE_TRIP.from}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>Pickup</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{ACTIVE_TRIP.to}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>Drop-off</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F0EE" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${ACTIVE_TRIP.progress * 100}%`,
                      background: "linear-gradient(90deg, #040033, #1253FA)",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>In Transit</span>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA" }}>{Math.round(ACTIVE_TRIP.progress * 100)}%</span>
                </div>
              </div>

              {/* Driver */}
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
                  <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11px", color: "white" }}>MR</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#040033" }}>{ACTIVE_TRIP.driver}</p>
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>Driver assigned</p>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Call ${ACTIVE_TRIP.driver}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                  style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
                >
                  <PhoneRounded sx={{ fontSize: 16, color: "#1253FA" }} />
                </span>
              </div>
            </button>
          </>
        )}

        {/* ── Quick Actions - Vehicle Cards ── */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Quick Select Vehicle
          </span>
        </div>
        <div
          className="flex gap-3 pb-2 mb-6 overflow-x-auto"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {VEHICLES.map((v) => (
            <button
              key={v.id}
              onClick={() => onStartBooking({ category, vehicle: v.id })}
              className="flex-shrink-0 rounded-[18px] overflow-hidden cursor-pointer active:scale-[0.96] transition-transform"
              style={{
                width: "130px",
                backgroundColor: "white",
                border: "none",
                scrollSnapAlign: "start",
                textAlign: "center",
              }}
            >
              <div className="w-full h-[80px] flex items-center justify-center" style={{ backgroundColor: "#F8F8F6" }}>
                <img src={v.image} alt={v.name} className="h-[52px] object-contain" />
              </div>
              <div className="px-3 py-2.5">
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{v.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Recent Trips ── */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Recent Trips
          </span>
          <button
            onClick={onViewActivity}
            className="cursor-pointer active:opacity-70 transition-opacity"
            style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#1253FA", border: "none", background: "none" }}
          >
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {RECENT_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="rounded-[18px] p-4 flex items-center gap-3.5"
              style={{ backgroundColor: "white" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: trip.status === "completed" ? "rgba(18,83,250,0.06)" : "rgba(107,114,128,0.06)" }}
              >
                {trip.status === "completed" ? (
                  <CheckRounded sx={{ fontSize: 18, color: "#1253FA" }} />
                ) : (
                  <CloseRounded sx={{ fontSize: 18, color: "#6B7280" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
                  {trip.from} → {trip.to}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>{trip.date}</span>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>•</span>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>{trip.vehicle}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033" }}>{trip.price}</span>
                <span
                  className="px-2 py-0.5 rounded-lg"
                  style={{
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: trip.status === "completed" ? "#1253FA" : "#6B7280",
                    backgroundColor: trip.status === "completed" ? "rgba(18,83,250,0.06)" : "rgba(107,114,128,0.06)",
                  }}
                >
                  {trip.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}