import { useRef, useState } from "react";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";

const THUMB = 48;

/**
 * Drag-to-confirm accept control, same idea as a ride-hailing app's incoming
 * request card: a deliberate swipe instead of a tap, so a stray touch while
 * scrolling the carousel this sits inside can never accept an order by
 * accident. touch-action: none on the thumb keeps the browser's native
 * scroll from fighting the drag.
 */
export default function SlideToAccept({ onAccept, label = "Slide to Accept" }: { onAccept: () => void; label?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const startXRef = useRef(0);
  const maxRef = useRef(0);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (accepted) return;
    const track = trackRef.current;
    if (!track) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startXRef.current = e.clientX - dragX;
    maxRef.current = track.clientWidth - THUMB - 8;
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || accepted) return;
    const next = Math.min(Math.max(0, e.clientX - startXRef.current), maxRef.current);
    setDragX(next);
  }

  function handlePointerUp() {
    if (!dragging || accepted) return;
    setDragging(false);
    const threshold = maxRef.current * 0.8;
    if (maxRef.current > 0 && dragX >= threshold) {
      setDragX(maxRef.current);
      setAccepted(true);
      onAccept();
    } else {
      setDragX(0);
    }
  }

  const pct = maxRef.current > 0 ? dragX / maxRef.current : 0;

  return (
    <div
      ref={trackRef}
      className="relative w-full rounded-full overflow-hidden select-none"
      style={{ height: "52px", backgroundColor: accepted ? "#DCFCE7" : "#EAF0FE" }}
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{
          width: `${dragX + THUMB + 8}px`,
          background: accepted ? "#22C55E" : "linear-gradient(90deg, #040033, #1253FA)",
          transition: dragging ? "none" : "width 0.25s ease",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            color: pct > 0.35 || accepted ? "white" : "#1253FA",
            transition: "color 0.2s",
          }}
        >
          {accepted ? "Accepted" : label}
        </span>
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute top-1 flex items-center justify-center rounded-full"
        style={{
          left: "4px",
          width: `${THUMB}px`,
          height: `${THUMB}px`,
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(4,0,51,0.25)",
          transform: `translateX(${dragX}px)`,
          transition: dragging ? "none" : "transform 0.25s ease",
          touchAction: "none",
          cursor: accepted ? "default" : dragging ? "grabbing" : "grab",
        }}
      >
        {accepted ? <CheckRounded sx={{ fontSize: 20, color: "#22C55E" }} /> : <ChevronRightRounded sx={{ fontSize: 22, color: "#1253FA" }} />}
      </div>
    </div>
  );
}
