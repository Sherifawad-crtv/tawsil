import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ScreenHeader from "../../components/ScreenHeader";
import { TextField } from "../../components/FormField";
import { Button } from "../../components/Button";
import ActiveStatusBadge from "../../components/ActiveStatusBadge";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";

export default function DriverForm({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const { driverId } = useParams();
  const { drivers, addDriver, updateDriver } = useDataStore();
  const existing = mode === "edit" ? byId(drivers, driverId) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [licenseNumber, setLicenseNumber] = useState(existing?.licenseNumber ?? "");
  const [licenseExpiry, setLicenseExpiry] = useState(existing?.licenseExpiry ?? "");

  if (mode === "edit" && !existing) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
        <ScreenHeader title="Edit Driver" onBack={() => navigate("/drivers")} />
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#626A76" }}>Driver not found.</p>
      </div>
    );
  }

  const canSubmit = name.trim() && email.trim() && phone.trim() && licenseNumber.trim() && licenseExpiry;

  function handleSubmit() {
    if (mode === "edit" && existing) {
      updateDriver(existing.id, { name: name.trim(), email: email.trim(), phone: phone.trim(), licenseNumber: licenseNumber.trim(), licenseExpiry });
      navigate("/drivers", { replace: true });
      return;
    }
    addDriver({
      id: `drv-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      licenseNumber: licenseNumber.trim(),
      licenseExpiry,
      active: true,
    });
    navigate("/drivers", { replace: true });
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title={mode === "edit" ? "Edit Driver" : "Add Driver"} onBack={() => navigate("/drivers")} />

      <div className="w-full max-w-lg mx-auto px-4 pt-5 pb-8">
        {mode === "edit" && existing && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #040033, #0A0070)" }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "white" }}>{existing.name[0]}</span>
            </div>
            <div className="min-w-0">
              <h2 className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>{existing.name}</h2>
              <div className="mt-2">
                <ActiveStatusBadge active={existing.active} />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-8">
          <TextField label="Driver Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <TextField label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          <TextField label="Phone Number" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 1xx xxx xxxx" />
          <TextField label="License Number" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="e.g. DL-12345" />
          <TextField label="License Expiry Date" required type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {mode === "edit" ? "Save Changes" : "Create Driver"}
        </Button>
        <div className="mt-1">
          <Button variant="ghost" onClick={() => navigate("/drivers")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
