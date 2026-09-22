import type { ReactNode } from "react";
import ArrowBackIosNewRounded from "../icons/ArrowBackIosNewRounded";
import { useKeyboardInset } from "../../hooks/useKeyboardInset";

/** Same growing-pill progress indicator as the booking flow's StepIndicator. */
export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-between mb-5 flex-shrink-0">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i + 1 <= step ? "18px" : "6px",
              height: "6px",
              backgroundColor: i + 1 <= step ? "#1253FA" : "#D8D9D4",
              transition: "width 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease",
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, color: "#1253FA", fontSize: "11px", letterSpacing: "0.08em" }}>
        {step} / {total}
      </span>
    </div>
  );
}

/** Same back-chevron-plus-label the booking flow uses. */
export function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 mb-3 cursor-pointer active:opacity-70 transition-opacity flex-shrink-0 w-fit"
      style={{ border: "none", background: "none", padding: 0 }}
    >
      <ArrowBackIosNewRounded sx={{ fontSize: 14, color: "#040033" }} />
      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{label}</span>
    </button>
  );
}

export function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "24px", color: "#040033", lineHeight: "1.15" }}>{title}</h1>
      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#9CA3AF", marginTop: "6px" }}>{subtitle}</p>
    </div>
  );
}

/** Same full-width blue CTA the booking flow uses. */
export function PrimaryButton({
  label,
  onClick,
  disabled,
  loading,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
      style={{
        backgroundColor: disabled ? "#D8D9D4" : "#1253FA",
        boxShadow: disabled ? "none" : "0 4px 20px rgba(18,83,250,0.3)",
        padding: "16px",
        border: "none",
        transition: "background-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease",
      }}
    >
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>
        {loading ? "Please wait…" : label}
      </span>
    </button>
  );
}

/** A ghost/secondary text-only action, e.g. "Skip for now". */
export function GhostButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-center cursor-pointer active:opacity-70 transition-opacity flex-shrink-0"
      style={{ border: "none", background: "none", padding: "10px", fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#6B7280" }}
    >
      {label}
    </button>
  );
}

/**
 * Pins its children (a PrimaryButton, optionally a GhostButton under it) to
 * the bottom of the screen and tracks the on-screen keyboard, so the CTA
 * rides just above it instead of getting covered - the same place a native
 * app's keyboard accessory bar sits. Reserve matching space at the bottom
 * of the scrollable content with reserveSpace() so nothing sits hidden
 * behind it while the keyboard is closed.
 */
export function CTAFooter({ children }: { children: ReactNode }) {
  const keyboardInset = useKeyboardInset();
  const keyboardOpen = keyboardInset > 0;

  return (
    <div
      className="fixed left-0 right-0 z-30 flex-shrink-0"
      style={{
        bottom: keyboardOpen ? `${keyboardInset}px` : 0,
        backgroundColor: "#F5F5F3",
        boxShadow: keyboardOpen ? "0 -1px 0 0 #E8E8E5" : "none",
        transition: keyboardOpen ? "none" : "bottom 0.2s ease-out",
      }}
    >
      <div
        className="w-full max-w-lg mx-auto px-4 flex flex-col gap-1"
        style={{
          paddingTop: "12px",
          paddingBottom: keyboardOpen ? "12px" : "max(env(safe-area-inset-bottom, 12px), 12px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Bottom padding for scrollable content so it clears a CTAFooter - about
 *  one button's height plus its footer padding and the home-indicator gap. */
export const CTA_FOOTER_CLEARANCE = "104px";
