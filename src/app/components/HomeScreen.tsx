import { useState, useEffect } from "react";
import { VEHICLES } from "./VehicleCarouselSelectable";
import AddRounded from "@mui/icons-material/AddRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
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
  onStartBooking: () => void;
  onViewActivity: () => void;
  onOpenOrder?: () => void;
}

export default function HomeScreen({ onStartBooking, onViewActivity, onOpenOrder }: HomeScreenProps) {
  const { user } = useAuth();
  const [hasActiveTrip] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

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
      <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(calc(env(safe-area-inset-top, 16px) + 60px), 76px)", paddingBottom: "32px" }}>

        {/* ── Greeting ── */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: "1.15" }}>
            {greeting}{greetName ? `, ${greetName}` : ""}
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF", marginTop: "6px" }}>
            What would you like to ship today?
          </p>
        </div>

        {/* ── Quick Book CTA ── */}
        <button
          onClick={onStartBooking}
          className="w-full rounded-[22px] p-5 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform mb-6"
          style={{
            background: "linear-gradient(135deg, #040033 0%, #0A0070 50%, #1253FA 100%)",
            boxShadow: "0 8px 32px rgba(18,83,250,0.25)",
            border: "none",
            textAlign: "left",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <AddRounded sx={{ fontSize: 26, color: "white" }} />
          </div>
          <div className="flex-1">
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "white" }}>
              Book a Truck
            </span>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
              Start a new delivery booking
            </p>
          </div>
          <ChevronRightRounded sx={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }} />
        </button>

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
              style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "none" }}
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
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>Pickup</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{ACTIVE_TRIP.to}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>Drop-off</p>
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
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>In Transit</span>
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
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>Driver assigned</p>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Call ${ACTIVE_TRIP.driver}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                  style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
                >
                  <PhoneOutlined sx={{ fontSize: 16, color: "#1253FA" }} />
                </span>
              </div>
            </button>
          </>
        )}

        {/* ── Quick Actions - Vehicle Cards ── */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
              onClick={onStartBooking}
              className="flex-shrink-0 rounded-[18px] overflow-hidden cursor-pointer active:scale-[0.96] transition-transform"
              style={{
                width: "130px",
                backgroundColor: "white",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
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
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
              style={{ backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
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
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>{trip.date}</span>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>•</span>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>{trip.vehicle}</span>
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