import { useState } from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import { TextField } from "./FormField";
import { useDataStore } from "../lib/store";

function parseGoogleMapsLink(link: string): { lat: number; lng: number } | null {
  const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  return null;
}

export default function AddLocationModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const { addSavedLocation } = useDataStore();
  const [form, setForm] = useState({ name: "", address: "", lat: "", lng: "", tags: "", contactName: "", contactPhone: "" });
  const canSubmit = form.name && form.address;

  function handleSubmit() {
    addSavedLocation({
      id: `loc-new-${Date.now()}`,
      clientId,
      name: form.name,
      address: form.address,
      lat: parseFloat(form.lat) || 0,
      lng: parseFloat(form.lng) || 0,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      contactName: form.contactName || undefined,
      contactPhone: form.contactPhone || undefined,
    });
    onClose();
  }

  return (
    <Modal
      title="Add Location"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add Location
          </Button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <TextField label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <TextField label="Address" required value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <TextField
            label="Paste Google Maps Link"
            placeholder="https://maps.google.com/...@30.0444,31.2357,..."
            onBlur={(e) => {
              const coords = parseGoogleMapsLink(e.target.value);
              if (coords) setForm((f) => ({ ...f, lat: String(coords.lat), lng: String(coords.lng) }));
            }}
          />
        </div>
        <TextField label="Latitude" type="number" step="0.0001" value={form.lat} onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))} />
        <TextField label="Longitude" type="number" step="0.0001" value={form.lng} onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))} />
        <div className="sm:col-span-2">
          <TextField label="Tags" placeholder="Warehouse, Frequent Pickup" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
        </div>
        <TextField label="Contact Name" value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} />
        <TextField label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} />
      </div>
    </Modal>
  );
}
