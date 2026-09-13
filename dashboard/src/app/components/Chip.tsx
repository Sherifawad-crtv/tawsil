import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

type ChipColor = "positive" | "negative" | "neutral" | "pending" | "completed" | "cancelled";

const COLOR_STYLES: Record<ChipColor, string> = {
  positive: "bg-[#E7F6EC] text-status-completed",
  negative: "bg-[#FDECEC] text-status-cancelled",
  neutral: "bg-white text-muted",
  pending: "bg-[#FEF3E2] text-status-pending",
  completed: "bg-[#E7F6EC] text-status-completed",
  cancelled: "bg-[#FDECEC] text-status-cancelled",
};

/** Small color-coded pill — delta readouts on stat/chart cards, in the same visual family as StatusBadge. */
export function Chip({
  color = "neutral",
  className,
  children,
  ...props
}: { color?: ChipColor } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-medium whitespace-nowrap",
        COLOR_STYLES[color],
        className
      )}
      style={{ fontFamily: "var(--font-sub)" }}
      {...props}
    >
      {children}
    </span>
  );
}
