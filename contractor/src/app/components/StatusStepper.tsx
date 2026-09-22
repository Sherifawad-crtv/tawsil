import CheckRounded from "./icons/CheckRounded";
import CloseRounded from "./icons/CloseRounded";
import type { OrderStatus } from "../lib/types";

const STEPS: OrderStatus[] = ["Pending", "Accepted", "Assigned", "In Progress", "Completed"];

export default function StatusStepper({ status }: { status: OrderStatus }) {
  const cancelled = status === "Cancelled";
  const steps = cancelled ? STEPS.slice(0, 3).concat("Cancelled" as OrderStatus) : STEPS;
  const currentIndex = steps.indexOf(status === "Cancelled" ? ("Cancelled" as OrderStatus) : status);

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done = i < currentIndex || (i === currentIndex && !cancelled);
        const isCurrent = i === currentIndex;
        const isCancelledStep = cancelled && isCurrent;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5" style={{ width: "58px" }}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: isCancelledStep ? "#DC2626" : done ? "#1253FA" : "#E8E8E5",
                }}
              >
                {isCancelledStep ? (
                  <CloseRounded sx={{ fontSize: 13, color: "white" }} />
                ) : done ? (
                  <CheckRounded sx={{ fontSize: 13, color: "white" }} />
                ) : null}
              </div>
              <span
                className="text-center"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: "9.5px",
                  color: isCancelledStep ? "#DC2626" : done ? "#040033" : "#9CA3AF",
                  lineHeight: 1.2,
                }}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 -mt-4"
                style={{ backgroundColor: i < currentIndex ? "#1253FA" : "#E8E8E5" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
