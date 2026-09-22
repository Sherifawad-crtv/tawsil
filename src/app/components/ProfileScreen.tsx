import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { displayName, initialsOf } from "../lib/authTypes";
import AddEmailModal from "./onboarding/AddEmailModal";

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const SETTINGS = [
  {
    id: "notifications",
    label: "Push Notifications",
    desc: "Trip updates and alerts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M13.5 6.5C13.5 4.01 11.49 2 9 2C6.51 2 4.5 4.01 4.5 6.5C4.5 11 2.5 12.5 2.5 12.5H15.5C15.5 12.5 13.5 11 13.5 6.5Z" stroke="#040033" strokeWidth="1.4" fill="none" />
        <path d="M7.5 12.5V13.5C7.5 14.33 8.17 15 9 15C9.83 15 10.5 14.33 10.5 13.5V12.5" stroke="#040033" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "location",
    label: "Location Services",
    desc: "Auto-detect pickup location",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="3" fill="none" stroke="#040033" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="7" stroke="#040033" strokeWidth="1.4" fill="none" />
        <path d="M9 1V3.5M9 14.5V17M1 9H3.5M14.5 9H17" stroke="#040033" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "pod",
    label: "Default POD",
    desc: "Proof of delivery on all orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="2" stroke="#040033" strokeWidth="1.4" fill="none" />
        <path d="M6 7L8 9L12 5" stroke="#040033" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12H12" stroke="#040033" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
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
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1.5" y="2.5" width="11" height="9" rx="2" stroke="#9CA3AF" strokeWidth="1.3" fill="none" />
                <path d="M1.5 5.5L7 8.5L12.5 5.5" stroke="#9CA3AF" strokeWidth="1.3" />
              </svg>
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
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12.5 10V12C12.5 12.3 12.2 12.5 11.9 12.5C6.5 12.5 1.5 7.5 1.5 2.1C1.5 1.8 1.8 1.5 2.1 1.5H4.1C4.4 1.5 4.6 1.8 4.6 2.1C4.6 2.9 4.7 3.6 5 4.3C5.1 4.5 5 4.8 4.8 5L3.8 6C4.7 7.8 5.7 8.8 7.5 9.7L8.5 8.7C8.7 8.5 9 8.4 9.2 8.5C9.9 8.8 10.6 8.9 11.4 8.9C11.7 8.9 11.9 9.1 12 9.4L12.5 10Z" stroke="#9CA3AF" strokeWidth="1.2" fill="none" />
              </svg>
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
                  {item.icon === "bookmark" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 2H12.5C13 2 13.5 2.45 13.5 3V14L8 11L2.5 14V3C2.5 2.45 3 2 3.5 2Z" stroke="#040033" strokeWidth="1.4" fill="none" />
                    </svg>
                  )}
                  {item.icon === "card" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="#040033" strokeWidth="1.4" fill="none" />
                      <path d="M1.5 7H14.5" stroke="#040033" strokeWidth="1.4" />
                    </svg>
                  )}
                  {item.icon === "help" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="#040033" strokeWidth="1.4" fill="none" />
                      <path d="M6 6.5C6 5.4 6.9 4.5 8 4.5C9.1 4.5 10 5.4 10 6.5C10 7.6 8 8 8 9" stroke="#040033" strokeWidth="1.4" strokeLinecap="round" />
                      <circle cx="8" cy="11" r="0.6" fill="#040033" />
                    </svg>
                  )}
                  {item.icon === "shield" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5L2.5 4V7.5C2.5 11.2 4.8 14 8 14.5C11.2 14 13.5 11.2 13.5 7.5V4L8 1.5Z" stroke="#040033" strokeWidth="1.4" fill="none" />
                      <path d="M5.5 8L7 9.5L10.5 6" stroke="#040033" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033", flex: 1 }}>
                  {item.label}
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="#D8D9D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10.5 11L14 8L10.5 5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 8H6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#DC2626" }}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}
