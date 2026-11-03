import { useNavigate } from "react-router";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import EventRounded from "./icons/EventRounded";
import ChevronRightRounded from "./icons/ChevronRightRounded";
import { truckTypeLabel } from "../lib/constants";
import { formatDate, isExpired } from "../lib/format";
import type { Truck } from "../lib/types";

export default function TruckCard({ truck }: { truck: Truck }) {
  const navigate = useNavigate();
  const expired = isExpired(truck.licenseExpiry);

  return (
    <button
      onClick={() => navigate(`/trucks/${truck.id}`)}
      className="w-full text-left rounded-[20px] bg-white p-4 flex flex-col gap-2.5 cursor-pointer active:scale-[0.99] transition-transform"
      style={{
        border: expired ? "1.5px solid #DC2626" : "1.5px solid transparent",
        boxShadow: expired ? "none" : "0 2px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EAF0FE" }}>
          <LocalShippingRounded sx={{ fontSize: 20, color: "#1253FA" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "var(--type-body)", color: "#040033" }}>{truck.plateNumber}</p>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "var(--type-body-sm)", color: "#6B7280" }}>{truckTypeLabel(truck)}</p>
        </div>
        <ChevronRightRounded sx={{ fontSize: 20, color: "#626A76", flexShrink: 0 }} />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <EventRounded sx={{ fontSize: 14, color: "#626A76" }} />
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "var(--type-caption)", color: "#6B7280" }}>
          Expires: {formatDate(truck.licenseExpiry)}
        </span>
        {expired && (
          <span
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: "#FDECEC", color: "#DC2626", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "var(--type-caption)" }}
          >
            EXPIRED
          </span>
        )}
      </div>
    </button>
  );
}
