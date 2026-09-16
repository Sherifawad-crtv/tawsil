import { useState } from "react";
import { Button } from "./Button";
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
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add Driver
          </Button>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
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
