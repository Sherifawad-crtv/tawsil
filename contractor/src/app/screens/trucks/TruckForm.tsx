import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import EventRounded from "@mui/icons-material/EventRounded";
import AddCircleRounded from "@mui/icons-material/AddCircleRounded";
import ScreenHeader from "../../components/ScreenHeader";
import SectionHeading from "../../components/SectionHeading";
import { TextField, SelectField } from "../../components/FormField";
import { Button } from "../../components/Button";
import StatusBadge from "../../components/ActiveStatusBadge";
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
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#9CA3AF" }}>Truck not found.</p>
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
      <ScreenHeader
        title={mode === "edit" ? "Edit Truck" : "Add New Truck"}
        onBack={() => navigate("/trucks")}
        trailing={mode === "edit" && existing ? <StatusBadge active={existing.active} /> : undefined}
      />

      <div className="w-full max-w-lg mx-auto px-4 pb-8 flex flex-col gap-6">
        {mode === "edit" && existing ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EAF0FE" }}>
              <LocalShippingRounded sx={{ fontSize: 34, color: "#1253FA" }} />
            </div>
            <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>{existing.plateNumber}</p>
          </div>
        ) : (
          <div className="rounded-[22px] p-5 flex flex-col items-center text-center gap-2" style={{ backgroundColor: "white", border: "1px solid #E8E8E5" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#EAF0FE" }}>
              <AddCircleRounded sx={{ fontSize: 26, color: "#1253FA" }} />
            </div>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "16px", color: "#040033" }}>Register New Truck</p>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>
              Add a new truck to your fleet management system
            </p>
          </div>
        )}

        <div>
          <SectionHeading icon={<DescriptionRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>Truck Information</SectionHeading>
          <div className="flex flex-col gap-3">
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
          </div>
        </div>

        <div>
          <SectionHeading icon={<EventRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>License Information</SectionHeading>
          <TextField label="License Expiry Date" required type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2.5 mt-2">
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {mode === "edit" ? "Save Changes" : "Create Truck"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/trucks")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
