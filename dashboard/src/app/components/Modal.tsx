import { CloseIcon } from "@solar-icons/react/line-duotone";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";

/**
 * The one modal shell. Footer buttons are passed bare — the shell lays them
 * out, so spacing can't drift between modals: `end` (the default) for a
 * single-step form's Cancel/Confirm pair, `between` for a wizard that splits
 * Back from Next.
 */
export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  footerLayout = "end",
  size = "md",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  footerLayout?: "end" | "between";
  size?: "sm" | "md" | "lg";
}) {
  const maxWidth = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{ backgroundColor: "rgba(4,0,51,0.45)" }}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 flex-shrink-0 border-b border-border">
          <div>
            <h2 className="text-title-3-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-body-2-regular text-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-grey-light cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <CloseIcon size={18} className="text-navy" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div
            className={cx(
              "px-6 py-4 border-t border-border flex-shrink-0 flex items-center gap-3",
              footerLayout === "between" ? "justify-between" : "justify-end",
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
