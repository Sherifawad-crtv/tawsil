export default function Stepper({ step, total, titles }: { step: number; total: number; titles: string[] }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-3">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full flex-1 transition-colors"
            style={{ backgroundColor: i + 1 <= step ? "var(--color-blue)" : "var(--color-border)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>
          {titles[step - 1]}
        </span>
        <span className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
          Step {step} / {total}
        </span>
      </div>
    </div>
  );
}
