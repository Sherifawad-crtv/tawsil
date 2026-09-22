import CheckCircleRounded from "./icons/CheckCircleRounded";
import CancelRounded from "./icons/CancelRounded";

/** Display-only Active/Inactive badge for Edit Truck / Edit Driver headers. */
export default function ActiveStatusBadge({ active }: { active: boolean }) {
  const Icon = active ? CheckCircleRounded : CancelRounded;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
      style={{
        backgroundColor: active ? "#E7F6EC" : "#FDECEC",
        color: active ? "#16803C" : "#DC2626",
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 700,
        fontSize: "11.5px",
      }}
    >
      <Icon sx={{ fontSize: 13 }} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
