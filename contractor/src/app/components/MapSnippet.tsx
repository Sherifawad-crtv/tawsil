import mapBuffer from "../../assets/map-buffer.svg";
import RouteMap from "./RouteMap";
import type { Waypoint } from "../lib/types";

/**
 * Map for the top of Order Details: the Google map of the route, over a static
 * block-map buffer that shows while it loads and stays if it can't.
 */
export default function MapSnippet({ stops }: { stops: Waypoint[] }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: "#ECECE8" }}>
      <RouteMap stops={stops} fallback={<StaticMap />} />
    </div>
  );
}

function StaticMap() {
  return <img src={mapBuffer} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />;
}
