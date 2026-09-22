import { useState, useRef, useCallback, useEffect } from "react";
import LocationOnRounded from "./icons/LocationOnRounded";
import CloseRounded from "./icons/CloseRounded";
import AddLocationAltRounded from "./icons/AddLocationAltRounded";
import InfoRounded from "./icons/InfoRounded";

/* ══════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════ */
export interface DropoffStop {
  id: string;
  address: string;
  label: string;
  notes?: string;
}

interface DropoffStopsProps {
  value: DropoffStop[];
  onChange: (stops: DropoffStop[]) => void;
}

/* ── helpers ── */
let _id = Date.now();
const uid = () => `stop_${++_id}`;

const SAMPLE_ADDRESSES = [
  { address: "Jebel Ali Free Zone, Gate 3", label: "Warehouse A" },
  { address: "Dubai Silicon Oasis, Bldg A1", label: "Tech Hub" },
  { address: "Al Quoz Industrial 4, Unit 12", label: "Storage Bay" },
  { address: "DAFZA, East Wing, Dock B", label: "Airport FZ" },
  { address: "Ras Al Khor Ind. 2, Plot 47", label: "Distribution" },
];

/* ══════════════════════════════════════════
   STOP CARD
   ══════════════════════════════════════════ */
function StopCard({
  stop,
  index,
  isActive,
  isDragging,
  onActivate,
  onRemove,
  onNotesChange,
  onDragStart,
  totalStops,
}: {
  stop: DropoffStop;
  index: number;
  isActive: boolean;
  isDragging: boolean;
  onActivate: () => void;
  onRemove: () => void;
  onNotesChange: (notes: string) => void;
  onDragStart: (e: React.PointerEvent) => void;
  totalStops: number;
}) {
  const isLast = index === totalStops - 1;

  return (
    <div
      className="relative"
      style={{
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
        zIndex: isDragging ? 50 : 1,
      }}
    >
      {/* Connector line to next stop */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: "27px",
            top: "72px",
            bottom: "-12px",
            width: "2px",
            backgroundColor: "#E8E8E5",
            zIndex: 0,
          }}
        />
      )}

      <div
        onClick={onActivate}
        className="relative flex items-stretch gap-0 cursor-pointer"
        style={{
          backgroundColor: isActive ? "white" : "white",
          borderRadius: "18px",
          boxShadow: isDragging
            ? "0 12px 40px rgba(4,0,51,0.15), 0 0 0 2px #1253FA"
            : isActive
              ? "0 4px 20px rgba(18,83,250,0.12), 0 0 0 2px #1253FA"
              : "0 2px 10px rgba(0,0,0,0.04)",
          overflow: "hidden",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: isDragging ? "scale(1.03)" : "scale(1)",
        }}
      >
        {/* ── Drag Handle ── */}
        <div
          className="flex flex-col items-center justify-center gap-1 flex-shrink-0 touch-none select-none"
          style={{
            width: "56px",
            cursor: isDragging ? "grabbing" : "grab",
            borderRight: "1px solid #F0F0EE",
          }}
          onPointerDown={onDragStart}
        >
          {/* Number badge */}
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: isActive ? "rgba(18,83,250,0.08)" : "rgba(107,114,128,0.08)",
              transition: "background-color 0.3s",
            }}
          >
            <span
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "14px",
                color: isActive ? "#1253FA" : "#6B7280",
                transition: "color 0.3s",
              }}
            >
              {index + 1}
            </span>
          </div>
          {/* Grip dots */}
          <div className="flex flex-col items-center gap-[3px]">
            <div className="flex gap-[3px]">
              <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
              <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
            </div>
            <div className="flex gap-[3px]">
              <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
              <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 py-4 pr-4 pl-3.5 flex flex-col min-w-0">
          {/* Label row */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 rounded-lg flex-shrink-0"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isActive ? "#1253FA" : "#6B7280",
                backgroundColor: isActive ? "rgba(18,83,250,0.06)" : "rgba(107,114,128,0.06)",
                transition: "all 0.3s",
              }}
            >
              {stop.label}
            </span>
            {index === 0 && (
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "10px",
                  color: "#6B7280",
                  backgroundColor: "#F0F0EE",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                First
              </span>
            )}
            {isLast && totalStops > 1 && (
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "10px",
                  color: "#6B7280",
                  backgroundColor: "#F0F0EE",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Final
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <LocationOnRounded
              className="flex-shrink-0"
              style={{ width: "14px", height: "14px", color: isActive ? "#1253FA" : "#040033" }}
            />
            <span
              className="truncate"
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#040033",
              }}
            >
              {stop.address}
            </span>
          </div>

          {/* Notes (expandable when active) */}
          <div
            className="overflow-hidden transition-all"
            style={{
              maxHeight: isActive ? "80px" : "0px",
              opacity: isActive ? 1 : 0,
              marginTop: isActive ? "10px" : "0px",
              transitionDuration: "0.35s",
              transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <input
              type="text"
              placeholder="Add drop-off notes…"
              value={stop.notes || ""}
              onChange={(e) => onNotesChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full outline-none"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "12px",
                color: "#040033",
                backgroundColor: "#F8F8F6",
                borderRadius: "12px",
                padding: "10px 14px",
                border: "1.5px solid transparent",
                caretColor: "#1253FA",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1253FA")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
          </div>
        </div>

        {/* ── Remove Button ── */}
        {totalStops > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex items-center justify-center flex-shrink-0 cursor-pointer transition-opacity hover:opacity-70 active:scale-90"
            style={{
              width: "44px",
              alignSelf: "stretch",
              borderLeft: "1px solid #F0F0EE",
              backgroundColor: "transparent",
              border: "none",
              borderLeftWidth: "1px",
              borderLeftStyle: "solid",
              borderLeftColor: "#F0F0EE",
            }}
          >
            <CloseRounded style={{ width: "16px", height: "16px", color: "#D1D5DB" }} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function DropoffStops({ value, onChange }: DropoffStopsProps) {
  const [activeId, setActiveId] = useState<string | null>(value[0]?.id || null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragItemIndex = useRef(-1);
  const cardHeight = useRef(0);

  /* ── Drag handlers via pointer events ── */
  const handleDragStart = useCallback(
    (id: string, index: number) => (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragId(id);
      dragStartY.current = e.clientY;
      dragItemIndex.current = index;
      setDragOffset(0);

      // measure card height
      if (listRef.current) {
        const cards = listRef.current.querySelectorAll<HTMLElement>("[data-stop-card]");
        if (cards[index]) {
          cardHeight.current = cards[index].offsetHeight + 12; // gap
        }
      }
    },
    []
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragId) return;
      const delta = e.clientY - dragStartY.current;
      setDragOffset(delta);
    },
    [dragId]
  );

  const handleDragEnd = useCallback(
    (_e: React.PointerEvent) => {
      if (!dragId || cardHeight.current === 0) {
        setDragId(null);
        setDragOffset(0);
        return;
      }

      const fromIndex = dragItemIndex.current;
      const movedSlots = Math.round(dragOffset / cardHeight.current);
      const toIndex = Math.max(0, Math.min(value.length - 1, fromIndex + movedSlots));

      if (fromIndex !== toIndex) {
        const next = [...value];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onChange(next);
      }

      setDragId(null);
      setDragOffset(0);
    },
    [dragId, dragOffset, value, onChange]
  );

  /* ── Add Stop ── */
  const addStop = () => {
    const used = value.length;
    const sample = SAMPLE_ADDRESSES[used % SAMPLE_ADDRESSES.length];
    const newStop: DropoffStop = {
      id: uid(),
      address: sample.address,
      label: sample.label,
    };
    onChange([...value, newStop]);
    setActiveId(newStop.id);
  };

  /* ── Remove Stop ── */
  const removeStop = (id: string) => {
    const next = value.filter((s) => s.id !== id);
    onChange(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
  };

  /* ── Calculate transforms for drag ── */
  const getTransform = (index: number) => {
    if (!dragId) return "translateY(0)";
    const dragIndex = value.findIndex((s) => s.id === dragId);
    if (index === dragIndex) return `translateY(${dragOffset}px)`;

    const movedSlots = Math.round(dragOffset / (cardHeight.current || 80));
    const targetIndex = Math.max(0, Math.min(value.length - 1, dragIndex + movedSlots));

    if (dragIndex < targetIndex && index > dragIndex && index <= targetIndex) {
      return `translateY(-${cardHeight.current}px)`;
    }
    if (dragIndex > targetIndex && index < dragIndex && index >= targetIndex) {
      return `translateY(${cardHeight.current}px)`;
    }
    return "translateY(0)";
  };

  const maxStops = 8;

  return (
    <div className="flex flex-col w-full">
      {/* ── Route summary ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5"
        style={{ backgroundColor: "rgba(18,83,250,0.05)" }}
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: "36px", height: "36px", backgroundColor: "rgba(18,83,250,0.1)" }}
        >
          <LocationOnRounded sx={{ fontSize: 18, color: "#1253FA" }} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#040033",
            }}
          >
            {value.length} Drop-off{value.length !== 1 ? "s" : ""}
          </span>
          <p
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "11px",
              color: "#9CA3AF",
              marginTop: "1px",
            }}
          >
            Drag to reorder priority • {maxStops - value.length} stops remaining
          </p>
        </div>
        {/* ETA chip */}
        <div
          className="px-3 py-1.5 rounded-xl flex-shrink-0"
          style={{ backgroundColor: "rgba(4,0,51,0.06)" }}
        >
          <span
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "12px",
              color: "#040033",
            }}
          >
            ~{value.length * 18 + 22} min
          </span>
        </div>
      </div>

      {/* ── Stop List ── */}
      <div
        ref={listRef}
        className="flex flex-col gap-3 relative"
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        {value.map((stop, i) => (
          <div
            key={stop.id}
            data-stop-card
            style={{
              transform: getTransform(i),
              transition: dragId
                ? stop.id === dragId
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.4,0,0.2,1)"
                : "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
              position: "relative",
              zIndex: stop.id === dragId ? 50 : 1,
            }}
          >
            <StopCard
              stop={stop}
              index={i}
              isActive={activeId === stop.id}
              isDragging={dragId === stop.id}
              onActivate={() => setActiveId(stop.id === activeId ? null : stop.id)}
              onRemove={() => removeStop(stop.id)}
              onNotesChange={(notes) => {
                const next = value.map((s) =>
                  s.id === stop.id ? { ...s, notes } : s
                );
                onChange(next);
              }}
              onDragStart={handleDragStart(stop.id, i)}
              totalStops={value.length}
            />
          </div>
        ))}
      </div>

      {/* ── Add Stop Button ── */}
      {value.length < maxStops && (
        <button
          onClick={addStop}
          className="w-full mt-4 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.97] transition-transform"
          style={{
            padding: "16px",
            borderRadius: "18px",
            border: "2px dashed #D8D9D4",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
          >
            <AddLocationAltRounded style={{ width: "14px", height: "14px", color: "#1253FA" }} />
          </div>
          <span
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#1253FA",
            }}
          >
            Add Stop
          </span>
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "11px",
              color: "#9CA3AF",
            }}
          >
            ({maxStops - value.length} left)
          </span>
        </button>
      )}

      {/* ── Max stops reached ── */}
      {value.length >= maxStops && (
        <div
          className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl"
          style={{ backgroundColor: "rgba(107,114,128,0.05)" }}
        >
          <InfoRounded sx={{ fontSize: 14, color: "#6B7280" }} />
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "12px",
              color: "#6B7280",
            }}
          >
            Maximum {maxStops} stops reached
          </span>
        </div>
      )}
    </div>
  );
}