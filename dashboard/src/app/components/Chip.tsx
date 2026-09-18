import type { HTMLAttributes } from "react";
import { cx } from "../lib/cx";

/**
 * BoardUI's Chip recipe (components/base/badges/chip.tsx), token-for-token:
 * three emphasis variants and the same status color pairs, rendered on the
 * ported status-*-background/-text tokens rather than ad-hoc hex. Kept our
 * own call-site vocabulary ("positive"/"negative"/"neutral" reads better at
 * a glance than "lime"/"rose"/"neutral") mapped onto BoardUI's actual pairs
 * below, so every existing caller is unchanged and every pixel comes from
 * their tokens.
 */
type ChipVariant = "bold" | "subtle" | "caption";
type ChipColor = "positive" | "negative" | "neutral" | "pending" | "completed" | "cancelled";

const COLOR_STYLES: Record<ChipColor, string> = {
  positive: "bg-status-lime-background text-status-lime-text",
  negative: "bg-status-rose-background text-status-rose-text",
  neutral: "bg-background-tertiary-default text-text-secondary",
  pending: "bg-status-yellow-background text-status-yellow-text",
  completed: "bg-status-lime-background text-status-lime-text",
  cancelled: "bg-status-rose-background text-status-rose-text",
};

const VARIANT_STYLES: Record<ChipVariant, string> = {
  bold: "py-0.5 text-body-medium",
  subtle: "py-1 text-body-medium",
  caption: "py-1 text-caption-1-medium tracking-[0.15px]",
};

/** Small color-coded pill — delta readouts on stat/chart cards and plain tags, in the same visual family as StatusBadge. */
export function Chip({
  variant = "bold",
  color = "neutral",
  className,
  children,
  ...props
}: { variant?: ChipVariant; color?: ChipColor } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-md px-1.5 whitespace-nowrap",
        VARIANT_STYLES[variant],
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
