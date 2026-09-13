import { useState } from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import { TextField, SelectField } from "./FormField";
import FileUploadField from "./FileUploadField";
import { useDataStore } from "../lib/store";
import { TRUCK_TYPES, truckTypeLabel } from "../lib/constants";

export default function AddVehicleModal({ contractorId, onClose }: { contractorId: string; onClose: () => void }) {
  const { addVehicle } = useDataStore();
  const [form, setForm] = useState({ truckTypeId: "", plateNumber: "", licenseExpiry: "" });
  const canSubmit = form.truckTypeId && form.plateNumber && form.licenseExpiry;

  function handleSubmit() {
    addVehicle({
      id: `veh-new-${Date.now()}`,
      contractorId,
      truckTypeId: form.truckTypeId,
      plateNumber: form.plateNumber,
      licenseExpiry: form.licenseExpiry,
      active: true,
      specs: {},
    });
    onClose();
  }

  return (
    <Modal
      title="Add Vehicle"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add Vehicle
          </Button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <SelectField label="Truck Type" required value={form.truckTypeId} onChange={(e) => setForm((f) => ({ ...f, truckTypeId: e.target.value }))}>
            <option value="">— Select a truck type —</option>
            {TRUCK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{truckTypeLabel(t)}</option>
            ))}
          </SelectField>
        </div>
        <TextField label="Plate Number" required value={form.plateNumber} onChange={(e) => setForm((f) => ({ ...f, plateNumber: e.target.value }))} />
        <TextField label="License Expiry" required type="date" value={form.licenseExpiry} onChange={(e) => setForm((f) => ({ ...f, licenseExpiry: e.target.value }))} />
        <div className="sm:col-span-2">
          <FileUploadField label="Truck License File" />
        </div>
      </div>
    </Modal>
  );
}
