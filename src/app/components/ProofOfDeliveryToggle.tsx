import CameraAltRounded from "./icons/CameraAltRounded";

export default function ProofOfDeliveryToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl active:bg-black/[0.02] cursor-pointer flex-shrink-0"
      style={{
        backgroundColor: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        transition: "background-color 0.3s ease",
      }}
      onClick={() => onChange(!value)}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-2xl"
        style={{
          width: "44px",
          height: "44px",
          backgroundColor: value ? "rgba(18,83,250,0.08)" : "#F0F0EE",
          transition: "background-color 0.3s ease",
        }}
      >
        <CameraAltRounded sx={{ fontSize: 22, color: value ? "#1253FA" : "#9CA3AF" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>
            Proof of Delivery
          </span>
          <span
            className="px-2 py-0.5 rounded-lg"
            style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.08)", letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Recommended
          </span>
        </div>
        <p className="mt-0.5" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", lineHeight: "1.4" }}>
          Require photo confirmation at drop‑off.
        </p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={(e) => { e.stopPropagation(); onChange(!value); }}
        className="relative flex-shrink-0 cursor-pointer"
        style={{
          width: "52px", height: "30px", borderRadius: "15px",
          backgroundColor: value ? "#1253FA" : "#D8D9D4",
          transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1)",
          border: "none", padding: 0, outline: "none",
        }}
      >
        <div style={{
          position: "absolute", inset: "-3px", borderRadius: "18px",
          boxShadow: value ? "0 0 0 3px rgba(18,83,250,0.15)" : "none",
          transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "3px",
          left: value ? "25px" : "3px",
          width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "white",
          boxShadow: value ? "0 2px 8px rgba(18,83,250,0.3)" : "0 1px 4px rgba(0,0,0,0.15)",
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s",
        }} />
      </button>
    </div>
  );
}
