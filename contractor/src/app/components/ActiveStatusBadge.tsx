/** Active / Inactive pill, same style as the order status pills. */
export default function ActiveStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className="rounded-xl whitespace-nowrap"
      style={{
        backgroundColor: active ? "#E7F6EC" : "#FDECEC",
        color: active ? "#16803C" : "#DC2626",
        fontFamily: "'Courier Prime', monospace",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: "4px 10px",
      }}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
