import { useState } from "react";
import { CloudUploadIcon, FileTextIcon, CloseIcon } from "@solar-icons/react/linear";

export default function FileUploadField({
  label,
  required,
  onChange,
}: {
  label: string;
  required?: boolean;
  onChange?: (file: File | null) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div>
      <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
        {label}
        {required && <span className="text-status-cancelled"> *</span>}
      </label>
      {fileName ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2lg border border-border bg-grey-light">
          <FileTextIcon size={16} className="text-blue flex-shrink-0" />
          <span className="text-body-regular text-navy truncate flex-1" style={{ fontFamily: "var(--font-mono)" }}>
            {fileName}
          </span>
          <button
            type="button"
            onClick={() => {
              setFileName(null);
              onChange?.(null);
            }}
            className="p-1 rounded hover:bg-white cursor-pointer flex-shrink-0"
          >
            <CloseIcon size={14} className="text-muted" />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-2lg border border-dashed border-border bg-grey-light cursor-pointer hover:border-blue/40 transition-colors">
          <CloudUploadIcon size={16} className="text-muted flex-shrink-0" />
          <span className="text-body-regular text-muted">Upload PDF</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setFileName(file?.name ?? null);
              onChange?.(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
