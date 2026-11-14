import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import ScreenHeader from "../../components/ScreenHeader";
import { TextField, SelectField } from "../../components/FormField";
import { Button } from "../../components/Button";
import ActiveStatusBadge from "../../components/ActiveStatusBadge";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import { TRUCK_TYPE_OPTIONS, truckTypeLabel } from "../../lib/constants";
import type { TruckBaseClass, TruckConfig } from "../../lib/types";

export default function TruckForm({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const { truckId } = useParams();
  const { trucks, addTruck, updateTruck } = useDataStore();
  const existing = mode === "edit" ? byId(trucks, truckId) : undefined;

  const [plateNumber, setPlateNumber] = useState(existing?.plateNumber ?? "");
  const [typeKey, setTypeKey] = useState(existing ? `${existing.baseClass}|${existing.config}` : "");
  const [licenseExpiry, setLicenseExpiry] = useState(existing?.licenseExpiry ?? "");

  if (mode === "edit" && !existing) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
        <ScreenHeader title="Edit Truck" onBack={() => navigate("/trucks")} />
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#626A76" }}>Truck not found.</p>
      </div>
    );
  }

  const canSubmit = plateNumber.trim() && typeKey && licenseExpiry;

  function handleSubmit() {
    const [baseClass, config] = typeKey.split("|") as [TruckBaseClass, TruckConfig];
    if (mode === "edit" && existing) {
      updateTruck(existing.id, { plateNumber: plateNumber.trim(), baseClass, config, licenseExpiry });
      navigate("/trucks", { replace: true });
      return;
    }
    const id = `trk-${Date.now()}`;
    addTruck({ id, plateNumber: plateNumber.trim(), baseClass, config, licenseExpiry, active: true });
    navigate("/trucks", { replace: true });
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title={mode === "edit" ? "Edit Truck" : "Add Truck"} onBack={() => navigate("/trucks")} />

      <div className="w-full max-w-lg mx-auto px-4 pt-5 pb-8">
        {mode === "edit" && existing && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #040033, #0A0070)" }}>
              <LocalShippingRounded sx={{ fontSize: 28, color: "white" }} />
            </div>
            <div className="min-w-0">
              <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>{existing.plateNumber}</h2>
              <div className="mt-2">
                <ActiveStatusBadge active={existing.active} />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-8">
          <TextField label="Plate Number" required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="e.g. ABC-1234" />
          <SelectField label="Truck Type" required value={typeKey} onChange={(e) => setTypeKey(e.target.value)}>
            <option value="" disabled>
              Select truck type
            </option>
            {TRUCK_TYPE_OPTIONS.map((t) => (
              <option key={`${t.baseClass}|${t.config}`} value={`${t.baseClass}|${t.config}`}>
                {truckTypeLabel(t)}
              </option>
            ))}
          </SelectField>
          <TextField label="License Expiry Date" required type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {mode === "edit" ? "Save Changes" : "Create Truck"}
        </Button>
        <div className="mt-1">
          <Button variant="ghost" onClick={() => navigate("/trucks")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
