import { useEffect, useRef, useState, type ReactNode } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ArrowBackIosNewRounded from "./icons/ArrowBackIosNewRounded";
import ReceiptLongRounded from "./icons/ReceiptLongRounded";
import ReplayRounded from "./icons/ReplayRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import RouteRounded from "./icons/RouteRounded";
import PersonRounded from "./icons/PersonRounded";
import { VEHICLES } from "./VehicleCarouselSelectable";
import { useStatusBar } from "../lib/statusBar";
import type { Trip } from "./ActivityScreen";

const MONO = "'Courier Prime', monospace";

/** Approximate positions of the demo places, for the route map. */
const PLACES: Record<string, [number, number]> = {
  "Main Warehouse": [25.095, 55.155],
  "Dubai Silicon Oasis": [25.1213, 55.379],
  "Al Quoz Industrial 3": [25.126, 55.23],
  "Al Quoz Industrial 1": [25.137, 55.243],
  "Jebel Ali Free Zone": [25.0046, 55.076],
  "Jebel Ali FZ Gate 5": [24.989, 55.056],
  "Dubai Marina Office": [25.0805, 55.1403],
  "Business Bay": [25.185, 55.262],
  "Business Bay Tower": [25.186, 55.268],
  "DAFZA East Wing": [25.253, 55.368],
  "Ras Al Khor Ind. 2": [25.183, 55.343],
  "Home Base": [25.2048, 55.2708],
  "DIP Warehouse B": [24.984, 55.183],
  "Al Barsha South": [25.087, 55.23],
};

const STATUS: Record<Trip["status"], { color: string; bg: string; label: string }> = {
  active: { color: "#1253FA", bg: "rgba(18,83,250,0.08)", label: "In Transit" },
  completed: { color: "#059669", bg: "rgba(5,150,105,0.08)", label: "Completed" },
  cancelled: { color: "#6B7280", bg: "rgba(107,114,128,0.08)", label: "Cancelled" },
};

function RouteMap({ from, to }: { from: [number, number]; to: [number, number] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, { zoomControl: false, attributionControl: false, scrollWheelZoom: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);
    L.polyline([from, to], { color: "#1253FA", weight: 4, opacity: 0.9, dashArray: "1, 8", lineCap: "round" }).addTo(map);
    L.circleMarker(from, { radius: 8, color: "#FFFFFF", weight: 3, fillColor: "#040033", fillOpacity: 1 }).addTo(map);
    L.circleMarker(to, { radius: 8, color: "#FFFFFF", weight: 3, fillColor: "#1253FA", fillOpacity: 1 }).addTo(map);
    map.fitBounds([from, to], { padding: [44, 44] });
    return () => {
      map.remove();
    };
  }, [from, to]);
  return <div ref={ref} style={{ width: "100%", height: "100%", background: "#F0F0EE" }} />;
}

function Card({ title, icon, right, children }: { title?: string; icon?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-4">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
              {icon}
            </div>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033", letterSpacing: "0.02em" }}>{title}</span>
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#6B7280" }}>{label}</span>
      <span className="text-right" style={{ fontFamily: strong ? "'Archivo Black', sans-serif" : "'Archivo', sans-serif", fontWeight: 600, fontSize: strong ? "15px" : "13px", color: "#040033" }}>
        {value}
      </span>
    </div>
  );
}

/**
 * The full record of one trip: route map, headline with the price and a
 * receipt, the stops, the truck used, the driver, and a reorder button.
 */
export default function TripDetailsScreen({ trip, onClose, onReorder }: { trip: Trip; onClose: () => void; onReorder: () => void }) {
  useStatusBar();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const status = STATUS[trip.status];
  const vehicle = VEHICLES.find((v) => v.name === trip.vehicle);
  const from = PLACES[trip.from];
  const to = PLACES[trip.to];
  const between = Math.max(0, trip.stops - 1);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" style={{ backgroundColor: "#F5F5F3" }}>
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 16px), 16px)",
          paddingBottom: "12px",
          backgroundColor: "rgba(245,245,243,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(232,232,229,0.6)",
        }}
      >
        <button onClick={onClose} aria-label="Back" className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "white", border: "none" }}>
          <ArrowBackIosNewRounded sx={{ fontSize: 16, color: "#040033" }} />
        </button>
        <div className="flex flex-col items-center">
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>Trip details</span>
          <span style={{ fontFamily: MONO, fontSize: "10px", color: "#6B7280", letterSpacing: "0.04em" }}>{trip.orderId}</span>
        </div>
        <div className="w-10" />
      </div>

      {from && to && (
        <div style={{ height: "220px" }}>
          <RouteMap from={from} to={to} />
        </div>
      )}

      <div className="w-full max-w-lg mx-auto px-4 pt-4 flex flex-col gap-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 24px) + 32px)" }}>
        {/* Headline */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "24px", lineHeight: 1.15, color: "#040033" }}>{trip.vehicle} trip</h1>
              <p style={{ fontFamily: MONO, fontSize: "12px", color: "#626A76", marginTop: "6px" }}>
                {trip.date} · {trip.time}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl flex-shrink-0" style={{ fontFamily: MONO, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: status.color, backgroundColor: status.bg }}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "#040033" }}>{trip.price}</p>
              <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>
                {trip.config} · {trip.weight}
              </p>
            </div>
            <button
              onClick={() => setReceiptOpen(true)}
              className="flex items-center gap-2 rounded-full px-4 h-11 cursor-pointer active:scale-95 transition-transform"
              style={{ backgroundColor: "#F5F5F3", border: "none" }}
            >
              <ReceiptLongRounded sx={{ fontSize: 18, color: "#040033" }} />
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>Receipt</span>
            </button>
          </div>
        </Card>

        {/* Route */}
        <Card title="Route" icon={<RouteRounded sx={{ fontSize: 16, color: "#1253FA" }} />} right={<span style={{ fontFamily: MONO, fontSize: "10px", color: "#6B7280", letterSpacing: "0.06em" }}>{trip.stops} {trip.stops === 1 ? "STOP" : "STOPS"}</span>}>
          <div className="flex flex-col">
            <div className="flex gap-4">
              <div className="flex flex-col items-center" style={{ width: "16px" }}>
                <div style={{ marginTop: "3px", width: "14px", height: "14px", borderRadius: "999px", backgroundColor: "#040033" }} />
                <div className="flex-1 w-0.5 my-1" style={{ backgroundColor: "#E8E8E5" }} />
              </div>
              <div className="flex-1 min-w-0 pb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pickup</p>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{trip.from}</p>
                </div>
                <span style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>{trip.time}</span>
              </div>
            </div>
            {between > 0 && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center" style={{ width: "16px" }}>
                  <div style={{ marginTop: "3px", width: "14px", height: "14px", borderRadius: "999px", backgroundColor: "white", border: "3px solid #1253FA" }} />
                  <div className="flex-1 w-0.5 my-1" style={{ backgroundColor: "#E8E8E5" }} />
                </div>
                <div className="pb-4">
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#626A76" }}>
                    {between} stop{between > 1 ? "s" : ""} in between
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <div className="flex flex-col items-center" style={{ width: "16px" }}>
                <div style={{ marginTop: "3px", width: "14px", height: "14px", borderRadius: "4px", backgroundColor: "#1253FA" }} />
              </div>
              <div className="min-w-0">
                <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>Drop-off</p>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{trip.to}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Truck used */}
        <Card title="Truck used" icon={<LocalShippingRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: "104px", height: "88px" }}>
              {vehicle && <img src={vehicle.image} alt={`${trip.vehicle} truck`} draggable={false} className="object-contain" style={{ width: "104px", height: "104px" }} />}
            </div>
            <div className="min-w-0">
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#040033" }}>{trip.vehicle}</p>
              <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>{trip.config}</p>
              <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>Load {trip.weight}</p>
            </div>
          </div>
        </Card>

        {/* Driver */}
        {trip.driver && (
          <Card title="Driver" icon={<PersonRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "white" }}>{trip.driver.split(" ").map((n) => n[0]).join("")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{trip.driver}</p>
                {trip.eta && <p style={{ fontFamily: MONO, fontSize: "11px", color: "#1253FA" }}>ETA {trip.eta}</p>}
              </div>
            </div>
          </Card>
        )}

        {(trip.status === "completed" || trip.status === "cancelled") && (
          <button
            onClick={onReorder}
            className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer mt-1"
            style={{ backgroundColor: "#1253FA", padding: "16px", border: "none", transition: "transform 0.2s ease" }}
          >
            <ReplayRounded sx={{ fontSize: 16, color: "white" }} />
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>Reorder this trip</span>
          </button>
        )}
      </div>

      {receiptOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center" style={{ backgroundColor: "rgba(4,0,51,0.4)", backdropFilter: "blur(6px)" }} onClick={() => setReceiptOpen(false)}>
          <div
            className="w-full max-w-lg rounded-t-[28px] p-5"
            style={{ backgroundColor: "white", paddingBottom: "max(calc(env(safe-area-inset-bottom, 16px) + 16px), 32px)" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Receipt"
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
            </div>
            <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "17px", color: "#040033" }}>Receipt</p>
            <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76", marginBottom: "8px" }}>{trip.orderId}</p>
            <Row label="Date" value={`${trip.date} · ${trip.time}`} />
            <Row label="Truck" value={`${trip.vehicle} · ${trip.config}`} />
            <Row label="Load" value={trip.weight} />
            <Row label="Stops" value={String(trip.stops)} />
            <Row label="Status" value={status.label} />
            <div className="flex items-center justify-between mt-2 pt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", color: "#040033" }}>Total</span>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "#040033" }}>{trip.price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
