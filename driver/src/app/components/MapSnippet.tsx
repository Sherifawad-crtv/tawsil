import LocationOnRounded from "./icons/LocationOnRounded";
import RouteMap from "./RouteMap";
import type { Waypoint } from "../lib/types";

/**
 * Map for the top of Order Details: the Google map of the route, over a static
 * placeholder that stays if the Google map can't load.
 */
export default function MapSnippet({ stops }: { stops: Waypoint[] }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "260px", backgroundColor: "#E8ECE3" }}>
      <RouteMap stops={stops} fallback={<StaticMap />} padding={{ top: 50, right: 40, bottom: 60, left: 40 }} />
    </div>
  );
}

function StaticMap() {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#E8ECE3" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={220} stroke="#D8D9D4" strokeWidth={1} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={400} y2={i * 40} stroke="#D8D9D4" strokeWidth={1} />
        ))}
        <path d="M 70 170 C 140 60, 260 190, 330 70" stroke="#1253FA" strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" fill="none" />
      </svg>
      <LocationOnRounded sx={{ fontSize: 30, color: "#0A0070", position: "absolute", left: "58px", top: "150px" }} />
      <LocationOnRounded sx={{ fontSize: 30, color: "#DC2626", position: "absolute", left: "318px", top: "44px" }} />
    </div>
  );
}
