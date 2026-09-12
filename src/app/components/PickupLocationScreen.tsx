import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";

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

/* ── Mock saved locations ── */
const SAVED_LOCATIONS: SavedLocation[] = [
  { id: "s1", name: "Main Warehouse", address: "Al Quoz Industrial Area 3, Dubai", icon: "warehouse" },
  { id: "s2", name: "Dubai Marina Office", address: "Marina Plaza, Tower A, Floor 12", icon: "office" },
  { id: "s3", name: "Jebel Ali Free Zone", address: "Jebel Ali FZ, Gate 5, South", icon: "warehouse" },
  { id: "s4", name: "Home Base", address: "Downtown Dubai, Burj Residences", icon: "home" },
];

/* ── Mock search results ── */
const SEARCH_RESULTS = [
  { id: "r1", name: "Al Quoz Industrial Area 1", address: "Al Quoz, Dubai, UAE", lat: 25.1755, lng: 55.2362 },
  { id: "r2", name: "Dubai Investment Park", address: "DIP, Dubai, UAE", lat: 25.0042, lng: 55.1563 },
  { id: "r3", name: "DAFZA - Free Zone", address: "Dubai Airport Free Zone", lat: 25.2494, lng: 55.3656 },
  { id: "r4", name: "Business Bay", address: "Business Bay, Dubai, UAE", lat: 25.1860, lng: 55.2626 },
];

/* ── Icon SVGs ── */
function LocationIcon({ type }: { type: SavedLocation["icon"] }) {
  if (type === "warehouse")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 8L9 3L16 8V15.5C16 15.78 15.78 16 15.5 16H2.5C2.22 16 2 15.78 2 15.5V8Z" stroke="#040033" strokeWidth="1.5" fill="none" />
        <path d="M6 16V10H12V16" stroke="#040033" strokeWidth="1.5" />
        <path d="M6 13H12" stroke="#040033" strokeWidth="1.2" />
      </svg>
    );
  if (type === "office")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="#040033" strokeWidth="1.5" fill="none" />
        <rect x="6" y="5" width="2.5" height="2" rx="0.5" fill="#040033" />
        <rect x="9.5" y="5" width="2.5" height="2" rx="0.5" fill="#040033" />
        <rect x="6" y="9" width="2.5" height="2" rx="0.5" fill="#040033" />
        <rect x="9.5" y="9" width="2.5" height="2" rx="0.5" fill="#040033" />
        <path d="M7.5 16V13H10.5V16" stroke="#040033" strokeWidth="1.3" />
      </svg>
    );
  if (type === "home")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 7.5L9 2.5L15 7.5V15C15 15.55 14.55 16 14 16H4C3.45 16 3 15.55 3 15V7.5Z" stroke="#040033" strokeWidth="1.5" fill="none" />
        <path d="M7 16V11H11V16" stroke="#040033" strokeWidth="1.5" />
      </svg>
    );
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M14 7C14 11 9 15.5 9 15.5C9 15.5 4 11 4 7C4 3.96 6.24 1.5 9 1.5C11.76 1.5 14 3.96 14 7Z" stroke="#040033" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="7" r="2" fill="#040033" />
    </svg>
  );
}

/* ── Draggable Leaflet Map with center tracking ── */
function DraggableMap({
  onCenterChange,
  markers,
}: {
  onCenterChange: (lat: number, lng: number) => void;
  markers: AddedLocation[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current, {
      center: [25.204849, 55.270783],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);
    mapInstance.current = map;

    const handleMove = () => {
      const c = map.getCenter();
      onCenterChange(c.lat, c.lng);
    };
    map.on("moveend", handleMove);
    handleMove();

    return () => {
      map.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const markerGroup = L.layerGroup().addTo(map);

    markers.forEach((loc, i) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:28px;border-radius:50%;
          background:#040033;border:3px solid white;
          box-shadow:0 2px 10px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          color:white;font-family:'Archivo',sans-serif;font-weight:700;font-size:12px;
        ">${i + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([loc.lat, loc.lng], { icon }).addTo(markerGroup);
    });

    return () => {
      markerGroup.clearLayers();
      map.removeLayer(markerGroup);
    };
  }, [markers]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

/* ── Center Pin Overlay ── */
function CenterPin() {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -100%)",
      }}
    >
      {/* Pin shadow */}
      <div
        className="absolute"
        style={{
          width: "12px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "rgba(18,83,250,0.25)",
          bottom: "-4px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      {/* Pin body */}
      <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
        <path
          d="M18 0C8.06 0 0 7.82 0 17.47C0 30.57 18 48 18 48C18 48 36 30.57 36 17.47C36 7.82 27.94 0 18 0Z"
          fill="#1253FA"
        />
        <circle cx="18" cy="17" r="7" fill="white" />
        <circle cx="18" cy="17" r="3.5" fill="white" />
      </svg>
    </div>
  );
}

/* ── Search Bar ── */
function SearchBar({
  value,
  onChange,
  onFocus,
  onBack,
  focused,
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBack: () => void;
  focused: boolean;
}) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 px-4 md:px-6"
      style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)" }}
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-4"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          height: "52px",
        }}
      >
        {/* Back / Menu button */}
        <button
          onClick={onBack}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          {focused ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M12 3L6 9L12 15" stroke="#040033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#040033" strokeWidth="1.6" fill="none" />
              <path d="M11 11L14 14" stroke="#040033" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <input
          type="text"
          placeholder="Search pickup location..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="flex-1 border-none outline-none bg-transparent"
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "15px",
            color: "#040033",
            caretColor: "#1253FA",
          }}
        />

        {value && (
          <button
            onClick={() => onChange("")}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: "#F0F0EE" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Use Current Location Button ── */
function CurrentLocationButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
      style={{
        backgroundColor: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3" fill="#1253FA" />
          <circle cx="9" cy="9" r="7" stroke="#1253FA" strokeWidth="1.5" fill="none" />
          <path d="M9 1V3.5" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 14.5V17" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1 9H3.5" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14.5 9H17" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1 text-left">
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
          Use current location
        </span>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
          Auto-detect your position
        </p>
      </div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3L9 7L5 11" stroke="#C8C8C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ── Added Location Row ── */
function AddedLocationRow({
  location,
  index,
  onRemove,
}: {
  location: AddedLocation;
  index: number;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#040033" }}
      >
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", color: "white" }}>
          {index + 1}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}
        >
          {location.label}
        </p>
        <p
          className="truncate"
          style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}
        >
          {location.address}
        </p>
      </div>
      <button
        onClick={() => onRemove(location.id)}
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "#FEF0ED" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 3L9 9M9 3L3 9" stroke="#FF4310" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ── Saved Location Row ── */
function SavedLocationRow({
  location,
  onSelect,
}: {
  location: SavedLocation;
  onSelect: (loc: SavedLocation) => void;
}) {
  return (
    <button
      onClick={() => onSelect(location)}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform text-left"
      style={{ backgroundColor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#F5F5F3" }}
      >
        <LocationIcon type={location.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}
        >
          {location.name}
        </p>
        <p
          className="truncate"
          style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}
        >
          {location.address}
        </p>
      </div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3L9 7L5 11" stroke="#D8D9D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ── Search Result Row ── */
function SearchResultRow({
  result,
  onSelect,
}: {
  result: (typeof SEARCH_RESULTS)[0];
  onSelect: (r: (typeof SEARCH_RESULTS)[0]) => void;
}) {
  return (
    <button
      onClick={() => onSelect(result)}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl cursor-pointer active:bg-[#F5F5F3] transition-colors text-left"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#F5F5F3" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 5.5C11 8.5 7 12.5 7 12.5C7 12.5 3 8.5 3 5.5C3 3.01 4.79 1 7 1C9.21 1 11 3.01 11 5.5Z" stroke="#9CA3AF" strokeWidth="1.3" fill="none" />
          <circle cx="7" cy="5.5" r="1.5" fill="#9CA3AF" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
          {result.name}
        </p>
        <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
          {result.address}
        </p>
      </div>
    </button>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PICKUP LOCATION SCREEN
   ════════════════════════════════════════════════════════ */
export default function PickupLocationScreen({
  onConfirm,
  onBack,
  isMobile,
}: {
  onConfirm: (locations: AddedLocation[]) => void;
  onBack: () => void;
  isMobile: boolean;
}) {
  const [locations, setLocations] = useState<AddedLocation[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 25.204849, lng: 55.270783 });
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleCenterChange = useCallback((lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  }, []);

  const addCurrentPin = () => {
    const newLoc: AddedLocation = {
      id: `loc-${Date.now()}`,
      label: `Pickup ${locations.length + 1}`,
      address: `${mapCenter.lat.toFixed(4)}°N, ${mapCenter.lng.toFixed(4)}°E`,
      lat: mapCenter.lat,
      lng: mapCenter.lng,
    };
    setLocations((prev) => [...prev, newLoc]);
  };

  const addFromSaved = (saved: SavedLocation) => {
    const coords: Record<string, [number, number]> = {
      s1: [25.175, 55.236],
      s2: [25.080, 55.139],
      s3: [25.021, 55.098],
      s4: [25.197, 55.274],
    };
    const [lat, lng] = coords[saved.id] || [25.2, 55.27];
    const newLoc: AddedLocation = {
      id: `loc-${Date.now()}`,
      label: saved.name,
      address: saved.address,
      lat,
      lng,
    };
    setLocations((prev) => [...prev, newLoc]);
    setShowSaved(false);
  };

  const addFromSearch = (result: (typeof SEARCH_RESULTS)[0]) => {
    const newLoc: AddedLocation = {
      id: `loc-${Date.now()}`,
      label: result.name,
      address: result.address,
      lat: result.lat,
      lng: result.lng,
    };
    setLocations((prev) => [...prev, newLoc]);
    setSearchValue("");
    setSearchFocused(false);
  };

  const removeLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const useCurrentLocation = () => {
    const newLoc: AddedLocation = {
      id: `loc-${Date.now()}`,
      label: "Current Location",
      address: "Auto-detected position",
      lat: 25.204849,
      lng: 55.270783,
    };
    setLocations((prev) => [...prev, newLoc]);
  };

  const filteredResults = searchValue.length > 0
    ? SEARCH_RESULTS.filter(
        (r) =>
          r.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          r.address.toLowerCase().includes(searchValue.toLowerCase())
      )
    : SEARCH_RESULTS;

  /* ── Panel content (shared between mobile bottom sheet and desktop side panel) ── */
  const panelContent = (
    <>
      {/* Added locations */}
      {locations.length > 0 && (
        <div className="mb-3">
          <span
            className="block mb-2"
            style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            Added Locations ({locations.length})
          </span>
          <div className="flex flex-col gap-2">
            {locations.map((loc, i) => (
              <AddedLocationRow key={loc.id} location={loc} index={i} onRemove={removeLocation} />
            ))}
          </div>
        </div>
      )}

      {/* Add from map button */}
      <button
        onClick={addCurrentPin}
        className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform mb-3"
        style={{
          backgroundColor: "rgba(18,83,250,0.06)",
          border: "1.5px dashed rgba(18,83,250,0.3)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(18,83,250,0.12)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="#1253FA" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#1253FA" }}>
          Add pin location
        </span>
      </button>

      {/* Use current location */}
      <CurrentLocationButton onClick={useCurrentLocation} />

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#E8E8E5", margin: "16px 0" }} />

      {/* Saved locations toggle */}
      <button
        onClick={() => setShowSaved(!showSaved)}
        className="flex items-center justify-between w-full mb-3 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2Z" stroke="#040033" strokeWidth="1.4" fill="none" />
            <path d="M5 2V6L8 4.5L11 6V2" stroke="#040033" strokeWidth="1.4" fill="none" />
          </svg>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
            Saved Locations
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ transform: showSaved ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <path d="M5 3L9 7L5 11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showSaved && (
        <div className="flex flex-col gap-2 mb-3">
          {SAVED_LOCATIONS.map((loc) => (
            <SavedLocationRow key={loc.id} location={loc} onSelect={addFromSaved} />
          ))}
        </div>
      )}
    </>
  );

  /* ── Search overlay ── */
  const searchOverlay = searchFocused && (
    <div
      className="absolute inset-0 z-40 flex flex-col"
      style={{ backgroundColor: "#F5F5F3" }}
    >
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        onFocus={() => {}}
        onBack={() => {
          setSearchFocused(false);
          setSearchValue("");
        }}
        focused={true}
      />
      <div
        className="flex-1 overflow-y-auto px-4"
        style={{ paddingTop: "max(calc(env(safe-area-inset-top, 12px) + 64px), 76px)" }}
      >
        {/* Quick actions in search */}
        <CurrentLocationButton onClick={() => { useCurrentLocation(); setSearchFocused(false); setSearchValue(""); }} />

        <div style={{ height: "1px", backgroundColor: "#E8E8E5", margin: "12px 0" }} />

        <span
          className="block mb-2"
          style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          {searchValue ? "Search Results" : "Suggestions"}
        </span>

        <div className="flex flex-col gap-1">
          {filteredResults.map((r) => (
            <SearchResultRow
              key={r.id}
              result={r}
              onSelect={(res) => { addFromSearch(res); }}
            />
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="18" r="10" stroke="#D8D9D4" strokeWidth="2" fill="none" />
              <path d="M27 25L34 32" stroke="#D8D9D4" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="mt-3" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF" }}>
              No locations found
            </p>
          </div>
        )}
      </div>
    </div>
  );

  /* ═══════════ DESKTOP ═══════════ */
  if (!isMobile) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: "100dvh", backgroundColor: "#F5F5F3" }}>
        <div className="absolute inset-0 z-0">
          <DraggableMap onCenterChange={handleCenterChange} markers={locations} />
        </div>
        <CenterPin />

        {/* Search bar — positioned to the right of the panel */}
        {!searchFocused && (
          <div
            className="absolute z-30"
            style={{
              top: "max(env(safe-area-inset-top, 12px), 12px)",
              left: "min(444px, calc(35vw + 24px))",
              right: "16px",
              maxWidth: "420px",
            }}
          >
            <div
              className="flex items-center gap-3 rounded-2xl px-4 cursor-text"
              style={{ backgroundColor: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "48px" }}
              onClick={() => setSearchFocused(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#040033" strokeWidth="1.6" fill="none" />
                <path d="M11 11L14 14" stroke="#040033" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "14px", color: "#9CA3AF" }}>
                Search pickup location...
              </span>
            </div>
          </div>
        )}

        {/* Location FAB */}
        <div className="absolute z-10" style={{ right: "16px", bottom: "32px" }}>
          <button className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(0,0,0,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M16 9L2 2L5 9L2 16L16 9Z" fill="#1253FA" /></svg>
          </button>
        </div>

        {/* Side Panel */}
        <div
          className="absolute top-0 left-0 bottom-0 z-20 flex flex-col"
          style={{
            width: "min(420px, 35vw)",
            minWidth: "340px",
            backgroundColor: "rgba(245,245,243,0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "4px 0 30px rgba(0,0,0,0.06)",
            padding: "24px",
            paddingTop: "max(env(safe-area-inset-top, 24px), 40px)",
          }}
        >
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 mb-4 cursor-pointer active:opacity-70 transition-opacity flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#1253FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1253FA" }}>Back</span>
          </button>

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="rounded-full transition-all duration-300" style={{ width: s <= 3 ? "24px" : "8px", height: "8px", backgroundColor: s <= 3 ? "#1253FA" : "#D8D9D4" }} />
              ))}
            </div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, color: "#1253FA", fontSize: "12px", letterSpacing: "0.08em" }}>STEP 3 / 4</span>
          </div>

          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033", lineHeight: "1.15" }} className="flex-shrink-0">
            Pickup Locations
          </h1>
          <p className="mt-1 flex-shrink-0" style={{ fontFamily: "'Courier Prime', monospace", color: "#9CA3AF", fontSize: "13px" }}>
            Set one or more pickup points for your shipment.
          </p>
          <div className="flex-shrink-0" style={{ height: "1px", backgroundColor: "#E8E8E5", margin: "20px 0" }} />

          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {panelContent}
          </div>

          <div className="flex-shrink-0 pt-3 pb-2">
            <button
              onClick={() => locations.length > 0 && onConfirm(locations)}
              className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform cursor-pointer"
              style={{
                backgroundColor: locations.length > 0 ? "#040033" : "#D8D9D4",
                boxShadow: locations.length > 0 ? "0 4px 20px rgba(4,0,51,0.25)" : "none",
                padding: "18px",
                pointerEvents: locations.length > 0 ? "auto" : "none",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "white", letterSpacing: "0.02em" }}>
                Confirm {locations.length > 0 ? `${locations.length} Location${locations.length > 1 ? "s" : ""}` : "Locations"}
              </span>
            </button>
          </div>
        </div>

        {searchOverlay}
      </div>
    );
  }

  /* ═══════════ MOBILE ═══════════ */
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "100dvh", backgroundColor: "#F5F5F3" }}>
      <div className="absolute inset-0 z-0">
        <DraggableMap onCenterChange={handleCenterChange} markers={locations} />
      </div>
      <CenterPin />

      {/* Top search bar */}
      {!searchFocused && (
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onFocus={() => setSearchFocused(true)}
          onBack={onBack}
          focused={false}
        />
      )}

      {/* Location FAB */}
      {!searchFocused && (
        <div
          className="absolute z-10"
          style={{ right: "16px", bottom: `calc(50% + 24px)`, transition: "bottom 0.35s cubic-bezier(0.4,0,0.2,1)" }}
        >
          <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(0,0,0,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M16 9L2 2L5 9L2 16L16 9Z" fill="#1253FA" /></svg>
          </button>
        </div>
      )}

      {/* Bottom sheet — fixed at ~50% */}
      {!searchFocused && (
        <div
          className="absolute left-0 right-0 z-20"
          style={{
            bottom: 0,
            height: "50dvh",
            borderRadius: "24px 24px 0 0",
            backgroundColor: "rgba(245,245,243,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-9 h-1 rounded-full" style={{ backgroundColor: "#C8C8C5" }} />
          </div>

          {/* Header */}
          <div className="px-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033", lineHeight: "1.2" }}>
                Pickup Locations
              </h2>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
                STEP 3 / 4
              </span>
            </div>
            <p style={{ fontFamily: "'Courier Prime', monospace", color: "#9CA3AF", fontSize: "12px", marginBottom: "12px" }}>
              Set one or more pickup points.
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4" style={{ minHeight: 0 }}>
            {panelContent}
            <div style={{ height: "8px" }} />
          </div>

          {/* Sticky CTA */}
          <div
            className="flex-shrink-0 px-4 pt-3"
            style={{
              paddingBottom: "max(env(safe-area-inset-bottom, 20px), 20px)",
              borderTop: "1px solid rgba(232,232,229,0.6)",
              backgroundColor: "rgba(245,245,243,0.98)",
            }}
          >
            <button
              onClick={() => locations.length > 0 && onConfirm(locations)}
              className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform cursor-pointer"
              style={{
                backgroundColor: locations.length > 0 ? "#040033" : "#D8D9D4",
                boxShadow: locations.length > 0 ? "0 4px 20px rgba(4,0,51,0.25)" : "none",
                padding: "16px",
                pointerEvents: locations.length > 0 ? "auto" : "none",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>
                Confirm {locations.length > 0 ? `${locations.length} Location${locations.length > 1 ? "s" : ""}` : "Locations"}
              </span>
            </button>
          </div>
        </div>
      )}

      {searchOverlay}
    </div>
  );
}