import { useNavigate } from "react-router";
import PhoneRounded from "./icons/PhoneRounded";
import BadgeRounded from "./icons/BadgeRounded";
import EventRounded from "./icons/EventRounded";
import ChevronRightRounded from "./icons/ChevronRightRounded";
import PersonOffRounded from "./icons/PersonOffRounded";
import { formatDate, formatDateTime } from "../lib/format";
import type { Driver } from "../lib/types";

const AVATAR_COLORS = ["#1253FA", "#0A0070", "#16803C", "#B45309"];

export default function DriverCard({ driver }: { driver: Driver }) {
  const navigate = useNavigate();
  const color = AVATAR_COLORS[driver.name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <button
      onClick={() => navigate(`/drivers/${driver.id}`)}
      className="w-full text-left rounded-[20px] bg-white p-4 flex flex-col gap-2.5 cursor-pointer active:scale-[0.99] transition-transform"
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white" }}>{driver.name[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>{driver.name}</p>
          <div className="flex items-center gap-1.5">
            <PhoneRounded sx={{ fontSize: 12.5, color: "#9CA3AF" }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#6B7280" }}>{driver.phone}</span>
          </div>
        </div>
        <ChevronRightRounded sx={{ fontSize: 20, color: "#9CA3AF", flexShrink: 0 }} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <BadgeRounded sx={{ fontSize: 14, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#6B7280" }}>License: {driver.licenseNumber}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <EventRounded sx={{ fontSize: 14, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#6B7280" }}>Expires: {formatDate(driver.licenseExpiry)}</span>
        </div>
      </div>

      {!driver.active && driver.deactivatedAt && (
        <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ backgroundColor: "#FDECEC" }}>
          <PersonOffRounded sx={{ fontSize: 14, color: "#DC2626" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11.5px", color: "#DC2626" }}>
            Inactive · Deactivated at {formatDateTime(driver.deactivatedAt)}
          </span>
        </div>
      )}
    </button>
  );
}
