import { useState } from "react";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import AuthTextField from "./AuthTextField";
import { PrimaryButton, GhostButton } from "./StepChrome";
import { useKeyboardInset } from "../../hooks/useKeyboardInset";

/**
 * The one thing individual signup skips - asked once, right before the
 * first real action (booking a truck), not on every screen.
 */
export default function AddEmailModal({ onSave, onSkip }: { onSave: (email: string) => void; onSkip: () => void }) {
  const [email, setEmail] = useState("");
  const keyboardInset = useKeyboardInset();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(4,0,51,0.5)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onSkip(); }}
    >
      <div
        className="w-full max-w-lg flex flex-col px-5 pt-6"
        style={{
          backgroundColor: "#F5F5F3",
          borderRadius: "24px 24px 0 0",
          paddingBottom: keyboardInset > 0 ? "20px" : "max(env(safe-area-inset-bottom, 20px), 20px)",
          // The sheet holds the input, so the whole thing rides up above the
          // keyboard together - not just the button underneath it.
          marginBottom: keyboardInset,
          transition: keyboardInset > 0 ? "none" : "margin-bottom 0.2s ease-out",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
        >
          <MailOutlineOutlined sx={{ fontSize: 26, color: "#1253FA" }} />
        </div>

        <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>
          Add your email
        </h2>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginTop: "6px", marginBottom: "20px" }}>
          For receipts and booking confirmations. You can skip this and add it later from your profile.
        </p>

        <div className="mb-5">
          <AuthTextField
            label="Email address"
            type="email"
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <PrimaryButton label="Save & Continue" onClick={() => onSave(email)} disabled={!email.includes("@")} />
        <GhostButton label="Skip for now" onClick={onSkip} />
      </div>
    </div>
  );
}
