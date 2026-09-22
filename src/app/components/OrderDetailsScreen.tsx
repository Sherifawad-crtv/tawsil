import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";
import AcUnitRounded from "@mui/icons-material/AcUnitRounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import StraightenRounded from "@mui/icons-material/StraightenRounded";
import ScaleRounded from "@mui/icons-material/ScaleRounded";
import PaymentsRounded from "@mui/icons-material/PaymentsRounded";
import CategoryRounded from "@mui/icons-material/CategoryRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import OpenInFullRounded from "@mui/icons-material/OpenInFullRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import IosShareRounded from "@mui/icons-material/IosShareRounded";
import ReportProblemRounded from "@mui/icons-material/ReportProblemRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import VerticalAlignTopRounded from "@mui/icons-material/VerticalAlignTopRounded";

/* ─────────── Mock data ─────────── */
const ORDER = {
  id: "ORD-2026-000085",
  status: "Assigned" as OrderStatus,
  vehicle: "Dababa Refrigerated",
  plate: "XYR987",
  refrigerated: true,
  targetTempC: -18,
  currentTempC: -17.4,
  tempStatus: "in-range" as "in-range" | "drifting" | "breach",
  lastTempUpdate: "32s ago",
  lastGpsPing: "8s ago",
  eta: "14:42",
  onTime: true,
  distanceKm: 221.22,
  weightKg: 750,
  priceEgp: 5212.94,
  podRequired: false,
  driver: {
    name: "Karim El-Sayed",
    initials: "KS",
    rating: 4.91,
    phone: "+20 100 555 0188",
    trips: 1842,
  },
  pickup: {
    name: "Smart Village Logistics Hub",
    address: "12 El Nasr Road, Smouha, Alexandria 21648",
    lang: "en" as "en" | "ar",
    contact: "Mariam Hassan",
    phone: "+20 122 444 7710",
    status: "Completed" as StopStatus,
    coords: [31.2156, 29.9553] as [number, number],
  },
  dropoff: {
    name: "Cairo Festival City Warehouse",
    address: "شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة ١١٨٣٥",
    lang: "ar" as "en" | "ar",
    contact: "Omar Abdelaziz",
    phone: "+20 109 877 2244",
    status: "Pending" as StopStatus,
    coords: [30.0265, 31.4913] as [number, number],
  },
  truckPos: [30.62, 30.72] as [number, number],
  client: { name: "Alexandria Cold Logistics S.A.E.", contact: "Procurement Desk", phone: "+20 3 487 9012" },
  contractor: { name: "Nile Freight Co.", contact: "Dispatch", phone: "+20 2 257 1190" },
  events: [
    { label: "Created", at: "Apr 10 · 10:52" },
    { label: "Accepted", at: "Apr 10 · 12:17" },
    { label: "Assigned", at: "Apr 17 · 14:02" },
  ],
};

type OrderStatus = "Pending" | "Accepted" | "Assigned" | "In Progress" | "Complete";
type StopStatus = "Pending" | "Arrived" | "Completed";
const STATUS_ORDER: OrderStatus[] = ["Pending", "Accepted", "Assigned", "In Progress", "Complete"];

const TEMP_SPARK = [-17.8, -17.9, -18.1, -18.0, -17.7, -17.5, -17.6, -17.4, -17.5, -17.4, -17.3, -17.4, -17.6, -17.5, -17.4, -17.3, -17.4, -17.5, -17.4, -17.4, -17.3, -17.4, -17.5, -17.4];

/* ─────────── Map ─────────── */
const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;border:3px solid #040033;box-shadow:0 2px 10px rgba(0,0,0,0.18);font-family:'Archivo Black',sans-serif;font-size:11px;color:#040033">1</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const dropoffIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#1253FA;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 12px rgba(18,83,250,0.4);font-family:'Archivo Black',sans-serif;font-size:11px;color:white">2</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const truckIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#1253FA;border:4px solid white;box-shadow:0 0 0 4px rgba(18,83,250,0.25),0 2px 12px rgba(18,83,250,0.5);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapHero({ expanded }: { expanded: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inst = useRef<L.Map | null>(null);
  useEffect(() => {
    if (!ref.current || inst.current) return;
    const map = L.map(ref.current, { zoomControl: false, attributionControl: false, dragging: expanded, touchZoom: expanded, scrollWheelZoom: false });
    inst.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);
    L.marker(ORDER.pickup.coords, { icon: pickupIcon }).addTo(map);
    L.marker(ORDER.dropoff.coords, { icon: dropoffIcon }).addTo(map);
    L.marker(ORDER.truckPos, { icon: truckIcon }).addTo(map);
    L.polyline([ORDER.pickup.coords, ORDER.truckPos, ORDER.dropoff.coords], { color: "#040033", weight: 4, opacity: 0.85, dashArray: "1, 8", lineCap: "round" }).addTo(map);
    map.fitBounds([ORDER.pickup.coords, ORDER.dropoff.coords], { padding: [50, 50] });
    return () => { try { map.remove(); } catch (_) {} inst.current = null; };
  }, [expanded]);
  useEffect(() => {
    if (!inst.current) return;
    inst.current.invalidateSize();
  }, [expanded]);
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

/* ─────────── Small components ─────────── */
function SectionHeader({ icon, label, accent, right }: { icon: React.ReactNode; label: string; accent: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}14` }}>
          <span style={{ color: accent, display: "flex" }}>{icon}</span>
        </div>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033", letterSpacing: "0.02em" }}>{label}</span>
      </div>
      {right}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-4 ${className}`} style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(4,0,51,0.05)" }}>
      {children}
    </div>
  );
}

function IconBtn({ children, label, onClick, accent = "#1253FA" }: { children: React.ReactNode; label: string; onClick?: () => void; accent?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl active:scale-95 cursor-pointer"
      style={{ backgroundColor: `${accent}12`, border: "none", transition: "transform 0.15s ease" }}
    >
      <span style={{ color: accent, display: "flex" }}>{children}</span>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: accent, letterSpacing: "0.02em" }}>
        {label}
      </span>
    </button>
  );
}

/* ─────────── Status strip ─────────── */
function StatusStrip({ status }: { status: OrderStatus }) {
  const idx = STATUS_ORDER.indexOf(status);
  return (
    <div className="flex items-center gap-1.5">
      {STATUS_ORDER.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-center gap-1">
              <div className="w-full rounded-full" style={{ height: "4px", backgroundColor: done || active ? "#1253FA" : "#E8E8E5", transition: "background-color 0.4s ease" }} />
            </div>
            <span style={{ fontFamily: active ? "'Archivo Black', sans-serif" : "'Courier Prime', monospace", fontSize: "9px", color: done ? "#040033" : active ? "#1253FA" : "#9CA3AF", letterSpacing: "0.04em", textAlign: "center", whiteSpace: "nowrap" }}>
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ContextualCTA({ status, onAction }: { status: OrderStatus; onAction: () => void }) {
  const map: Record<OrderStatus, string> = {
    Pending: "Awaiting Acceptance",
    Accepted: "Assign Driver",
    Assigned: "Start Trip",
    "In Progress": "Mark Delivered",
    Complete: "View Receipt",
  };
  const disabled = status === "Pending";
  return (
    <button
      onClick={onAction}
      disabled={disabled}
      className="w-full rounded-2xl flex items-center justify-center active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed"
      style={{
        backgroundColor: disabled ? "#D8D9D4" : "#1253FA",
        boxShadow: disabled ? "none" : "0 4px 18px rgba(18,83,250,0.28)",
        padding: "14px",
        border: "none",
        transition: "transform 0.2s ease",
      }}
    >
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "white", letterSpacing: "0.04em" }}>
        {map[status].toUpperCase()}
      </span>
    </button>
  );
}

/* ─────────── Cold-chain card ─────────── */
function ColdChainCard() {
  const min = Math.min(...TEMP_SPARK);
  const max = Math.max(...TEMP_SPARK);
  const W = 240;
  const H = 44;
  const points = TEMP_SPARK.map((v, i) => {
    const x = (i / (TEMP_SPARK.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  }).join(" ");
  const dotColor = ORDER.tempStatus === "in-range" ? "#1253FA" : ORDER.tempStatus === "drifting" ? "#6B7280" : "#DC2626";

  return (
    <Card>
      <SectionHeader
        icon={<AcUnitRounded sx={{ fontSize: 16 }} />}
        label="Cold Chain"
        accent="#1253FA"
        right={
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: `${dotColor}12` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: dotColor, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              In Range
            </span>
          </div>
        }
      />
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "30px", color: "#040033", lineHeight: 1 }}>
              {ORDER.currentTempC.toFixed(1)}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#6B7280" }}>°C</span>
          </div>
          <p className="mt-0.5" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
            Target {ORDER.targetTempC}°C · ±2°C
          </p>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
            Updated {ORDER.lastTempUpdate}
          </p>
        </div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flexShrink: 0 }}>
          <defs>
            <linearGradient id="cold" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1253FA" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1253FA" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={`0,${H} ${points} ${W},${H}`} fill="url(#cold)" stroke="none" />
          <polyline points={points} fill="none" stroke="#1253FA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <button className="w-full mt-3 pt-3 flex items-center justify-center gap-1 cursor-pointer active:opacity-70" style={{ borderTop: "1px solid #F0F0EE", borderLeft: "none", borderRight: "none", borderBottom: "none", backgroundColor: "transparent" }}>
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: "#1253FA" }}>View 24h Log</span>
        <KeyboardArrowDownRounded sx={{ fontSize: 14, color: "#1253FA", transform: "rotate(-90deg)" }} />
      </button>
    </Card>
  );
}

/* ─────────── Waypoints card ─────────── */
function WaypointRow({ idx, type, status, name, address, addrLang, contact }: {
  idx: number; type: "PICKUP" | "DROPOFF"; status: StopStatus; name: string; address: string; addrLang: "en" | "ar"; contact: string;
}) {
  const accent = type === "PICKUP" ? "#040033" : "#1253FA";
  const statusColor = status === "Completed" ? "#1253FA" : status === "Arrived" ? "#040033" : "#9CA3AF";
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center" style={{ width: "26px", height: "26px", borderRadius: "13px", backgroundColor: accent }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "white" }}>{idx}</span>
        </div>
        {idx === 1 && <div style={{ width: "1.5px", flex: 1, minHeight: "30px", marginTop: "4px", marginBottom: "4px", background: "repeating-linear-gradient(to bottom, #D8D9D4 0 4px, transparent 4px 8px)" }} />}
      </div>
      <div className="flex-1 min-w-0 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "9px", color: accent, backgroundColor: `${accent}12`, letterSpacing: "0.08em" }}>
            {type}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: statusColor, letterSpacing: "0.06em", textTransform: "uppercase" }}>{status}</span>
          </span>
        </div>
        <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{name}</p>
        <p
          className="mt-0.5"
          dir={addrLang === "ar" ? "rtl" : "ltr"}
          style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280", lineHeight: 1.5, textAlign: addrLang === "ar" ? "right" : "left" }}
        >
          {address}
        </p>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F0F0EE" }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "8px", color: "#040033" }}>{contact.split(" ").map((s) => s[0]).slice(0, 2).join("")}</span>
            </div>
            <span className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: "#040033" }}>{contact}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button aria-label={`Call ${contact}`} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "rgba(18,83,250,0.1)", border: "none" }}>
              <PhoneRounded sx={{ fontSize: 14, color: "#1253FA" }} />
            </button>
            <button aria-label={`Message ${contact}`} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "rgba(4,0,51,0.06)", border: "none" }}>
              <ChatBubbleOutlineRounded sx={{ fontSize: 14, color: "#040033" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Cancel modal (typed confirm) ─────────── */
function CancelModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [val, setVal] = useState("");
  const matches = val.trim() === ORDER.id;
  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      style={{ backgroundColor: "rgba(4,0,51,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl p-6"
        style={{ backgroundColor: "#F5F5F3", animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(220,38,38,0.1)" }}>
            <ReportProblemRounded sx={{ fontSize: 22, color: "#DC2626" }} />
          </div>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{ backgroundColor: "white", border: "none" }}>
            <CloseRounded sx={{ fontSize: 16, color: "#040033" }} />
          </button>
        </div>
        <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>Cancel this order?</h3>
        <p className="mt-1.5" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#6B7280", lineHeight: 1.5 }}>
          The driver has already been assigned. Cancelling now may incur a fee. Type the order number to confirm.
        </p>
        <div className="mt-4 mb-2" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Order ID
        </div>
        <div className="rounded-2xl p-3 mb-3" style={{ backgroundColor: "white", border: "1px solid #E8E8E5" }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#040033", letterSpacing: "0.04em" }}>{ORDER.id}</span>
        </div>
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Type the order number"
          className="w-full rounded-2xl outline-none"
          style={{
            backgroundColor: "white",
            border: `1.5px solid ${matches ? "#1253FA" : "#E8E8E5"}`,
            padding: "14px 16px",
            fontFamily: "'Courier Prime', monospace",
            fontSize: "14px",
            color: "#040033",
            transition: "border-color 0.2s ease",
          }}
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 rounded-2xl active:scale-[0.97] cursor-pointer" style={{ backgroundColor: "white", border: "1px solid #E8E8E5", padding: "14px" }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033" }}>Keep Order</span>
          </button>
          <button
            onClick={onConfirm}
            disabled={!matches}
            className="flex-1 rounded-2xl active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed"
            style={{
              backgroundColor: matches ? "#DC2626" : "#F0F0EE",
              border: "none",
              padding: "14px",
              transition: "background-color 0.2s ease",
            }}
          >
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: matches ? "white" : "#9CA3AF" }}>Cancel Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Overflow menu ─────────── */
function OverflowMenu({ onClose, onCancel }: { onClose: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      <div className="absolute" style={{ top: "calc(env(safe-area-inset-top, 16px) + 60px)", right: "12px", animation: "slideIn 0.25s cubic-bezier(0.16,1,0.3,1)" }} onClick={(e) => e.stopPropagation()}>
        <div className="rounded-2xl py-1.5 min-w-[200px]" style={{ backgroundColor: "white", boxShadow: "0 8px 32px rgba(4,0,51,0.18)" }}>
          <MenuItem icon={<IosShareRounded sx={{ fontSize: 16 }} />} label="Share" />
          <MenuItem icon={<ReportProblemRounded sx={{ fontSize: 16 }} />} label="Report Issue" />
          <div className="my-1" style={{ height: "1px", backgroundColor: "#F0F0EE" }} />
          <MenuItem icon={<CloseRounded sx={{ fontSize: 16 }} />} label="Cancel Order" destructive onClick={onCancel} />
        </div>
      </div>
    </div>
  );
}
function MenuItem({ icon, label, destructive, onClick }: { icon: React.ReactNode; label: string; destructive?: boolean; onClick?: () => void }) {
  const c = destructive ? "#DC2626" : "#040033";
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-4 py-2.5 cursor-pointer active:bg-black/[0.03]" style={{ border: "none", backgroundColor: "transparent" }}>
      <span style={{ color: c, display: "flex" }}>{icon}</span>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: c }}>{label}</span>
    </button>
  );
}

/* ─────────── Pull-to-refresh hook ─────────── */
function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (scrollerRef.current && scrollerRef.current.scrollTop <= 0) startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setPull(Math.min(80, dy * 0.55));
  };
  const onTouchEnd = async () => {
    if (pull > 50) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setPull(0);
    startY.current = null;
  };
  return { pull, refreshing, scrollerRef, onTouchStart, onTouchMove, onTouchEnd };
}

/* ─────────── Toast ─────────── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed left-1/2 z-[80]" style={{ bottom: "calc(env(safe-area-inset-bottom, 16px) + 24px)", transform: "translateX(-50%)", animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ backgroundColor: "#040033", boxShadow: "0 8px 28px rgba(4,0,51,0.3)" }}>
        <CheckCircleRounded sx={{ fontSize: 16, color: "#1253FA" }} />
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "white" }}>{msg}</span>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════
   MAIN
   ═════════════════════════════════════════ */
export default function OrderDetailsScreen({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<OrderStatus>(ORDER.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [pingAge, setPingAge] = useState(8);

  useEffect(() => {
    const t = setInterval(() => setPingAge((v) => (v >= 10 ? 0 : v + 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const { pull, refreshing, scrollerRef, onTouchStart, onTouchMove, onTouchEnd } = usePullToRefresh(async () => {
    await new Promise((r) => setTimeout(r, 900));
    setToast("Order refreshed");
  });

  const handleCTA = () => {
    if (status === "Assigned") {
      setStatus("In Progress");
      setToast("Trip started");
    } else if (status === "In Progress") {
      setStatus("Complete");
      setToast("Marked as delivered");
    } else if (status === "Complete") {
      setToast("Receipt opened");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#F5F5F3" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0 z-30"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 16px), 16px)",
          paddingBottom: "12px",
          backgroundColor: "rgba(245,245,243,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(232,232,229,0.6)",
        }}
      >
        <button onClick={onBack} aria-label="Back" className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "none" }}>
          <ArrowBackIosNewRounded sx={{ fontSize: 16, color: "#040033" }} />
        </button>
        <div className="flex flex-col items-center">
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>Order Details</span>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280", letterSpacing: "0.04em" }}>{ORDER.id}</span>
        </div>
        <button onClick={() => setMenuOpen(true)} aria-label="More options" className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "none" }}>
          <MoreVertRounded sx={{ fontSize: 18, color: "#040033" }} />
        </button>
      </div>

      {/* Pull-to-refresh indicator */}
      <div className="flex items-center justify-center flex-shrink-0" style={{ height: pull, transition: refreshing ? "none" : "height 0.25s ease", overflow: "hidden" }}>
        <div className="flex items-center gap-1.5">
          <RefreshRounded sx={{ fontSize: 14, color: "#1253FA", animation: refreshing ? "spin 1s linear infinite" : "none", transform: `rotate(${pull * 4}deg)` }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>
            {refreshing ? "Refreshing…" : pull > 50 ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="flex-1 overflow-y-auto"
        style={{ minHeight: 0 }}
      >
        {/* Map hero */}
        <div className="relative" style={{ height: "35vh", minHeight: "260px" }}>
          <MapHero expanded={false} />
          {/* ETA chip */}
          <div className="absolute" style={{ top: "12px", left: "12px" }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.96)", boxShadow: "0 4px 18px rgba(0,0,0,0.1)", backdropFilter: "blur(12px)" }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: ORDER.onTime ? "rgba(18,83,250,0.12)" : "rgba(220,38,38,0.12)" }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "10px", color: ORDER.onTime ? "#1253FA" : "#DC2626" }}>ETA</span>
              </div>
              <div className="flex flex-col">
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "#040033", lineHeight: 1 }}>{ORDER.eta}</span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: ORDER.onTime ? "#1253FA" : "#DC2626", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {ORDER.onTime ? "On Time" : "Delayed"}
                </span>
              </div>
              <div className="w-px h-7" style={{ backgroundColor: "#E8E8E5" }} />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1253FA", animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{pingAge}s ago</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMapExpanded(true)}
            aria-label="Expand map"
            className="absolute cursor-pointer active:scale-90 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ top: "12px", right: "12px", backgroundColor: "rgba(255,255,255,0.96)", boxShadow: "0 4px 18px rgba(0,0,0,0.1)", border: "none" }}
          >
            <OpenInFullRounded sx={{ fontSize: 16, color: "#040033" }} />
          </button>
        </div>

        {/* Sticky status strip */}
        <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ backgroundColor: "rgba(245,245,243,0.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(232,232,229,0.6)" }}>
          <StatusStrip status={status} />
        </div>

        {/* Body cards */}
        <div className="px-4 py-4 flex flex-col gap-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 24px) + 32px)" }}>
          {/* Cold chain */}
          {ORDER.refrigerated && <ColdChainCard />}

          {/* Waypoints */}
          <Card>
            <SectionHeader icon={<LocalShippingRounded sx={{ fontSize: 16 }} />} label="Route" accent="#040033" right={
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280", letterSpacing: "0.06em" }}>2 STOPS</span>
            } />
            <WaypointRow idx={1} type="PICKUP" status={ORDER.pickup.status} name={ORDER.pickup.name} address={ORDER.pickup.address} addrLang={ORDER.pickup.lang} contact={ORDER.pickup.contact} />
            <WaypointRow idx={2} type="DROPOFF" status={ORDER.dropoff.status} name={ORDER.dropoff.name} address={ORDER.dropoff.address} addrLang={ORDER.dropoff.lang} contact={ORDER.dropoff.contact} />
          </Card>

          {/* Driver & Truck */}
          <Card>
            <SectionHeader icon={<VerifiedRounded sx={{ fontSize: 16 }} />} label="Driver & Truck" accent="#0A0070" />
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #F0F0EE" }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "white" }}>{ORDER.driver.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{ORDER.driver.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <StarRounded sx={{ fontSize: 12, color: "#040033" }} />
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#040033", fontWeight: 600 }}>{ORDER.driver.rating}</span>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>· {ORDER.driver.trips.toLocaleString()} trips</span>
                </div>
              </div>
              <IconBtn label="Call" accent="#1253FA"><PhoneRounded sx={{ fontSize: 14 }} /></IconBtn>
              <button aria-label={`Message ${ORDER.driver.name}`} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "rgba(4,0,51,0.06)", border: "none" }}>
                <ChatBubbleOutlineRounded sx={{ fontSize: 14, color: "#040033" }} />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(18,83,250,0.1)" }}>
                <LocalShippingRounded sx={{ fontSize: 20, color: "#1253FA" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{ORDER.vehicle}</p>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>Plate {ORDER.plate} · 1.5T capacity</p>
              </div>
            </div>
          </Card>

          {/* Trip summary inline grid */}
          <Card>
            <SectionHeader icon={<CategoryRounded sx={{ fontSize: 16 }} />} label="Trip Summary" accent="#6B7280" />
            <div className="grid grid-cols-2 gap-2.5">
              <SummaryCell icon={<CategoryRounded sx={{ fontSize: 14 }} />} label="Trip Type" value="On-Demand" accent="#040033" />
              <SummaryCell icon={<StraightenRounded sx={{ fontSize: 14 }} />} label="Distance" value={`${ORDER.distanceKm.toFixed(2)} km`} accent="#0A0070" />
              <SummaryCell icon={<ScaleRounded sx={{ fontSize: 14 }} />} label="Weight" value={`${ORDER.weightKg.toLocaleString()} kg`} accent="#1253FA" />
              <SummaryCell icon={<PaymentsRounded sx={{ fontSize: 14 }} />} label="Price" value={`EGP ${ORDER.priceEgp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent="#040033" highlight />
            </div>
          </Card>

          {/* POD line (compact, since not required) */}
          {ORDER.podRequired ? (
            <Card>
              <SectionHeader icon={<VerifiedRounded sx={{ fontSize: 16 }} />} label="Files & POD" accent="#1253FA" />
              {["Bill of Lading", "Odometer Start", "Odometer End", "Delivery Photos", "Signature"].map((item) => (
                <div key={item} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #F0F0EE" }}>
                  <div className="flex items-center gap-2">
                    <RadioButtonUncheckedRounded sx={{ fontSize: 16, color: "#9CA3AF" }} />
                    <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{item}</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg cursor-pointer active:scale-95" style={{ backgroundColor: "rgba(18,83,250,0.1)", border: "none" }}>
                    <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11px", color: "#1253FA" }}>Upload</span>
                  </button>
                </div>
              ))}
            </Card>
          ) : (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ backgroundColor: "rgba(107,114,128,0.06)" }}>
              <VerifiedRounded sx={{ fontSize: 14, color: "#6B7280" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>
                Proof of Delivery not required for this order
              </span>
            </div>
          )}

          {/* Timeline (collapsed) */}
          <Card>
            <button onClick={() => setTimelineOpen((v) => !v)} className="w-full flex items-center justify-between cursor-pointer" style={{ border: "none", backgroundColor: "transparent" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(10,0,112,0.08)" }}>
                  <HistoryRounded sx={{ fontSize: 16, color: "#0A0070" }} />
                </div>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033" }}>Timeline</span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280", letterSpacing: "0.06em" }}>{ORDER.events.length} EVENTS</span>
              </div>
              <KeyboardArrowDownRounded sx={{ fontSize: 18, color: "#040033", transform: timelineOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }} />
            </button>
            {timelineOpen && (
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
                {ORDER.events.map((ev, i) => (
                  <div key={ev.label} className="flex gap-3 pb-3 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 1.5px #1253FA" }} />
                      {i < ORDER.events.length - 1 && <div className="flex-1 w-px mt-1" style={{ backgroundColor: "#E8E8E5", minHeight: "16px" }} />}
                    </div>
                    <div className="flex-1 -mt-1">
                      <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{ev.label}</p>
                      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>{ev.at}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* People involved (collapsed) */}
          <Card>
            <button onClick={() => setPeopleOpen((v) => !v)} className="w-full flex items-center justify-between cursor-pointer" style={{ border: "none", backgroundColor: "transparent" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(107,114,128,0.1)" }}>
                  <GroupsRounded sx={{ fontSize: 16, color: "#6B7280" }} />
                </div>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033" }}>People Involved</span>
              </div>
              <KeyboardArrowDownRounded sx={{ fontSize: 18, color: "#040033", transform: peopleOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }} />
            </button>
            {peopleOpen && (
              <div className="mt-3 pt-3 flex flex-col gap-3" style={{ borderTop: "1px solid #F0F0EE" }}>
                <PersonRow role="Client" name={ORDER.client.name} contact={ORDER.client.contact} />
                <PersonRow role="Contractor" name={ORDER.contractor.name} contact={ORDER.contractor.contact} />
              </div>
            )}
          </Card>
        </div>
      </div>

      {menuOpen && <OverflowMenu onClose={() => setMenuOpen(false)} onCancel={() => { setMenuOpen(false); setCancelOpen(true); }} />}
      {cancelOpen && <CancelModal onClose={() => setCancelOpen(false)} onConfirm={() => { setCancelOpen(false); setToast("Order cancellation requested"); }} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {mapExpanded && <FullscreenMap onClose={() => setMapExpanded(false)} />}

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function SummaryCell({ icon, label, value, accent, highlight }: { icon: React.ReactNode; label: string; value: string; accent: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl p-3" style={{ backgroundColor: highlight ? "#040033" : "#F8F8F6" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: highlight ? "rgba(255,255,255,0.6)" : accent, display: "flex" }}>{icon}</span>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: highlight ? "rgba(255,255,255,0.6)" : "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: highlight ? "white" : "#040033", lineHeight: 1.1 }}>{value}</p>
    </div>
  );
}

function PersonRow({ role, name, contact }: { role: string; name: string; contact: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F0F0EE" }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "#040033" }}>
          {name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>{role}</span>
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{name}</p>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280" }}>{contact}</p>
      </div>
      <button aria-label={`Call ${name}`} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "rgba(18,83,250,0.1)", border: "none" }}>
        <PhoneRounded sx={{ fontSize: 14, color: "#1253FA" }} />
      </button>
      <button aria-label={`Message ${name}`} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90" style={{ backgroundColor: "rgba(4,0,51,0.06)", border: "none" }}>
        <ChatBubbleOutlineRounded sx={{ fontSize: 14, color: "#040033" }} />
      </button>
    </div>
  );
}

function FullscreenMap({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[65]" style={{ backgroundColor: "white" }}>
      <div className="absolute inset-0">
        <MapHero expanded />
      </div>
      <button onClick={onClose} aria-label="Close map" className="absolute w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer active:scale-90" style={{ top: "max(env(safe-area-inset-top, 16px), 16px)", left: "16px", backgroundColor: "white", boxShadow: "0 4px 18px rgba(0,0,0,0.12)", border: "none" }}>
        <CloseRounded sx={{ fontSize: 18, color: "#040033" }} />
      </button>
    </div>
  );
}
