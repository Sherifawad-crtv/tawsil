import { useState } from "react";

/* ── Toggle Switch ── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 cursor-pointer"
      style={{
        width: "52px",
        height: "30px",
        borderRadius: "15px",
        backgroundColor: checked ? "#1253FA" : "#D8D9D4",
        transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        border: "none",
        padding: 0,
        outline: "none",
      }}
    >
      {/* Glow when active */}
      <div
        style={{
          position: "absolute",
          inset: "-3px",
          borderRadius: "18px",
          boxShadow: checked ? "0 0 0 3px rgba(18,83,250,0.15)" : "none",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: "none",
        }}
      />
      {/* Knob */}
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "25px" : "3px",
          width: "24px",
          height: "24px",
          borderRadius: "12px",
          backgroundColor: "white",
          boxShadow: checked
            ? "0 2px 8px rgba(18,83,250,0.3)"
            : "0 1px 4px rgba(0,0,0,0.15)",
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s",
        }}
      />
    </button>
  );
}

/* ── Setting Row Icon Components ── */
function CameraIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="6" width="18" height="13" rx="3" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" fill="none" />
      <circle cx="11" cy="12.5" r="3.5" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" fill="none" />
      <path d="M7.5 6L8.5 3.5H13.5L14.5 6" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {active && <circle cx="11" cy="12.5" r="1.5" fill="#1253FA" opacity="0.4" />}
    </svg>
  );
}

function SignatureIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 17C5 13 7 15 9 12C11 9 12 16 14 13C16 10 17.5 14 19 11" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 19.5H19" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ShieldIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L4 5.5V10.5C4 15 7 18.5 11 20C15 18.5 18 15 18 10.5V5.5L11 2Z" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      {active && <path d="M8 11L10.2 13.2L14.5 8.5" stroke="#1253FA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
      {!active && <path d="M8 11L10.2 13.2L14.5 8.5" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />}
    </svg>
  );
}

function BellIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3C7.7 3 5 5.7 5 9V13L3.5 15.5H18.5L17 13V9C17 5.7 14.3 3 11 3Z" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M9 16.5C9 17.6 9.9 18.5 11 18.5C12.1 18.5 13 17.6 13 16.5" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function NotesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="2" width="16" height="18" rx="2.5" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.6" fill="none" />
      <path d="M7 7H15" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7 11H15" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7 15H12" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Setting Row ── */
interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  badge?: string;
  isLast?: boolean;
}

function SettingRow({ icon, title, subtitle, checked, onChange, badge, isLast }: SettingRowProps) {
  return (
    <>
      <div
        className="flex items-center gap-4 py-4 active:bg-black/[0.02] transition-colors"
        style={{ cursor: "pointer" }}
        onClick={() => onChange(!checked)}
      >
        {/* Icon container */}
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-2xl transition-all duration-300"
          style={{
            width: "44px",
            height: "44px",
            backgroundColor: checked ? "rgba(18,83,250,0.08)" : "#F0F0EE",
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: "#040033",
              }}
            >
              {title}
            </span>
            {badge && (
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: "10px",
                  color: "#1253FA",
                  backgroundColor: "rgba(18,83,250,0.08)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            className="mt-0.5"
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: "12px",
              color: "#9CA3AF",
              lineHeight: "1.4",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Toggle */}
        <Toggle checked={checked} onChange={onChange} />
      </div>

      {/* Divider */}
      {!isLast && (
        <div
          style={{
            height: "1px",
            backgroundColor: "#E8E8E5",
            marginLeft: "60px",
          }}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   DELIVERY OPTIONS COMPONENT
   ══════════════════════════════════════════ */
export interface DeliverySettings {
  proofOfDelivery: boolean;
  signatureRequired: boolean;
  insurance: boolean;
  liveNotifications: boolean;
  driverNotes: boolean;
}

const DEFAULT_SETTINGS: DeliverySettings = {
  proofOfDelivery: true,
  signatureRequired: false,
  insurance: false,
  liveNotifications: true,
  driverNotes: false,
};

export default function DeliveryOptions({
  value,
  onChange,
}: {
  value?: DeliverySettings;
  onChange?: (settings: DeliverySettings) => void;
}) {
  const [settings, setSettings] = useState<DeliverySettings>(value || DEFAULT_SETTINGS);

  const update = (key: keyof DeliverySettings, val: boolean) => {
    const next = { ...settings, [key]: val };
    // Auto-enable POD if signature is turned on
    if (key === "signatureRequired" && val) {
      next.proofOfDelivery = true;
    }
    setSettings(next);
    onChange?.(next);
  };

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className="flex flex-col w-full">
      {/* ── Active summary ── */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-5"
        style={{ backgroundColor: "rgba(18,83,250,0.05)" }}
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#1253FA" }}
        >
          <span
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              color: "white",
            }}
          >
            {activeCount}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: "12px",
            color: "#6B7280",
          }}
        >
          {activeCount === 0
            ? "No options enabled"
            : `${activeCount} option${activeCount > 1 ? "s" : ""} enabled for this delivery`}
        </p>
      </div>

      {/* ── Settings List ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="px-5">
          <SettingRow
            icon={<CameraIcon active={settings.proofOfDelivery} />}
            title="Proof of Delivery"
            subtitle="Require photo confirmation at drop‑off to verify safe receipt of cargo."
            checked={settings.proofOfDelivery}
            onChange={(v) => update("proofOfDelivery", v)}
            badge="Recommended"
          />
          <SettingRow
            icon={<SignatureIcon active={settings.signatureRequired} />}
            title="Signature Required"
            subtitle="Recipient must sign on device to confirm goods received."
            checked={settings.signatureRequired}
            onChange={(v) => update("signatureRequired", v)}
          />
          <SettingRow
            icon={<ShieldIcon active={settings.insurance} />}
            title="Cargo Insurance"
            subtitle="Add coverage for damage or loss during transit."
            checked={settings.insurance}
            onChange={(v) => update("insurance", v)}
          />
          <SettingRow
            icon={<BellIcon active={settings.liveNotifications} />}
            title="Live Notifications"
            subtitle="Receive real‑time status updates via SMS and push."
            checked={settings.liveNotifications}
            onChange={(v) => update("liveNotifications", v)}
          />
          <SettingRow
            icon={<NotesIcon active={settings.driverNotes} />}
            title="Driver Notes"
            subtitle="Add special instructions for the driver at pickup or drop‑off."
            checked={settings.driverNotes}
            onChange={(v) => update("driverNotes", v)}
            isLast
          />
        </div>
      </div>

      {/* ── Expandable driver notes input ── */}
      <div
        className="overflow-hidden transition-all duration-400"
        style={{
          maxHeight: settings.driverNotes ? "160px" : "0px",
          opacity: settings.driverNotes ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
          marginTop: settings.driverNotes ? "12px" : "0px",
        }}
      >
        <textarea
          placeholder="E.g. call before arriving, use back entrance, fragile items…"
          className="w-full rounded-2xl outline-none resize-none"
          rows={3}
          style={{
            backgroundColor: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            border: "2px solid transparent",
            padding: "16px 20px",
            fontFamily: "'Courier Prime', monospace",
            fontSize: "13px",
            color: "#040033",
            caretColor: "#1253FA",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1253FA")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
        />
      </div>
    </div>
  );
}