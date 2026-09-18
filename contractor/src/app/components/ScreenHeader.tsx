import { useNavigate } from "react-router";
import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import type { ReactNode } from "react";

/** Native large-title header with a back chevron, for every stack screen below the tab roots. */
export default function ScreenHeader({
  title,
  onBack,
  trailing,
}: {
  title: string;
  onBack?: () => void;
  trailing?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-3 flex-shrink-0"
      style={{ padding: "max(calc(env(safe-area-inset-top, 0px) + 14px), 14px) 16px 12px 16px" }}
    >
      <button
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
        style={{ backgroundColor: "#F0F0EE" }}
        aria-label="Back"
      >
        <ArrowBackIosNewRounded sx={{ fontSize: 15, color: "#040033", marginLeft: "2px" }} />
      </button>
      <h1
        className="flex-1 truncate"
        style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "19px", color: "#040033" }}
      >
        {title}
      </h1>
      {trailing}
    </div>
  );
}
