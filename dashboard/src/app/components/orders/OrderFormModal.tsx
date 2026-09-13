import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "../Modal";
import { Button } from "../Button";
import Stepper from "../Stepper";
import { TextField, TextareaField, SelectField } from "../FormField";
import TruckTypeGrid from "../TruckTypeGrid";
import ContractorPicker from "../ContractorPicker";
import CargoTypeSelect from "../CargoTypeSelect";
import WaypointsEditor from "../WaypointsEditor";
import Toggle from "../Toggle";
import SegmentedControl from "../SegmentedControl";
import ClientStepPicker, { EMPTY_CLIENT_SELECTION, type ClientSelection } from "../ClientStepPicker";
import StatusBadge from "../StatusBadge";
import { getTruckType, byId } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";
import { formatEGP } from "../../lib/format";
import { useDataStore } from "../../lib/store";
import type { Order, TripType, Waypoint } from "../../lib/types";

const STEP_TITLES = ["Client", "Trip Basics", "Cargo Details", "Delivery & Waypoints", "Review"];
const TOTAL_STEPS = 5;

interface FormState {
  client: ClientSelection;
  contractorId: string;
  tripType: TripType;
  truckTypeId: string;
  pickupDate: string;
  pickupTime: string;
  cargoTypes: string[];
  weightKg: string;
  hours: string;
  clientNote: string;
  supplyNote: string;
  podRequired: boolean;
  waypoints: Waypoint[];
}

function emptyState(): FormState {
  const now = new Date();
  now.setHours(now.getHours() + 2);
  return {
    client: EMPTY_CLIENT_SELECTION,
    contractorId: "",
    tripType: "On Demand",
    truckTypeId: "",
    pickupDate: now.toISOString().slice(0, 10),
    pickupTime: now.toTimeString().slice(0, 5),
    cargoTypes: [],
    weightKg: "",
    hours: "",
    clientNote: "",
    supplyNote: "",
    podRequired: true,
    waypoints: [],
  };
}

function stateFromOrder(order: Order): FormState {
  const pickup = new Date(order.pickupAt);
  return {
    client: { mode: "existing", existingClientId: order.clientId, newClient: EMPTY_CLIENT_SELECTION.newClient },
    contractorId: order.contractorId ?? "",
    tripType: order.tripType,
    truckTypeId: order.truckTypeId,
    pickupDate: pickup.toISOString().slice(0, 10),
    pickupTime: pickup.toTimeString().slice(0, 5),
    cargoTypes: order.cargoTypes,
    weightKg: order.weightKg ? String(order.weightKg) : "",
    hours: order.hours ? String(order.hours) : "",
    clientNote: order.clientNote ?? "",
    supplyNote: order.supplyNote ?? "",
    podRequired: order.podRequired,
    waypoints: order.waypoints,
  };
}

export default function OrderFormModal({
  mode,
  initialOrder,
  onClose,
}: {
  mode: "create" | "edit";
  initialOrder?: Order;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { clients, addClient, addOrder, updateOrder } = useDataStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => (initialOrder ? stateFromOrder(initialOrder) : emptyState()));

  const truckType = form.truckTypeId ? getTruckType(form.truckTypeId) : undefined;
  const selectedClient = form.client.mode === "existing" ? byId(clients, form.client.existingClientId) : undefined;
  const clientDisplayName = selectedClient?.name ?? (form.client.mode === "new" ? form.client.newClient.name || "New client" : "—");

  const canGoNext =
    (step === 1 && (form.client.mode === "existing" ? !!form.client.existingClientId : !!form.client.newClient.name)) ||
    (step === 2 && !!form.truckTypeId && !!form.pickupDate && !!form.pickupTime) ||
    (step === 3 && form.cargoTypes.length > 0) ||
    (step === 4 && form.waypoints.some((w) => w.type === "Pickup") && form.waypoints.some((w) => w.type === "Dropoff")) ||
    step === 5;

  function goTo(s: number) {
    setStep(Math.min(TOTAL_STEPS, Math.max(1, s)));
  }

  function handleSubmit() {
    let clientId = form.client.existingClientId;
    if (form.client.mode === "new") {
      const newId = `cli-new-${Date.now()}`;
      addClient({ id: newId, ...form.client.newClient, active: true, createdAt: new Date().toISOString().slice(0, 10) });
      clientId = newId;
    }

    const pickupAt = new Date(`${form.pickupDate}T${form.pickupTime}:00`).toISOString();

    if (mode === "edit" && initialOrder) {
      updateOrder(initialOrder.id, {
        clientId,
        contractorId: form.contractorId || undefined,
        tripType: form.tripType,
        truckTypeId: form.truckTypeId,
        pickupAt,
        cargoTypes: form.cargoTypes,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        hours: form.hours ? Number(form.hours) : undefined,
        clientNote: form.clientNote || undefined,
        supplyNote: form.supplyNote || undefined,
        podRequired: form.podRequired,
        waypoints: form.waypoints,
      });
      onClose();
      return;
    }

    const newOrderId = `TWL-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    const nowIso = new Date().toISOString();
    addOrder({
      id: newOrderId,
      clientId,
      contractorId: form.contractorId || undefined,
      status: "Pending",
      tripType: form.tripType,
      truckTypeId: form.truckTypeId,
      pickupAt,
      cargoTypes: form.cargoTypes,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      hours: form.hours ? Number(form.hours) : undefined,
      clientNote: form.clientNote || undefined,
      supplyNote: form.supplyNote || undefined,
      podRequired: form.podRequired,
      podUploaded: false,
      waypoints: form.waypoints,
      statusHistory: [{ id: "h0", timestamp: nowIso, fromStatus: null, toStatus: "Pending", actor: "Sales" }],
      createdAt: nowIso,
    });
    onClose();
    navigate(`/orders/${newOrderId}`);
  }

  return (
    <Modal
      title={mode === "create" ? "New Order" : `Edit ${initialOrder?.id}`}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => (step === 1 ? onClose() : goTo(step - 1))}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          {step < TOTAL_STEPS ? (
            <Button onClick={() => goTo(step + 1)} disabled={!canGoNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>{mode === "create" ? "Create Order" : "Save Changes"}</Button>
          )}
        </div>
      }
    >
      <Stepper step={step} total={TOTAL_STEPS} titles={STEP_TITLES} />

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <ClientStepPicker value={form.client} onChange={(client) => setForm((f) => ({ ...f, client }))} />
          <ContractorPicker value={form.contractorId} onChange={(contractorId) => setForm((f) => ({ ...f, contractorId }))} />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
              Trip Type <span className="text-status-cancelled">*</span>
            </label>
            <SegmentedControl
              aria-label="Trip type"
              value={form.tripType}
              onChange={(tripType) => setForm((f) => ({ ...f, tripType: tripType as TripType }))}
              options={[
                { value: "On Demand", label: "On Demand" },
                { value: "Daily", label: "Daily" },
              ]}
            />
          </div>

          <div>
            <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
              Truck Type <span className="text-status-cancelled">*</span>
            </label>
            <TruckTypeGrid
              value={form.truckTypeId}
              onChange={(truckTypeId) => setForm((f) => ({ ...f, truckTypeId, cargoTypes: [] }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Pickup Date" required type="date" value={form.pickupDate} onChange={(e) => setForm((f) => ({ ...f, pickupDate: e.target.value }))} />
            <TextField label="Pickup Time" required type="time" value={form.pickupTime} onChange={(e) => setForm((f) => ({ ...f, pickupTime: e.target.value }))} />
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
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField label="Weight (kg)" type="number" value={form.weightKg} onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))} />
            <TextField label="Hours (h)" type="number" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} />
          </div>
          <TextareaField label="Client Note" value={form.clientNote} onChange={(e) => setForm((f) => ({ ...f, clientNote: e.target.value }))} />
          <TextareaField label="Supply Note" badge="Internal" value={form.supplyNote} onChange={(e) => setForm((f) => ({ ...f, supplyNote: e.target.value }))} />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between p-4 rounded-2lg border border-border bg-grey-light/40">
            <div>
              <div className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Proof of Delivery Required</div>
              <div className="text-caption-1-regular text-muted mt-0.5">Require photo confirmation at drop-off.</div>
            </div>
            <Toggle checked={form.podRequired} onChange={(podRequired) => setForm((f) => ({ ...f, podRequired }))} label="Proof of Delivery Required" />
          </div>
          <WaypointsEditor value={form.waypoints} onChange={(waypoints) => setForm((f) => ({ ...f, waypoints }))} clientId={form.client.existingClientId} />
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-5">
          <ReviewRow label="Client" onEdit={() => goTo(1)}>
            <div className="text-body-2-regular text-navy">{clientDisplayName}</div>
            {form.contractorId && <div className="text-caption-1-regular text-muted mt-0.5">Contractor pre-selected</div>}
          </ReviewRow>
          <ReviewRow label="Trip Basics" onEdit={() => goTo(2)}>
            <div className="text-body-2-regular text-navy">
              {form.tripType} · {truckType ? truckTypeLabel(truckType) : "—"}
            </div>
            <div className="text-caption-1-regular text-muted mt-0.5">{form.pickupDate} at {form.pickupTime}</div>
          </ReviewRow>
          <ReviewRow label="Cargo Details" onEdit={() => goTo(3)}>
            <div className="text-body-2-regular text-navy">{form.cargoTypes.join(", ") || "—"}</div>
            <div className="text-caption-1-regular text-muted mt-0.5">
              {form.weightKg ? `${form.weightKg} kg` : "No weight"} · {form.hours ? `${form.hours}h` : "No hours"}
            </div>
          </ReviewRow>
          <ReviewRow label="Delivery & Waypoints" onEdit={() => goTo(4)}>
            <div className="text-body-2-regular text-navy">POD Required: {form.podRequired ? "Yes" : "No"}</div>
            <div className="text-caption-1-regular text-muted mt-0.5">{form.waypoints.length} waypoint(s)</div>
          </ReviewRow>
          {truckType && (
            <div className="text-caption-1-regular text-muted px-1" style={{ fontFamily: "var(--font-mono)" }}>
              Est. base rate: {formatEGP(truckType.dailyRentEGP)} / day · {formatEGP(truckType.pricePerKmEGP)} / km
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function ReviewRow({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="rounded-2lg border border-border p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-caption-1-semibold uppercase tracking-wide text-muted mb-1" style={{ fontFamily: "var(--font-mono)" }}>
          {label}
        </div>
        {children}
      </div>
      <button onClick={onEdit} className="text-caption-1-semibold text-blue cursor-pointer flex-shrink-0" style={{ fontFamily: "var(--font-sub)" }}>
        Edit
      </button>
    </div>
  );
}
