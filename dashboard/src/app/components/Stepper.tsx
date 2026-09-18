import { ProgressBar } from "./boardui/ProgressBar";

export default function Stepper({ step, total, titles }: { step: number; total: number; titles: string[] }) {
  return (
    <div className="mb-5">
      <ProgressBar segments={total} activeSegment={step} className="mb-3" />
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
