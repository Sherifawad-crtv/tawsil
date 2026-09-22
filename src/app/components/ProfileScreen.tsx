import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { displayName, initialsOf } from "../lib/authTypes";
import AddEmailModal from "./onboarding/AddEmailModal";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import MyLocationRounded from "@mui/icons-material/MyLocationRounded";
import FactCheckRounded from "@mui/icons-material/FactCheckRounded";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import CreditCardRounded from "@mui/icons-material/CreditCardRounded";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const SETTINGS = [
  {
    id: "notifications",
    label: "Push Notifications",
    desc: "Trip updates and alerts",
    icon: <NotificationsRounded sx={{ fontSize: 18, color: "#040033" }} />,
  },
  {
    id: "location",
    label: "Location Services",
    desc: "Auto-detect pickup location",
    icon: <MyLocationRounded sx={{ fontSize: 18, color: "#040033" }} />,
  },
  {
    id: "pod",
    label: "Default POD",
    desc: "Proof of delivery on all orders",
    icon: <FactCheckRounded sx={{ fontSize: 18, color: "#040033" }} />,
  },
];

const MENU_ITEMS = [
  { label: "Saved Locations", icon: "bookmark" },
  { label: "Payment Methods", icon: "card" },
  { label: "Help & Support", icon: "help" },
  { label: "Terms & Privacy", icon: "shield" },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 cursor-pointer"
      style={{
        width: "46px",
        height: "26px",
        borderRadius: "13px",
        backgroundColor: checked ? "#1253FA" : "#D8D9D4",
        transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        border: "none",
        padding: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          width: "20px",
          height: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </button>
  );
}

export default function ProfileScreen() {
  const { user, updateEmail, signOut } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    location: true,
    pod: true,
  });
  const [showAddEmail, setShowAddEmail] = useState(false);

  // App.tsx never renders this screen without a signed-up user.
  if (!user) return null;

  const name = displayName(user);
  const initials = initialsOf(user);
  const accountTypeLabel = user.type === "business" ? "Business" : "Individual";
  const subtitle = user.type === "business" ? "Business account" : undefined;
  const memberSince = formatMemberSince(user.createdAt);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)", paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 96px)" }}>

        {/* ── Header ── */}
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: "1.15", marginBottom: "24px" }}>
          Profile
        </h1>

        {/* ── Profile Card ── */}
        <div
          className="rounded-[22px] p-5 mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #040033, #0A0070)" }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: "white" }}>
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>
                {name}
              </h2>
              {subtitle && (
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                  {subtitle}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="px-2.5 py-0.5 rounded-xl"
                  style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "10px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.08)", textTransform: "uppercase", letterSpacing: "0.06em" }}
                >
                  {accountTypeLabel}
                </span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
                  Since {memberSince}
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 -4px" }} />

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3">
              <MailOutlineRounded sx={{ fontSize: 14, color: "#9CA3AF" }} />
              {user.email ? (
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#040033" }}>{user.email}</span>
              ) : (
                <button
                  onClick={() => setShowAddEmail(true)}
                  className="cursor-pointer active:opacity-70 transition-opacity"
                  style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#1253FA", border: "none", background: "none" }}
                >
                  + Add email address
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <PhoneRounded sx={{ fontSize: 14, color: "#9CA3AF" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#040033" }}>{user.phone}</span>
            </div>
          </div>
        </div>

        {showAddEmail && (
          <AddEmailModal
            onSave={(email) => { updateEmail(email); setShowAddEmail(false); }}
            onSkip={() => setShowAddEmail(false)}
          />
        )}

        {/* ── Settings ── */}
        <div className="mb-3">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Settings
          </span>
        </div>
        <div
          className="rounded-[22px] overflow-hidden mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          {SETTINGS.map((setting, i) => (
            <div key={setting.id}>
              {i > 0 && <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 20px" }} />}
              <div className="flex items-center gap-3.5 px-5 py-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#F5F5F3" }}
                >
                  {setting.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{setting.label}</p>
                  <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>{setting.desc}</p>
                </div>
                <ToggleSwitch
                  checked={toggles[setting.id]}
                  onChange={(v) => setToggles({ ...toggles, [setting.id]: v })}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Menu Items ── */}
        <div className="mb-3">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            More
          </span>
        </div>
        <div
          className="rounded-[22px] overflow-hidden mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
        >
          {MENU_ITEMS.map((item, i) => (
            <div key={item.label}>
              {i > 0 && <div style={{ height: "1px", backgroundColor: "#F0F0EE", margin: "0 20px" }} />}
              <button
                className="flex items-center gap-3.5 px-5 py-4 w-full cursor-pointer active:bg-black/[0.01] transition-colors text-left"
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#F5F5F3" }}
                >
                  {item.icon === "bookmark" && <BookmarkBorderRounded sx={{ fontSize: 16, color: "#040033" }} />}
                  {item.icon === "card" && <CreditCardRounded sx={{ fontSize: 16, color: "#040033" }} />}
                  {item.icon === "help" && <HelpOutlineRounded sx={{ fontSize: 16, color: "#040033" }} />}
                  {item.icon === "shield" && <ShieldRounded sx={{ fontSize: 16, color: "#040033" }} />}
                </div>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033", flex: 1 }}>
                  {item.label}
                </span>
                <ChevronRightRounded sx={{ fontSize: 14, color: "#D8D9D4" }} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Logout ── */}
        <button
          onClick={signOut}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            border: "none",
          }}
        >
          <LogoutRounded sx={{ fontSize: 16, color: "#DC2626" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#DC2626" }}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}
