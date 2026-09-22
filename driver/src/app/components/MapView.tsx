import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import type { Order } from "../lib/types";

/** Stable pseudo-random spread per order id - no real geo data anywhere in this app, same decorative convention as MapSnippet, just full-screen and order-aware. */
function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const VB_W = 400;
const VB_H = 800;

export default function MapView({ order }: { order?: Order }) {
  const seed = order ? hashId(order.id) : 0;
  const startX = 70 + (seed % 90);
  const startY = 520 + ((seed >> 3) % 160);
  const endX = 240 + ((seed >> 6) % 90);
  const endY = 110 + ((seed >> 9) % 120);
  const midX = (startX + endX) / 2 + (((seed >> 12) % 120) - 60);
  const midY = (startY + endY) / 2 - 60;

  return (
    <div className="fixed inset-0" style={{ backgroundColor: "#E8ECE3" }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width={VB_W} height={VB_H} fill="#E8ECE3" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VB_H} stroke="#D8D9D4" strokeWidth={1} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={VB_W} y2={i * 40} stroke="#D8D9D4" strokeWidth={1} />
        ))}
        {order && (
          <path
            d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
            stroke="#1253FA"
            strokeWidth={4}
            strokeDasharray="2 10"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>

      {order && (
        <>
          <LocationOnRounded
            sx={{ fontSize: 34, color: "#0A0070", position: "absolute" }}
            style={{ left: `${(startX / VB_W) * 100}%`, top: `${(startY / VB_H) * 100}%`, transform: "translate(-50%, -85%)" }}
          />
          <LocationOnRounded
            sx={{ fontSize: 34, color: "#DC2626", position: "absolute" }}
            style={{ left: `${(endX / VB_W) * 100}%`, top: `${(endY / VB_H) * 100}%`, transform: "translate(-50%, -85%)" }}
          />
        </>
      )}
    </div>
  );
}
