import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PersonRounded from "@mui/icons-material/PersonRounded";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import PersonAddAlt1Rounded from "@mui/icons-material/PersonAddAlt1Rounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import ScreenHeader from "../../components/ScreenHeader";
import SectionHeading from "../../components/SectionHeading";
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
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#9CA3AF" }}>Driver not found.</p>
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
      <ScreenHeader
        title={mode === "edit" ? "Edit Driver" : "Add New Driver"}
        onBack={() => navigate("/drivers")}
        trailing={mode === "edit" && existing ? <ActiveStatusBadge active={existing.active} /> : undefined}
      />

      <div className="w-full max-w-lg mx-auto px-4 pb-8 flex flex-col gap-6">
        {mode === "edit" && existing ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0A0070" }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "white" }}>{existing.name[0]}</span>
            </div>
            <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>{existing.name}</p>
          </div>
        ) : (
          <div className="rounded-[22px] p-5 flex flex-col items-center text-center gap-2" style={{ backgroundColor: "white", border: "1px solid #E8E8E5" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#EAF0FE" }}>
              <PersonAddAlt1Rounded sx={{ fontSize: 26, color: "#1253FA" }} />
            </div>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "16px", color: "#040033" }}>Create New Driver Profile</p>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>
              Fill in the details below to add a new driver
            </p>
          </div>
        )}

        <div>
          {/* Standardized on the icon-in-box heading style used everywhere else (Add Driver, Edit/Add Truck) -
              Edit Driver previously used a different colored-bar treatment for this same concept. */}
          <SectionHeading icon={<PersonRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>Personal Information</SectionHeading>
          <div className="flex flex-col gap-3">
            <TextField label="Driver Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            <TextField label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            <TextField label="Phone Number" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 1xx xxx xxxx" />
          </div>
        </div>

        <div>
          <SectionHeading icon={<BadgeRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>License Information</SectionHeading>
          <div className="flex flex-col gap-3">
            <TextField label="License Number" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
            <TextField label="License Expiry Date" required type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} />
          </div>
        </div>

        {mode === "create" && (
          <div className="flex items-start gap-2 rounded-2xl p-3" style={{ backgroundColor: "#EAF0FE" }}>
            <InfoRounded sx={{ fontSize: 17, color: "#1253FA", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "12.5px", color: "#1253FA", lineHeight: 1.5 }}>
              Make sure all information is accurate before creating the driver profile
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 mt-2">
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {mode === "edit" ? "Save Changes" : "Create Driver"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/drivers")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
