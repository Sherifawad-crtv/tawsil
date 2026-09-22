import { useState, useRef, useCallback } from "react";
import WarehouseRounded from "@mui/icons-material/WarehouseRounded";
import BusinessRounded from "@mui/icons-material/BusinessRounded";
import HomeBlendedRounded from "./icons/HomeBlendedRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import MyLocationRounded from "@mui/icons-material/MyLocationRounded";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

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
  if (type === "warehouse") return <WarehouseRounded sx={{ fontSize: 16, color: "#040033" }} />;
  if (type === "office") return <BusinessRounded sx={{ fontSize: 16, color: "#040033" }} />;
  if (type === "home") return <HomeBlendedRounded sx={{ fontSize: 16, color: "#040033" }} />;
  return <LocationOnRounded sx={{ fontSize: 16, color: "#040033" }} />;
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
            <LocationOnRounded sx={{ fontSize: 14, color: "#040033" }} className="flex-shrink-0" />
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
          <CloseRounded sx={{ fontSize: 16, color: "#D1D5DB" }} />
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
        <SearchRounded sx={{ fontSize: 16, color: "#9CA3AF" }} />
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
            <CloseRounded sx={{ fontSize: 10, color: "#040033" }} />
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
                <LocationOnRounded sx={{ fontSize: 12, color: "#9CA3AF" }} />
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
          <MyLocationRounded sx={{ fontSize: 16, color: "#1253FA" }} />
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
          <BookmarkBorderRounded sx={{ fontSize: 14, color: "#040033" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>Saved Locations</span>
        </div>
        <ChevronRightRounded sx={{ fontSize: 12, color: "#9CA3AF", transform: showSaved ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
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
              <ChevronRightRounded sx={{ fontSize: 12, color: "#9CA3AF" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}