import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "../Modal";
import { Button } from "../Button";
import Stepper from "../Stepper";
import { TextField, SelectField } from "../FormField";
import TruckTypeGrid from "../TruckTypeGrid";
import ContractorPicker from "../ContractorPicker";
import CargoTypeSelect from "../CargoTypeSelect";
import WaypointsEditor from "../WaypointsEditor";
import MultiDateCalendar from "../MultiDateCalendar";
import { useDataStore } from "../../lib/store";
import { getTruckType } from "../../lib/selectors";
import { formatEGP } from "../../lib/format";
import type { Order, Waypoint } from "../../lib/types";

const STEP_TITLES = ["Parties", "Schedule", "Cargo & Route", "Review & Save"];
const TOTAL_STEPS = 4;

interface FormState {
  clientId: string;
  contractorId: string;
  truckTypeId: string;
  dailyPickupTime: string;
  dates: string[];
  cargoTypes: string[];
  weightKg: string;
  hours: string;
  distanceKm: string;
  waypoints: Waypoint[];
}

function emptyState(): FormState {
  return {
    clientId: "",
    contractorId: "",
    truckTypeId: "",
    dailyPickupTime: "07:00",
    dates: [],
    cargoTypes: [],
    weightKg: "",
    hours: "",
    distanceKm: "",
    waypoints: [],
  };
}

export default function MonthlyOrderFormModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { clients, addMonthlyOrder } = useDataStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyState);

  const truckType = form.truckTypeId ? getTruckType(form.truckTypeId) : undefined;
  const clientPricePerDay = truckType ? Math.round(truckType.dailyRentEGP * 1.28) : 0;
  const contractorPricePerDay = truckType?.dailyRentEGP ?? 0;
  const margin = clientPricePerDay - contractorPricePerDay;
  const vatPercent = 14;

  const canGoNext =
    (step === 1 && !!form.clientId) ||
    (step === 2 && !!form.truckTypeId && !!form.dailyPickupTime && form.dates.length > 0) ||
    (step === 3 && form.cargoTypes.length > 0 && !!form.distanceKm) ||
    step === 4;

  function goTo(s: number) {
    setStep(Math.min(TOTAL_STEPS, Math.max(1, s)));
  }

  function buildContract(status: "Draft" | "Active") {
    const id = `MOT-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    const sortedDates = [...form.dates].sort();
    const executedDates: string[] = [];

    const contract = {
      id,
      clientId: form.clientId,
      contractorId: form.contractorId || undefined,
      truckTypeId: form.truckTypeId,
      dailyPickupTime: form.dailyPickupTime,
      dates: sortedDates,
      executedDates,
      cargoTypes: form.cargoTypes,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      hours: form.hours ? Number(form.hours) : undefined,
      distanceKm: Number(form.distanceKm) || 0,
      waypoints: form.waypoints,
      clientPricePerDayEGP: clientPricePerDay,
      contractorPricePerDayEGP: contractorPricePerDay,
      vatPercent,
      status,
      createdAt: new Date().toISOString(),
    };

    const spawnedOrders: Order[] = [];
    if (status === "Active") {
      sortedDates.forEach((date, i) => {
        const pickupAt = new Date(`${date}T${form.dailyPickupTime}:00`).toISOString();
        spawnedOrders.push({
          id: `${id}-D${String(i + 1).padStart(2, "0")}`,
          clientId: form.clientId,
          contractorId: form.contractorId || undefined,
          status: "Pending",
          tripType: "Monthly",
          truckTypeId: form.truckTypeId,
          pickupAt,
          cargoTypes: form.cargoTypes,
          weightKg: form.weightKg ? Number(form.weightKg) : undefined,
          hours: form.hours ? Number(form.hours) : undefined,
          podRequired: true,
          podUploaded: false,
          waypoints: form.waypoints,
          statusHistory: [
            { id: "h0", timestamp: new Date().toISOString(), fromStatus: null, toStatus: "Pending", note: `Day ${i + 1}/${sortedDates.length} of monthly order ${id} — auto-created`, actor: "System" },
          ],
          createdAt: new Date().toISOString(),
          monthlyOrderId: id,
          dayLabel: String(i + 1),
        });
      });
    }

    addMonthlyOrder(contract, spawnedOrders);
    onClose();
    navigate(`/monthly-orders/${id}`);
  }

  return (
    <Modal
      title="New Monthly Order"
      onClose={onClose}
      size="lg"
      footerLayout="between"
      footer={
        <>
          <Button variant="secondary" onClick={() => (step === 1 ? onClose() : goTo(step - 1))}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          {step < TOTAL_STEPS ? (
            <Button onClick={() => goTo(step + 1)} disabled={!canGoNext}>
              Next
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => buildContract("Draft")}>
                Save & Exit (Draft)
              </Button>
              <Button onClick={() => buildContract("Active")}>Review Monthly Order</Button>
            </div>
          )}
        </>
      }
    >
      <Stepper step={step} total={TOTAL_STEPS} titles={STEP_TITLES} />

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <SelectField
            label="Client"
            required
            value={form.clientId}
            onChange={(clientId) => setForm((f) => ({ ...f, clientId }))}
            placeholder="— Select a client —"
            options={clients.filter((c) => c.active).map((c) => ({ value: c.id, label: c.name }))}
          />
          <ContractorPicker value={form.contractorId} onChange={(contractorId) => setForm((f) => ({ ...f, contractorId }))} />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
              Truck Type <span className="text-status-cancelled">*</span>
            </label>
            <TruckTypeGrid value={form.truckTypeId} onChange={(truckTypeId) => setForm((f) => ({ ...f, truckTypeId, cargoTypes: [] }))} />
          </div>
          <TextField label="Daily Pickup Time" required type="time" value={form.dailyPickupTime} onChange={(e) => setForm((f) => ({ ...f, dailyPickupTime: e.target.value }))} />
          <div>
            <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
              Execution Dates <span className="text-status-cancelled">*</span>
            </label>
            <MultiDateCalendar value={form.dates} onChange={(dates) => setForm((f) => ({ ...f, dates }))} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          {truckType ? (
            <CargoTypeSelect allowed={truckType.allowedCargoTypes} value={form.cargoTypes} onChange={(cargoTypes) => setForm((f) => ({ ...f, cargoTypes }))} />
          ) : (
            <p className="text-body-2-regular text-muted">Select a truck type in the previous step to see allowed cargo types.</p>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            <TextField label="Weight (kg)" type="number" value={form.weightKg} onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))} />
            <TextField label="Hours (h)" type="number" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} />
            <TextField label="Distance (km)" required type="number" value={form.distanceKm} onChange={(e) => setForm((f) => ({ ...f, distanceKm: e.target.value }))} />
          </div>
          <div>
            <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
              Waypoints <span className="text-muted font-normal">(optional — applies to every spawned order)</span>
            </label>
            <WaypointsEditor value={form.waypoints} onChange={(waypoints) => setForm((f) => ({ ...f, waypoints }))} clientId={form.clientId} required={false} />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2lg border border-border p-4">
            <div className="text-caption-1-semibold uppercase tracking-wide text-muted mb-2" style={{ fontFamily: "var(--font-mono)" }}>Schedule</div>
            <div className="text-body-2-regular text-navy">{form.dates.length} execution day(s) · {form.dailyPickupTime} daily</div>
          </div>
          <div className="rounded-2lg border border-border p-4">
            <div className="text-caption-1-semibold uppercase tracking-wide text-muted mb-3" style={{ fontFamily: "var(--font-mono)" }}>Pricing Summary</div>
            <div className="grid sm:grid-cols-2 gap-4 text-body-2-regular">
              <div className="flex justify-between"><span className="text-muted">Client Price (gross, /day)</span><span className="text-navy font-semibold">{formatEGP(clientPricePerDay)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Contractor Price (net, /day)</span><span className="text-navy font-semibold">{formatEGP(contractorPricePerDay)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Company Margin (/day)</span><span className="text-navy font-semibold">{formatEGP(margin)}</span></div>
              <div className="flex justify-between"><span className="text-muted">VAT</span><span className="text-navy font-semibold">{vatPercent}%</span></div>
            </div>
          </div>
          <p className="text-caption-1-regular text-muted">
            "Save & Exit" keeps this as a Draft. "Review Monthly Order" commits it and generates {form.dates.length} individual orders, one per execution date.
          </p>
        </div>
      )}
    </Modal>
  );
}
