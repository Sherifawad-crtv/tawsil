import { useState } from "react";
import { PhoneCallingIcon } from "@solar-icons/react/line-duotone";
import { Button } from "../Button";
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
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Confirm Assignment
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <SelectField
          label="Contractor"
          required
          value={contractorId}
          onChange={(next) => {
            setContractorId(next);
            setDriverId("");
            setVehicleId("");
          }}
          placeholder="— Select a contractor —"
          options={contractors.filter((c) => c.active).map((c) => ({ value: c.id, label: c.name }))}
        />
        {contractorId && (
          <>
            <div>
              <SelectField
                label="Driver"
                required
                value={driverId}
                onChange={setDriverId}
                placeholder="— Select a driver —"
                options={contractorDrivers.map((d) => ({
                  value: d.id,
                  label: `${d.name} — ${getActiveOrderCountForDriver(orders, d.id)} active order(s)`,
                }))}
              />
              {contractorDrivers.length === 0 && <p className="mt-1.5 text-caption-1-regular text-status-cancelled">No active drivers for this contractor.</p>}
            </div>

            <div>
              <SelectField
                label="Vehicle"
                required
                value={vehicleId}
                onChange={setVehicleId}
                placeholder="— Select a vehicle —"
                options={contractorVehicles.map((v) => ({
                  value: v.id,
                  label: `${v.plateNumber} — ${truckTypeLabel(getTruckType(v.truckTypeId))}`,
                }))}
              />
              {contractorVehicles.length === 0 && <p className="mt-1.5 text-caption-1-regular text-status-cancelled">No active vehicles for this contractor.</p>}
            </div>

            {driverId && (
              <div className="rounded-2lg bg-blue-soft px-4 py-2 text-body-2-regular text-navy">
                {byId(drivers, driverId)?.name} currently has{" "}
                <strong>{getActiveOrderCountForDriver(orders, driverId)} active order(s)</strong>.
              </div>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => setManualMode((v) => !v)}
          className="flex items-center gap-2 text-caption-1-semibold text-muted hover:text-navy cursor-pointer w-fit"
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
