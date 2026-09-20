import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";

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
