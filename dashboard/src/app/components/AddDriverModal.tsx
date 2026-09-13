import { useState } from "react";
import Modal from "./Modal";
import { TextField } from "./FormField";
import FileUploadField from "./FileUploadField";
import { useDataStore } from "../lib/store";

export default function AddDriverModal({ contractorId, onClose }: { contractorId: string; onClose: () => void }) {
  const { addDriver } = useDataStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", licenseNumber: "", licenseExpiry: "" });
  const canSubmit = form.name && form.email && form.phone && form.licenseNumber && form.licenseExpiry;

  function handleSubmit() {
    addDriver({
      id: `drv-new-${Date.now()}`,
      contractorId,
      ...form,
      rating: 5.0,
      totalTrips: 0,
      active: true,
    });
    onClose();
  }

  return (
    <Modal
      title="Add Driver"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-[var(--radius-control)] border border-border text-sm font-semibold text-navy cursor-pointer hover:bg-grey-light" style={{ fontFamily: "var(--font-sub)" }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            Add Driver
          </button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <TextField label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <TextField label="Email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <TextField label="Phone" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <TextField label="License Number" required value={form.licenseNumber} onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))} />
        <TextField label="License Expiry" required type="date" value={form.licenseExpiry} onChange={(e) => setForm((f) => ({ ...f, licenseExpiry: e.target.value }))} />
        <FileUploadField label="License File" />
        <FileUploadField label="National ID File" />
      </div>
    </Modal>
  );
}
