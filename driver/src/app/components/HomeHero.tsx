import ChevronRightRounded from "./icons/ChevronRightRounded";
import heroMap from "../../assets/hero-map.svg";

export interface HeroStat {
  label: string;
  value: number;
  /** 3D illustration shown on the card. */
  art: string;
  onClick: () => void;
}

/**
 * Hero of the Home screen, built like the contractor's: a full-width navy panel with
 * rounded bottom corners holding the greeting and tappable count cards. No wallet here -
 * drivers never see money - so the cards are the focus.
 */
export default function HomeHero({ title, subtitle, stats }: { title: string; subtitle: string; stats: HeroStat[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #040033 0%, #0A0070 62%, #1239B8 100%)",
        borderRadius: "0 0 32px 32px",
      }}
    >
      <img src={heroMap} alt="" aria-hidden draggable={false} className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.06 }} />

      <div className="relative w-full max-w-lg mx-auto px-4 pb-6" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)" }}>
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "white", lineHeight: "1.15" }}>{title}</h1>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "rgba(255,255,255,0.65)", marginTop: "6px" }}>{subtitle}</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {stats.map((st) => (
            <button
              key={st.label}
              onClick={st.onClick}
              aria-label={`${st.label}: ${st.value}`}
              className="relative rounded-[22px] bg-white p-4 text-left cursor-pointer active:scale-[0.97] transition-transform"
              style={{ border: "none" }}
            >
              <ChevronRightRounded sx={{ fontSize: 16, color: "#8A919C", position: "absolute", top: "14px", right: "12px" }} />
              <img src={st.art} alt="" draggable={false} width={56} height={56} style={{ width: 56, height: 56, objectFit: "contain", mixBlendMode: "multiply" }} />
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", lineHeight: 1.1, color: "#040033", marginTop: "10px" }}>{st.value}</p>
              <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", marginTop: "2px" }}>{st.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
