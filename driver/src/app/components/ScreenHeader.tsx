import { useNavigate } from "react-router";
import ArrowBackIosNewRounded from "./icons/ArrowBackIosNewRounded";
import IconButton from "./IconButton";

/** Header for screens pushed on top of the tabs: back button, centred title with an optional monospace subtitle. */
export default function ScreenHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  const navigate = useNavigate();
  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4"
      style={{
        paddingTop: "max(env(safe-area-inset-top, 16px), 16px)",
        paddingBottom: "12px",
        backgroundColor: "rgba(245,245,243,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(232,232,229,0.6)",
      }}
    >
      <IconButton label="Back" onClick={() => (onBack ? onBack() : navigate(-1))}>
        <ArrowBackIosNewRounded sx={{ fontSize: 16, color: "#040033" }} />
      </IconButton>
      <div className="flex flex-col items-center min-w-0">
        <span className="truncate max-w-full" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>{title}</span>
        {subtitle && (
          <span className="truncate max-w-full" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280", letterSpacing: "0.04em" }}>
            {subtitle}
          </span>
        )}
      </div>
      <div className="w-10 flex-shrink-0" />
    </div>
  );
}
