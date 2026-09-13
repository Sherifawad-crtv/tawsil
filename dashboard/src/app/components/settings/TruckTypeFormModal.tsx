import { useState } from "react";
import { Button } from "../Button";
import Modal from "../Modal";
import { TextField, SelectField } from "../FormField";
import Toggle from "../Toggle";
import CargoTypeSelect from "../CargoTypeSelect";
import { useDataStore } from "../../lib/store";
import { CARGO_TYPES } from "../../lib/constants";
import type { TruckType, TruckBaseClass, TruckConfig } from "../../lib/types";

const BASE_CLASSES: TruckBaseClass[] = ["Dababa", "Jumbo", "Suzuki Van", "Trailer"];
const CONFIGS: TruckConfig[] = ["Box", "Open", "Refrigerated", "Flatbed"];

export default function TruckTypeFormModal({ existing, onClose }: { existing?: TruckType; onClose: () => void }) {
  const { addTruckType, updateTruckType } = useDataStore();
  const [form, setForm] = useState({
    baseClass: existing?.baseClass ?? ("Dababa" as TruckBaseClass),
    config: existing?.config ?? ("Box" as TruckConfig),
    requiresTempControl: existing?.requiresTempControl ?? false,
    capacityMinT: existing ? String(existing.capacityMinT) : "",
    capacityMaxT: existing ? String(existing.capacityMaxT) : "",
    allowedCargoTypes: existing?.allowedCargoTypes ?? ([] as string[]),
    dailyRentEGP: existing ? String(existing.dailyRentEGP) : "",
    pricePerKmEGP: existing ? String(existing.pricePerKmEGP) : "",
  });

  const canSubmit = form.capacityMinT && form.capacityMaxT && form.allowedCargoTypes.length > 0 && form.dailyRentEGP && form.pricePerKmEGP;

  function handleConfigChange(config: TruckConfig) {
    setForm((f) => ({ ...f, config, requiresTempControl: config === "Refrigerated" }));
  }

  function handleSubmit() {
    const payload: TruckType = {
      id: existing?.id ?? `${form.baseClass.toLowerCase().replace(/\s+/g, "-")}-${form.config.toLowerCase()}-${Date.now()}`,
      baseClass: form.baseClass,
      config: form.config,
      requiresTempControl: form.requiresTempControl,
      capacityMinT: Number(form.capacityMinT),
      capacityMaxT: Number(form.capacityMaxT),
      allowedCargoTypes: form.allowedCargoTypes,
      dailyRentEGP: Number(form.dailyRentEGP),
      pricePerKmEGP: Number(form.pricePerKmEGP),
    };
    if (existing) updateTruckType(existing.id, payload);
    else addTruckType(payload);
    onClose();
  }

  return (
    <Modal
      title={existing ? "Edit Truck Type" : "Add Truck Type"}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {existing ? "Save Changes" : "Add Truck Type"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Truck Type"
            required
            value={form.baseClass}
            onChange={(v) => setForm((f) => ({ ...f, baseClass: v as TruckBaseClass }))}
            options={BASE_CLASSES.map((c) => ({ value: c, label: c }))}
          />
          <SelectField
            label="Configuration"
            required
            value={form.config}
            onChange={(v) => handleConfigChange(v as TruckConfig)}
            options={CONFIGS.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2lg border border-border bg-grey-light/40">
          <span className="text-body-medium text-navy">Requires Temperature Control</span>
          <Toggle checked={form.requiresTempControl} onChange={(v) => setForm((f) => ({ ...f, requiresTempControl: v }))} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <TextField label="Capacity Min (t)" required type="number" step="0.01" value={form.capacityMinT} onChange={(e) => setForm((f) => ({ ...f, capacityMinT: e.target.value }))} />
          <TextField label="Capacity Max (t)" required type="number" step="0.01" value={form.capacityMaxT} onChange={(e) => setForm((f) => ({ ...f, capacityMaxT: e.target.value }))} />
        </div>

        <CargoTypeSelect allowed={CARGO_TYPES} value={form.allowedCargoTypes} onChange={(allowedCargoTypes) => setForm((f) => ({ ...f, allowedCargoTypes }))} />

        <div className="grid sm:grid-cols-2 gap-3">
          <TextField label="Daily Rent (EGP)" required type="number" step="0.01" value={form.dailyRentEGP} onChange={(e) => setForm((f) => ({ ...f, dailyRentEGP: e.target.value }))} />
          <TextField label="Price/km (EGP)" required type="number" step="0.01" value={form.pricePerKmEGP} onChange={(e) => setForm((f) => ({ ...f, pricePerKmEGP: e.target.value }))} />
        </div>
      </div>
    </Modal>
  );
}
