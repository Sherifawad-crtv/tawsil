import { X } from "lucide-react";
import type { ReactNode } from "react";

export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = "md",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
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
        className={`w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-[var(--radius-card)] bg-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-4.5 pb-3.5 flex-shrink-0 border-b border-border">
          <div>
            <h2 className="text-base text-navy" style={{ fontFamily: "var(--font-heading)" }}>
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-grey-light cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <X size={16} className="text-navy" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="px-5 py-3.5 border-t border-border flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
