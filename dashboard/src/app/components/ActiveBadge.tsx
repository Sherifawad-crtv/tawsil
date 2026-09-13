export default function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-1.5 py-1 rounded-md text-caption-1-medium tracking-[0.15px] ${
        active ? "bg-[#E7F6EC] text-status-completed" : "bg-[#F0F0EE] text-muted"
      }`}
      style={{ fontFamily: "var(--font-sub)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? "#16803C" : "#9CA3AF" }} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
