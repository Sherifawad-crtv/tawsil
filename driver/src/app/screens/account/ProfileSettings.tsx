import { useNavigate } from "react-router";
import PersonRounded from "@mui/icons-material/PersonRounded";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import ScreenHeader from "../../components/ScreenHeader";
import SectionHeading from "../../components/SectionHeading";
import ActionField from "../../components/ActionField";
import { Button } from "../../components/Button";
import { useDataStore } from "../../lib/store";
import { formatDate } from "../../lib/format";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profile } = useDataStore();

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      {/* Fixed header-title collision: reads "Profile Settings", not a repeat of the Account tab's title. */}
      <ScreenHeader title="Profile Settings" onBack={() => navigate("/account")} />

      <div className="w-full max-w-lg mx-auto px-4 pb-8 flex flex-col gap-5">
        <div className="rounded-[20px] bg-white p-4 flex items-center gap-3.5" style={{ border: "1px solid #E8E8E5" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "white" }}>
              {profile.fullName.split(" ").map((p) => p[0]).join("")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#040033" }}>{profile.fullName}</p>
            <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>{profile.email}</p>
          </div>
          {profile.licenseValid && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 flex-shrink-0"
              style={{ backgroundColor: "#E7F6EC", color: "#16803C", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11px" }}
            >
              <VerifiedRounded sx={{ fontSize: 13 }} />
              VALID
            </span>
          )}
        </div>

        {/* Email dropped here - the profile card above already shows it (standing rule: don't repeat a value the hero card already displays). */}
        <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
          <SectionHeading icon={<PersonRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>Personal</SectionHeading>
          <div className="flex flex-col divide-y" style={{ borderColor: "#F0F0EE" }}>
            <ActionField label="Driver Name" value={profile.fullName} />
            <ActionField label="Phone" value={profile.phone} message />
          </div>
        </div>

        {/* Expiry's own VALID badge dropped - the profile card above already carries it. */}
        <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
          <SectionHeading icon={<BadgeRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>License</SectionHeading>
          <div className="flex flex-col divide-y" style={{ borderColor: "#F0F0EE" }}>
            <ActionField label="License Number" value={profile.licenseNumber} />
            <ActionField label="License Expiry Date" value={formatDate(profile.licenseExpiry)} />
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
          <SectionHeading icon={<ApartmentRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>Contractor</SectionHeading>
          {/* Reference-only - correctly not editable from here. */}
          <div className="py-2">
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#9CA3AF" }}>Contractor Name</p>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13.5px", color: "#040033" }}>{profile.contractorName}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          <Button>Change Password</Button>
          <Button variant="outline">Refresh Info</Button>
        </div>
      </div>
    </div>
  );
}
