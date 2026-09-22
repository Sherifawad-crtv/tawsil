import { useState } from "react";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import ReplayOutlined from "@mui/icons-material/ReplayOutlined";
import InboxOutlined from "@mui/icons-material/InboxOutlined";

type TabId = "active" | "completed" | "cancelled";

interface Trip {
  id: string;
  orderId: string;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicle: string;
  config: string;
  weight: string;
  price: string;
  status: "active" | "completed" | "cancelled";
  driver?: string;
  eta?: string;
  stops: number;
}

const TRIPS: Trip[] = [
  { id: "1", orderId: "FLT-4821", from: "Main Warehouse", to: "Dubai Silicon Oasis", date: "Apr 5, 2026", time: "10:30 AM", vehicle: "Trailer", config: "Flatbed", weight: "2,400 kg", price: "EGP 680", status: "active", driver: "Mohammed R.", eta: "24 min", stops: 2 },
  { id: "2", orderId: "FLT-4818", from: "Al Quoz Industrial 3", to: "Jebel Ali Free Zone", date: "Apr 3, 2026", time: "2:15 PM", vehicle: "Pickup", config: "Closed Box", weight: "850 kg", price: "EGP 285", status: "completed", stops: 1 },
  { id: "3", orderId: "FLT-4815", from: "Dubai Marina Office", to: "Business Bay", date: "Apr 2, 2026", time: "9:00 AM", vehicle: "Van", config: "Closed Box", weight: "320 kg", price: "EGP 145", status: "completed", stops: 1 },
  { id: "4", orderId: "FLT-4812", from: "DAFZA East Wing", to: "Al Quoz Industrial 1", date: "Apr 1, 2026", time: "4:45 PM", vehicle: "Trailer", config: "Open Bed", weight: "3,100 kg", price: "EGP 520", status: "cancelled", stops: 3 },
  { id: "5", orderId: "FLT-4808", from: "Jebel Ali FZ Gate 5", to: "Ras Al Khor Ind. 2", date: "Mar 30, 2026", time: "11:00 AM", vehicle: "Jumbo", config: "Refrigerated", weight: "5,200 kg", price: "EGP 1,240", status: "completed", stops: 4 },
  { id: "6", orderId: "FLT-4805", from: "Home Base", to: "DIP Warehouse B", date: "Mar 29, 2026", time: "8:30 AM", vehicle: "Pickup", config: "Open Bed", weight: "600 kg", price: "EGP 195", status: "completed", stops: 1 },
  { id: "7", orderId: "FLT-4801", from: "Business Bay Tower", to: "Al Barsha South", date: "Mar 28, 2026", time: "3:20 PM", vehicle: "Van", config: "Closed Box", weight: "280 kg", price: "EGP 130", status: "cancelled", stops: 1 },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function StatusBadge({ status }: { status: Trip["status"] }) {
  const styles: Record<Trip["status"], { color: string; bg: string; label: string }> = {
    active: { color: "#1253FA", bg: "rgba(18,83,250,0.08)", label: "In Transit" },
    completed: { color: "#059669", bg: "rgba(5,150,105,0.08)", label: "Completed" },
    cancelled: { color: "#6B7280", bg: "rgba(107,114,128,0.08)", label: "Cancelled" },
  };
  const s = styles[status];
  return (
    <span
      className="px-2.5 py-1 rounded-xl"
      style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: s.color,
        backgroundColor: s.bg,
      }}
    >
      {s.label}
    </span>
  );
}

function TripCard({ trip, onReorder }: { trip: Trip; onReorder: () => void }) {
  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="px-2.5 py-1 rounded-xl"
            style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "#040033", backgroundColor: "#F0F0EE" }}
          >
            {trip.orderId}
          </span>
          <StatusBadge status={trip.status} />
        </div>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>
          {trip.price}
        </span>
      </div>

      {/* Route */}
      <div className="px-5 pb-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-0.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 1.5px #040033" }} />
            <div className="flex-1 w-px my-1.5" style={{ backgroundColor: "#E8E8E5" }} />
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 1.5px #1253FA" }} />
          </div>
          <div className="flex-1 flex flex-col gap-2.5">
            <div>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{trip.from}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{trip.to}</p>
              {trip.stops > 1 && (
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
                  +{trip.stops - 1} stop{trip.stops > 2 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div
        className="flex items-center gap-3 px-5 py-3 flex-wrap"
        style={{ borderTop: "1px solid #F0F0EE" }}
      >
        <div className="flex items-center gap-1.5">
          <CalendarMonthOutlined sx={{ fontSize: 12, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{trip.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AccessTimeOutlined sx={{ fontSize: 12, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{trip.time}</span>
        </div>
        <span className="px-2 py-0.5 rounded-lg" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE", textTransform: "uppercase" }}>
          {trip.vehicle}
        </span>
        <span className="px-2 py-0.5 rounded-lg" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE" }}>
          {trip.weight}
        </span>
      </div>

      {/* Active trip: driver + ETA */}
      {trip.status === "active" && trip.driver && (
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #F0F0EE" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#040033" }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "9px", color: "white" }}>
                {trip.driver.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#040033" }}>{trip.driver}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1253FA", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#1253FA" }}>ETA {trip.eta}</span>
          </div>
        </div>
      )}

      {/* Reorder CTA for completed/cancelled */}
      {(trip.status === "completed" || trip.status === "cancelled") && (
        <div className="px-5 pb-4 pt-1">
          <button
            onClick={onReorder}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-transform"
            style={{
              backgroundColor: "#040033",
              border: "none",
            }}
          >
            <ReplayOutlined sx={{ fontSize: 14, color: "white" }} />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "white" }}>
              Reorder
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("active");

  const filtered = TRIPS.filter((t) => {
    if (activeTab === "active") return t.status === "active";
    if (activeTab === "completed") return t.status === "completed";
    return t.status === "cancelled";
  });

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)", paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 96px)" }}>

        {/* ── Header ── */}
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: "1.15", marginBottom: "4px" }}>
          Activity
        </h1>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
          Track and manage your shipments
        </p>

        {/* ── Tabs ── */}
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ backgroundColor: "#E8E8E5" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = TRIPS.filter((t) => {
              if (tab.id === "active") return t.status === "active";
              if (tab.id === "completed") return t.status === "completed";
              return t.status === "cancelled";
            }).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                style={{
                  backgroundColor: isActive ? "white" : "transparent",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  border: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "13px",
                    color: isActive ? "#040033" : "#6B7280",
                    transition: "color 0.3s",
                  }}
                >
                  {tab.label}
                </span>
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    color: isActive ? "#1253FA" : "#9CA3AF",
                    backgroundColor: isActive ? "rgba(18,83,250,0.08)" : "rgba(107,114,128,0.06)",
                    transition: "all 0.3s",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Trip List ── */}
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} onReorder={() => {}} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#F0F0EE" }}
              >
                <InboxOutlined sx={{ fontSize: 28, color: "#D8D9D4" }} />
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>No trips found</p>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                  {activeTab === "active" ? "You have no active deliveries right now." : `No ${activeTab} trips to show.`}
                </p>
              </div>
            </div>
          )}
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
