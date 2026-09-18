import AddRounded from "@mui/icons-material/AddRounded";

/**
 * Bottom-right floating action button. `bottomOffset` gives callers control
 * over clearance above the fixed tab bar / bottom sheet so the FAB never sits
 * on top of scrollable content (the overlap bug flagged on the Trucks list).
 */
export default function Fab({ onClick, label, bottomOffset = 96 }: { onClick: () => void; label: string; bottomOffset?: number }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed z-30 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
      style={{
        right: "18px",
        bottom: `max(calc(env(safe-area-inset-bottom, 0px) + ${bottomOffset}px), ${bottomOffset}px)`,
        width: "56px",
        height: "56px",
        borderRadius: "20px",
        background: "#040033",
        boxShadow: "0 8px 24px rgba(4,0,51,0.30)",
        border: "none",
      }}
    >
      <AddRounded sx={{ fontSize: 26, color: "white" }} />
    </button>
  );
}
