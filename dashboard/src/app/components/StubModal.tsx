import { X } from "lucide-react";

export default function StubModal({
  title,
  note,
  onClose,
}: {
  title: string;
  note: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(4,0,51,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-card)] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-grey-light cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <X size={18} className="text-navy" />
          </button>
        </div>
        <p className="text-sm text-muted leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
          {note}
        </p>
      </div>
    </div>
  );
}
