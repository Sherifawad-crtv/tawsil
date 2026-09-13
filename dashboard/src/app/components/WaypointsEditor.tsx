import { useState } from "react";
import { AddIcon, TrashBinTrashIcon, AltArrowUpIcon, AltArrowDownIcon, MapPointIcon, BookmarkIcon } from "@solar-icons/react/linear";
import { TextField, SelectField } from "./FormField";
import { SAVED_LOCATIONS } from "../lib/entities";
import type { Waypoint } from "../lib/types";

let wpCounter = 0;
function newWaypoint(type: "Pickup" | "Dropoff"): Waypoint {
  wpCounter += 1;
  return { id: `new-wp-${Date.now()}-${wpCounter}`, name: "", type, address: "", lat: 0, lng: 0 };
}

function parseGoogleMapsLink(link: string): { lat: number; lng: number } | null {
  // Stub: real implementation would resolve the shortlink/parse @lat,lng from the URL.
  const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  return null;
}

export default function WaypointsEditor({
  value,
  onChange,
  clientId,
  required = true,
}: {
  value: Waypoint[];
  onChange: (waypoints: Waypoint[]) => void;
  clientId?: string;
  required?: boolean;
}) {
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const hasPickup = value.some((w) => w.type === "Pickup");
  const hasDropoff = value.some((w) => w.type === "Dropoff");
  const bookmarks = clientId ? SAVED_LOCATIONS.filter((l) => l.clientId === clientId) : [];

  function update(id: string, patch: Partial<Waypoint>) {
    onChange(value.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }
  function remove(id: string) {
    onChange(value.filter((w) => w.id !== id));
  }
  function move(id: string, dir: -1 | 1) {
    const idx = value.findIndex((w) => w.id === id);
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }
  function addBookmark(locId: string) {
    const loc = SAVED_LOCATIONS.find((l) => l.id === locId);
    if (!loc) return;
    onChange([
      ...value,
      { id: `new-wp-${Date.now()}`, name: loc.name, type: hasPickup ? "Dropoff" : "Pickup", address: loc.address, lat: loc.lat, lng: loc.lng, contactName: loc.contactName, contactPhone: loc.contactPhone },
    ]);
    setBookmarksOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {required && !hasPickup && (
        <div className="text-xs text-status-cancelled px-3 py-2 rounded-lg bg-[#FDECEC]">At least one Pickup waypoint is required.</div>
      )}
      {required && !hasDropoff && (
        <div className="text-xs text-status-cancelled px-3 py-2 rounded-lg bg-[#FDECEC]">At least one Dropoff waypoint is required.</div>
      )}

      {value.map((wp, i) => (
        <div key={wp.id} className="rounded-2lg border border-border p-4 bg-grey-light/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <MapPointIcon size={14} className={wp.type === "Pickup" ? "text-navy" : "text-blue"} />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                Waypoint {i + 1}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(wp.id, -1)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                <AltArrowUpIcon size={14} />
              </button>
              <button type="button" onClick={() => move(wp.id, 1)} disabled={i === value.length - 1} className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                <AltArrowDownIcon size={14} />
              </button>
              <button type="button" onClick={() => remove(wp.id)} className="p-1.5 rounded-lg hover:bg-[#FDECEC] text-status-cancelled cursor-pointer">
                <TrashBinTrashIcon size={14} />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Name" required value={wp.name} onChange={(e) => update(wp.id, { name: e.target.value })} />
            <SelectField label="Type" required value={wp.type} onChange={(e) => update(wp.id, { type: e.target.value as "Pickup" | "Dropoff" })}>
              <option value="Pickup">Pickup</option>
              <option value="Dropoff">Dropoff</option>
            </SelectField>
            <div className="sm:col-span-2">
              <TextField label="Address" required value={wp.address} onChange={(e) => update(wp.id, { address: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Paste Google Maps Link"
                placeholder="https://maps.google.com/...@30.0444,31.2357,..."
                onBlur={(e) => {
                  const coords = parseGoogleMapsLink(e.target.value);
                  if (coords) update(wp.id, coords);
                }}
              />
            </div>
            <TextField label="Latitude" required type="number" step="0.0001" value={wp.lat || ""} onChange={(e) => update(wp.id, { lat: parseFloat(e.target.value) || 0 })} />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Longitude" required type="number" step="0.0001" value={wp.lng || ""} onChange={(e) => update(wp.id, { lng: parseFloat(e.target.value) || 0 })} />
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-2lg border border-border bg-white text-xs font-semibold text-navy cursor-pointer hover:border-blue/40 flex-shrink-0"
                title="Pick on Map (coming soon)"
              >
                Pick on Map
              </button>
            </div>
            <TextField label="Contact Name" value={wp.contactName ?? ""} onChange={(e) => update(wp.id, { contactName: e.target.value })} />
            <TextField label="Contact Phone" value={wp.contactPhone ?? ""} onChange={(e) => update(wp.id, { contactPhone: e.target.value })} />
            <div className="sm:col-span-2">
              <TextField label="Special Instructions" value={wp.specialInstructions ?? ""} onChange={(e) => update(wp.id, { specialInstructions: e.target.value })} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 flex-wrap relative">
        <button
          type="button"
          onClick={() => onChange([...value, newWaypoint(hasPickup ? "Dropoff" : "Pickup")])}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2lg bg-navy text-white text-xs font-semibold cursor-pointer hover:bg-royal"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          <AddIcon size={14} /> Add Waypoint
        </button>
        {bookmarks.length > 0 && (
          <button
            type="button"
            onClick={() => setBookmarksOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2lg border border-border bg-white text-xs font-semibold text-navy cursor-pointer hover:border-blue/40"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            <BookmarkIcon size={14} /> Load from Bookmarks
          </button>
        )}
        {bookmarksOpen && (
          <div className="absolute top-full left-0 mt-1 w-72 rounded-2lg border border-border bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
            {bookmarks.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => addBookmark(loc.id)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-grey-light cursor-pointer border-b border-border last:border-b-0"
              >
                <div className="text-sm font-medium text-navy">{loc.name}</div>
                <div className="text-xs text-muted truncate">{loc.address}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
