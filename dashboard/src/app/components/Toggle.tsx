export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 cursor-pointer"
      style={{
        width: "48px",
        height: "28px",
        borderRadius: "14px",
        backgroundColor: checked ? "var(--color-blue)" : "var(--color-grey)",
        transition: "background-color 0.2s ease",
        border: "none",
        padding: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          width: "22px",
          height: "22px",
          borderRadius: "11px",
          backgroundColor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}
