import { useNavigate } from "react-router";
import ScreenHeader from "../../components/ScreenHeader";
import SectionHeading from "../../components/SectionHeading";
import CopyableField from "../../components/CopyableField";
import { Button } from "../../components/Button";
import PersonRounded from "@mui/icons-material/PersonRounded";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import { useDataStore } from "../../lib/store";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profile } = useDataStore();

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      {/* Fixed header-title collision: this reads "Profile Settings", not a repeat of the Account list's title above it. */}
      <ScreenHeader title="Profile Settings" onBack={() => navigate("/account")} />

      <div className="w-full max-w-lg mx-auto px-4 pb-8 flex flex-col gap-5">
        <div className="rounded-[20px] bg-white p-4 flex items-center gap-3.5" style={{ border: "1px solid #E8E8E5" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "white" }}>
              {profile.fullName.split(" ").map((p) => p[0]).join("")}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#040033" }}>{profile.fullName}</p>
            <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>{profile.email}</p>
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
          <SectionHeading icon={<PersonRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>Personal</SectionHeading>
          <div className="flex flex-col divide-y" style={{ borderColor: "#F0F0EE" }}>
            <CopyableField label="Full Name" value={profile.fullName} />
            <CopyableField label="National ID" value={profile.nationalId} />
            <CopyableField label="Phone" value={profile.phone} />
          </div>
        </div>

        {/* Email dropped here - the profile card above already shows it persistently. */}
        <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
          <SectionHeading icon={<BadgeRounded sx={{ fontSize: 16, color: "#1253FA" }} />}>Account</SectionHeading>
          <div className="flex flex-col divide-y" style={{ borderColor: "#F0F0EE" }}>
            <CopyableField label="Username" value={profile.username} />
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
