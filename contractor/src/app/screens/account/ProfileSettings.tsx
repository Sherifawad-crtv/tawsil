import { useNavigate } from "react-router";
import ScreenHeader from "../../components/ScreenHeader";
import SectionLabel from "../../components/SectionLabel";
import CopyableField from "../../components/CopyableField";
import { Button } from "../../components/Button";
import MailOutlineRounded from "../../components/icons/MailOutlineRounded";
import PhoneRounded from "../../components/icons/PhoneRounded";
import { useDataStore } from "../../lib/store";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profile } = useDataStore();
  const initials = profile.fullName.split(" ").map((p) => p[0]).join("");
  const divider = <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 20px" }} />;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Profile Settings" onBack={() => navigate("/account")} />

      <div className="w-full max-w-lg mx-auto px-4 pt-5 pb-8">
        <div className="rounded-[22px] p-5 mb-6" style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #040033, #0A0070)" }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "white" }}>{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>{profile.fullName}</h2>
              <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#626A76", marginTop: "2px" }}>Contractor</p>
            </div>
          </div>
          <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 -4px" }} />
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3">
              <MailOutlineRounded sx={{ fontSize: 14, color: "#626A76" }} />
              <span className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#040033" }}>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneRounded sx={{ fontSize: 14, color: "#626A76" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#040033" }}>{profile.phone}</span>
            </div>
          </div>
        </div>

        <SectionLabel>Details</SectionLabel>
        <div className="rounded-[22px] overflow-hidden mb-6" style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          <CopyableField label="Full Name" value={profile.fullName} />
          {divider}
          <CopyableField label="National ID" value={profile.nationalId} />
          {divider}
          <CopyableField label="Phone" value={profile.phone} />
          {divider}
          <CopyableField label="Username" value={profile.username} />
        </div>

        <Button>Change Password</Button>
        <div className="mt-1">
          <Button variant="ghost">Refresh Info</Button>
        </div>
      </div>
    </div>
  );
}
