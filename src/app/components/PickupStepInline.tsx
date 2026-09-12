import { useState, useRef, useCallback } from "react";

/* ── Types ── */
export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  icon: "warehouse" | "office" | "home" | "pin";
}

export interface AddedLocation {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
}

/* ── Mock data ── */
const SAVED_LOCATIONS: SavedLocation[] = [
  { id: "s1", name: "Main Warehouse", address: "Al Quoz Industrial Area 3, Dubai", icon: "warehouse" },
  { id: "s2", name: "Dubai Marina Office", address: "Marina Plaza, Tower A, Floor 12", icon: "office" },
  { id: "s3", name: "Jebel Ali Free Zone", address: "Jebel Ali FZ, Gate 5, South", icon: "warehouse" },
  { id: "s4", name: "Home Base", address: "Downtown Dubai, Burj Residences", icon: "home" },
];

const SEARCH_RESULTS = [
  { id: "r1", name: "Al Quoz Industrial Area 1", address: "Al Quoz, Dubai, UAE", lat: 25.1755, lng: 55.2362 },
  { id: "r2", name: "Dubai Investment Park", address: "DIP, Dubai, UAE", lat: 25.0042, lng: 55.1563 },
  { id: "r3", name: "DAFZA - Free Zone", address: "Dubai Airport Free Zone", lat: 25.2494, lng: 55.3656 },
  { id: "r4", name: "Business Bay", address: "Business Bay, Dubai, UAE", lat: 25.186, lng: 55.2626 },
];

/* ── Icon ── */
function LocationIcon({ type }: { type: SavedLocation["icon"] }) {
  if (type === "warehouse")
    return (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M2 8L9 3L16 8V15.5C16 15.78 15.78 16 15.5 16H2.5C2.22 16 2 15.78 2 15.5V8Z" stroke="#040033" strokeWidth="1.5" fill="none" />
        <path d="M6 16V10H12V16" stroke="#040033" strokeWidth="1.5" />
      </svg>
    );
  if (type === "office")
    return (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="#040033" strokeWidth="1.5" fill="none" />
        <rect x="6" y="5" width="2.5" height="2" rx="0.5" fill="#040033" />
        <rect x="9.5" y="5" width="2.5" height="2" rx="0.5" fill="#040033" />
      </svg>
    );
  if (type === "home")
    return (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M3 7.5L9 2.5L15 7.5V15C15 15.55 14.55 16 14 16H4C3.45 16 3 15.55 3 15V7.5Z" stroke="#040033" strokeWidth="1.5" fill="none" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M14 7C14 11 9 15.5 9 15.5C9 15.5 4 11 4 7C4 3.96 6.24 1.5 9 1.5C11.76 1.5 14 3.96 14 7Z" stroke="#040033" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="7" r="2" fill="#040033" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   PICKUP CARD (draggable)
   ══════════════════════════════════════════ */
function PickupCard({
  loc,
  index,
  isDragging,
  onRemove,
  onDragStart,
  totalPickups,
}: {
  loc: AddedLocation;
  index: number;
  isDragging: boolean;
  onRemove: () => void;
  onDragStart: (e: React.PointerEvent) => void;
  totalPickups: number;
}) {
  const isLast = index === totalPickups - 1;

  return (
    <div className="relative">
      {/* Connector line */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: "27px",
            top: "60px",
            bottom: "-12px",
            width: "2px",
            backgroundColor: "#E8E8E5",
            zIndex: 0,
          }}
        />
      )}

      <div
        className="relative flex items-stretch gap-0"
        style={{
          backgroundColor: "white",
          borderRadius: "18px",
          boxShadow: isDragging
            ? "0 12px 40px rgba(4,0,51,0.15), 0 0 0 2px #1253FA"
            : "0 2px 10px rgba(0,0,0,0.04)",
          overflow: "hidden",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
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
              backgroundColor: "rgba(4,0,51,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "14px",
                color: "#040033",
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
        <div className="flex-1 py-3.5 pr-4 pl-3.5 flex flex-col min-w-0 justify-center">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
              <path
                d="M7 1C4.51 1 2.5 3.01 2.5 5.5C2.5 8.75 7 13 7 13C7 13 11.5 8.75 11.5 5.5C11.5 3.01 9.49 1 7 1Z"
                stroke="#040033"
                strokeWidth="1.3"
                fill="none"
              />
              <circle cx="7" cy="5.5" r="1.5" fill="#040033" />
            </svg>
            <span
              className="truncate"
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                color: "#040033",
              }}
            >
              {loc.label}
            </span>
          </div>
          <p
            className="truncate mt-0.5 ml-[22px]"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "11px",
              color: "#9CA3AF",
            }}
          >
            {loc.address}
          </p>
        </div>

        {/* ── Remove Button ── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex items-center justify-center flex-shrink-0 cursor-pointer transition-opacity hover:opacity-70 active:scale-90"
          style={{
            width: "44px",
            alignSelf: "stretch",
            backgroundColor: "transparent",
            border: "none",
            borderLeft: "1px solid #F0F0EE",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function PickupStepInline({
  value,
  onChange,
}: {
  value: AddedLocation[];
  onChange: (v: AddedLocation[]) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  /* ── Drag state ── */
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragItemIndex = useRef(-1);
  const cardHeight = useRef(0);

  const addLocation = (loc: Omit<AddedLocation, "id">) => {
    onChange([...value, { ...loc, id: `loc-${Date.now()}-${Math.random()}` }]);
  };

  const removeLocation = (id: string) => {
    onChange(value.filter((l) => l.id !== id));
  };

  const useCurrentLocation = () => {
    addLocation({ label: "Current Location", address: "Auto-detected position", lat: 25.204849, lng: 55.270783 });
  };

  const addFromSaved = (s: SavedLocation) => {
    const coords: Record<string, [number, number]> = {
      s1: [25.175, 55.236],
      s2: [25.08, 55.139],
      s3: [25.021, 55.098],
      s4: [25.197, 55.274],
    };
    const [lat, lng] = coords[s.id] || [25.2, 55.27];
    addLocation({ label: s.name, address: s.address, lat, lng });
    setShowSaved(false);
  };

  const addFromSearch = (r: (typeof SEARCH_RESULTS)[0]) => {
    addLocation({ label: r.name, address: r.address, lat: r.lat, lng: r.lng });
    setSearchValue("");
  };

  const filteredResults = searchValue.length > 0
    ? SEARCH_RESULTS.filter(
        (r) =>
          r.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          r.address.toLowerCase().includes(searchValue.toLowerCase())
      )
    : SEARCH_RESULTS;

  /* ── Drag handlers ── */
  const handleDragStart = useCallback(
    (id: string, index: number) => (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragId(id);
      dragStartY.current = e.clientY;
      dragItemIndex.current = index;
      setDragOffset(0);

      if (listRef.current) {
        const cards = listRef.current.querySelectorAll<HTMLElement>("[data-pickup-card]");
        if (cards[index]) {
          cardHeight.current = cards[index].offsetHeight + 12;
        }
      }
    },
    []
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragId) return;
      setDragOffset(e.clientY - dragStartY.current);
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

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4"
        style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", height: "48px" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.6" fill="none" />
          <path d="M11 11L14 14" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search pickup location..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 border-none outline-none bg-transparent"
          style={{ fontFamily: "'Archivo', sans-serif", fontSize: "14px", color: "#040033", caretColor: "#1253FA" }}
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: "#F0F0EE" }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="#040033" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {searchValue && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          {filteredResults.map((r) => (
            <button
              key={r.id}
              onClick={() => addFromSearch(r)}
              className="flex items-center gap-3 w-full px-4 py-3 cursor-pointer active:bg-[#F5F5F3] transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F5F5F3" }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M11 5.5C11 8.5 7 12.5 7 12.5C7 12.5 3 8.5 3 5.5C3 3.01 4.79 1 7 1C9.21 1 11 3.01 11 5.5Z" stroke="#9CA3AF" strokeWidth="1.3" fill="none" />
                  <circle cx="7" cy="5.5" r="1.5" fill="#9CA3AF" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{r.name}</p>
                <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>{r.address}</p>
              </div>
            </button>
          ))}
          {filteredResults.length === 0 && (
            <p className="px-4 py-4 text-center" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>No results found</p>
          )}
        </div>
      )}

      {/* Added locations with drag-to-reorder */}
      {value.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Added ({value.length})
            </span>
            {value.length > 1 && (
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
                Drag to reorder
              </span>
            )}
          </div>
          <div
            ref={listRef}
            className="flex flex-col gap-3 relative"
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            {value.map((loc, i) => (
              <div
                key={loc.id}
                data-pickup-card
                style={{
                  transform: getTransform(i),
                  transition: dragId
                    ? loc.id === dragId
                      ? "none"
                      : "transform 0.3s cubic-bezier(0.4,0,0.2,1)"
                    : "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                  position: "relative",
                  zIndex: loc.id === dragId ? 50 : 1,
                }}
              >
                <PickupCard
                  loc={loc}
                  index={i}
                  isDragging={dragId === loc.id}
                  onRemove={() => removeLocation(loc.id)}
                  onDragStart={handleDragStart(loc.id, i)}
                  totalPickups={value.length}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Use current location */}
      <button
        onClick={useCurrentLocation}
        className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
        style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(18,83,250,0.08)" }}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3" fill="#1253FA" />
            <circle cx="9" cy="9" r="7" stroke="#1253FA" strokeWidth="1.5" fill="none" />
            <path d="M9 1V3.5M9 14.5V17M1 9H3.5M14.5 9H17" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>Use current location</span>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>Auto-detect your position</p>
        </div>
      </button>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#E8E8E5" }} />

      {/* Saved locations */}
      <button onClick={() => setShowSaved(!showSaved)} className="flex items-center justify-between w-full cursor-pointer">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2Z" stroke="#040033" strokeWidth="1.4" fill="none" />
            <path d="M5 2V6L8 4.5L11 6V2" stroke="#040033" strokeWidth="1.4" fill="none" />
          </svg>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>Saved Locations</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ transform: showSaved ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <path d="M5 3L9 7L5 11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showSaved && (
        <div className="flex flex-col gap-2">
          {SAVED_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => addFromSaved(loc)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform text-left"
              style={{ backgroundColor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F5F5F3" }}>
                <LocationIcon type={loc.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{loc.name}</p>
                <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>{loc.address}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="#D8D9D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}