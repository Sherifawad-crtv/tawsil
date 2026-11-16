import orderMap from "../../assets/order-map.svg";
import RouteMap from "./RouteMap";
import type { Waypoint } from "../lib/types";

/**
 * Map for the top of Order Details: the Google map of the route, over a static
 * street-map backdrop that stays if the Google map can't load.
 */
export default function MapSnippet({ stops }: { stops: Waypoint[] }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
      <RouteMap stops={stops} fallback={<StaticMap stops={stops.length} />} />
    </div>
  );
}

function StaticMap({ stops }: { stops: number }) {
  return (
    <div className="relative w-full h-full">
      <img src={orderMap} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path d="M 78 232 C 120 150, 150 200, 205 150 S 300 120, 322 82" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" fill="none" />
        <path d="M 78 232 C 120 150, 150 200, 205 150 S 300 120, 322 82" stroke="#1253FA" strokeWidth={4} strokeLinecap="round" fill="none" />
        {stops > 2 &&
          Array.from({ length: stops - 2 }).map((_, i) => (
            <circle key={i} cx={150 + i * 60} cy={190 - i * 28} r={5} fill="#FFFFFF" stroke="#1253FA" strokeWidth={3} />
          ))}
      </svg>
      <div
        aria-hidden
        className="absolute rounded-full"
        style={{ left: "66px", top: "220px", width: "24px", height: "24px", backgroundColor: "#040033", border: "4px solid white", boxShadow: "0 2px 8px rgba(4,0,51,0.3)" }}
      />
      <div
        aria-hidden
        className="absolute"
        style={{ left: "310px", top: "70px", width: "24px", height: "24px", backgroundColor: "#1253FA", border: "4px solid white", borderRadius: "6px", boxShadow: "0 2px 8px rgba(18,83,250,0.35)" }}
      />
    </div>
  );
}
