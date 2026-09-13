export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 cursor-pointer"
      style={{
        width: "34px",
        height: "20px",
        borderRadius: "10px",
        backgroundColor: checked ? "var(--color-blue)" : "var(--color-grey)",
        transition: "background-color 0.2s ease",
        border: "none",
        padding: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "16px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}
