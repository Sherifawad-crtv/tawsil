import { lazy } from "react";
import type { ReactNode } from "react";
import { formatAmount } from "../../lib/format";

// three.js is heavy - kept out of the main bundle so every other page loads
// exactly as fast as it did before this view existed.
export const OrdersGlobe = lazy(() => import("../globe/OrdersGlobe"));

// Square canvas, centred in the band.
//
// The two numbers below were measured off the rendered page, not derived:
// scanning the gutter column pixel by pixel, the sphere covers ~90% of its
// square canvas at OrdersGlobe's framing, and the drop shadow reaches about
// 34px past its bottom edge. The band is sized from those, so the sphere and
// its shadow always clear the top and bottom - the only side ever cut is
// left/right, where the cards overlap it on purpose.
export const GLOBE_PX = 820;
const SPHERE_PX = Math.round(GLOBE_PX * 0.9);
export const BAND_MIN_PX = SPHERE_PX + 2 * 68;

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-caption-2-semibold uppercase tracking-wide text-muted"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export function Money({ value, strong = false, muted = false }: { value: number; strong?: boolean; muted?: boolean }) {
  return (
    <span
      className={
        strong
          ? "text-body-2-semibold text-navy"
          : muted
            ? "text-body-2-regular text-muted"
            : "text-body-2-regular text-navy"
      }
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {formatAmount(value)}
    </span>
  );
}
