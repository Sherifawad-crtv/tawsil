import type { ReactNode } from "react";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import { formatTime } from "../lib/format";
import { TRIP_PROGRESS } from "../lib/tripProgress";
import type { Order } from "../lib/types";

/** Pieces shared by the truck and driver cards. */

export const MONO = "'Courier Prime', monospace";

export type FleetStatus = { label: string; bg: string; fg: string };

/** Live status of a truck or driver, from the current trip (if any). */
export function fleetStatus(active: boolean, trip: Order | undefined): FleetStatus {
  if (!active) return { label: "Inactive", bg: "#FDECEC", fg: "#DC2626" };
  if (trip?.status === "In Progress") return { label: "On Route", bg: "#DCFCE7", fg: "#22C55E" };
  if (trip) return { label: "Assigned", bg: "#EAF0FE", fg: "#1253FA" };
  return { label: "Available", bg: "#E7F6EC", fg: "#16803C" };
}

export function StatusPill({ status }: { status: FleetStatus }) {
  return (
    <span
      className="rounded-xl whitespace-nowrap flex-shrink-0"
      style={{ backgroundColor: status.bg, color: status.fg, fontFamily: MONO, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px" }}
    >
      {status.label}
    </span>
  );
}

/** Progress of the current trip: gradient bar, truck marker, pickup time and expected end time. */
export function TripProgress({ trip }: { trip: Order }) {
  const stage = TRIP_PROGRESS[trip.status];
  if (!stage) return null;
  const endTime = trip.hours ? new Date(new Date(trip.pickupAt).getTime() + trip.hours * 3600_000).toISOString() : undefined;
  return (
    <div className="px-5 pt-3.5">
      <div className="relative">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F0EE" }}>
          <div className="h-full rounded-full" style={{ width: `${stage.pct * 100}%`, background: "linear-gradient(90deg, #040033, #1253FA)" }} />
        </div>
        <div
          className="absolute w-5 h-5 rounded-full flex items-center justify-center"
          style={{ left: `${stage.pct * 100}%`, top: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", boxShadow: "0 0 0 1.5px #1253FA" }}
        >
          <LocalShippingRounded sx={{ fontSize: 11, color: "#1253FA" }} />
        </div>
      </div>
      <div className="flex justify-between mt-1.5">
        <span style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>{formatTime(trip.pickupAt)}</span>
        <span style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>{endTime ? formatTime(endTime) : stage.label}</span>
      </div>
    </div>
  );
}

/** Icon and figure in the card footer. */
export function Stat({ icon, children, color }: { icon: ReactNode; children: ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {icon}
      <span className="whitespace-nowrap" style={{ fontFamily: MONO, fontSize: "11px", color: color ?? "#6B7280" }}>{children}</span>
    </div>
  );
}

/** Avatar, small label and name, with the current order id on the right. */
export function PersonRow({ avatar, label, name, muted, tripId }: { avatar: ReactNode; label: string; name: string; muted?: boolean; tripId?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {avatar}
        <div className="min-w-0">
          <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>{label}</p>
          <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: muted ? "#626A76" : "#040033" }}>{name}</p>
        </div>
      </div>
      {tripId && <span className="flex-shrink-0" style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>#{tripId}</span>}
    </div>
  );
}
