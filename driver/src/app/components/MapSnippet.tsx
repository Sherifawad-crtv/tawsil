import { useState } from "react";
import AddRounded from "@mui/icons-material/AddRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";

/** Static map snippet - decorative route between the order's first and last stop, no live map data. Already aligned with map-first order detail conventions (Section 5.4) - no structural change from Contractor's version. */
export default function MapSnippet() {
  const [bumped, setBumped] = useState(false);

  return (
    <div className="relative w-full" style={{ height: "220px" }}>
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

      <button
        onClick={() => setBumped((b) => !b)}
        aria-label="Expand map"
        className="absolute flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        style={{ right: "16px", bottom: "34px", width: "44px", height: "44px", borderRadius: "14px", backgroundColor: "white", boxShadow: "0 2px 10px rgba(4,0,51,0.16)", border: "none" }}
      >
        <AddRounded sx={{ fontSize: 20, color: "#040033", transform: bumped ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
      </button>
    </div>
  );
}
