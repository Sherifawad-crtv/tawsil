import { useState } from "react";
import { PhoneCallingIcon } from "@solar-icons/react/linear";
import Modal from "../Modal";
import { SelectField, TextareaField } from "../FormField";
import { useDataStore } from "../../lib/store";
import { getActiveOrderCountForDriver, byId } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";
import { getTruckType } from "../../lib/selectors";
import type { Order } from "../../lib/types";

export default function AssignDriverModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { contractors, drivers, vehicles, orders, assignDriver } = useDataStore();
  const [contractorId, setContractorId] = useState(order.contractorId ?? "");
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [note, setNote] = useState("");

  const contractorDrivers = drivers.filter((d) => d.contractorId === contractorId && d.active);
  const contractorVehicles = vehicles.filter((v) => v.contractorId === contractorId && v.active);

  const canConfirm = !!contractorId && !!driverId && !!vehicleId && (!manualMode || note.trim().length > 0);

  function handleConfirm() {
    assignDriver(order.id, contractorId, driverId, vehicleId, manualMode ? `Manual assignment — ${note.trim()}` : undefined);
    onClose();
  }

  return (
    <Modal
      title="Assign Driver"
      subtitle={`${order.id} — select a contractor, driver, and vehicle`}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-1.5 rounded-[var(--radius-control)] border border-border text-sm font-semibold text-navy cursor-pointer hover:bg-grey-light" style={{ fontFamily: "var(--font-sub)" }}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="px-5 py-1.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            Confirm Assignment
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <SelectField
          label="Contractor"
          required
          value={contractorId}
          onChange={(e) => {
            setContractorId(e.target.value);
            setDriverId("");
            setVehicleId("");
          }}
        >
          <option value="">— Select a contractor —</option>
          {contractors.filter((c) => c.active).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </SelectField>

        {contractorId && (
          <>
            <div>
              <SelectField label="Driver" required value={driverId} onChange={(e) => setDriverId(e.target.value)}>
                <option value="">— Select a driver —</option>
                {contractorDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {getActiveOrderCountForDriver(orders, d.id)} active order(s)
                  </option>
                ))}
              </SelectField>
              {contractorDrivers.length === 0 && <p className="mt-1.5 text-xs text-status-cancelled">No active drivers for this contractor.</p>}
            </div>

            <div>
              <SelectField label="Vehicle" required value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                <option value="">— Select a vehicle —</option>
                {contractorVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} — {truckTypeLabel(getTruckType(v.truckTypeId))}
                  </option>
                ))}
              </SelectField>
              {contractorVehicles.length === 0 && <p className="mt-1.5 text-xs text-status-cancelled">No active vehicles for this contractor.</p>}
            </div>

            {driverId && (
              <div className="rounded-[var(--radius-control)] bg-blue-soft px-4 py-2 text-sm text-navy">
                {byId(drivers, driverId)?.name} currently has{" "}
                <strong>{getActiveOrderCountForDriver(orders, driverId)} active order(s)</strong>.
              </div>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => setManualMode((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-navy cursor-pointer w-fit"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          <PhoneCallingIcon size={13} />
          {manualMode ? "Cancel manual assignment" : "Manual assignment (phone-coordinated)"}
        </button>

        {manualMode && (
          <TextareaField
            label="How was availability confirmed?"
            required
            placeholder="e.g. Confirmed by phone with dispatcher"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
}
