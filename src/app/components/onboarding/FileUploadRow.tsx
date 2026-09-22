import { useRef, useState } from "react";
import UploadFileRounded from "../icons/UploadFileRounded";
import PictureAsPdfRounded from "../icons/PictureAsPdfRounded";
import CloseRounded from "../icons/CloseRounded";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUploadRow({
  label,
  hint,
  fileName,
  onSelect,
  onRemove,
}: {
  label: string;
  hint: string;
  fileName?: string;
  onSelect: (fileName: string) => void;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(f: File) {
    setError("");
    if (f.type && f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    setFileSize(f.size);
    setUploading(true);
    setProgress(0);

    // No real backend to upload to - a brief simulated transfer keeps the
    // interaction native-like instead of the file just appearing instantly.
    const start = Date.now();
    const duration = 550;
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setUploading(false);
        onSelect(f.name);
      }
    };
    requestAnimationFrame(tick);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setFileSize(null);
    setProgress(0);
    setUploading(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  }

  const isDone = !!fileName && !uploading;

  return (
    <div className="flex flex-col gap-1.5">
      <span
        style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {label}
      </span>

      <div
        role="button"
        tabIndex={0}
        onClick={() => { if (!uploading) inputRef.current?.click(); }}
        onKeyDown={(e) => { if (!uploading && (e.key === "Enter" || e.key === " ")) inputRef.current?.click(); }}
        className="relative flex flex-col items-center justify-center w-full rounded-2xl cursor-pointer active:scale-[0.98] transition-transform text-center overflow-hidden"
        style={{
          height: "136px",
          padding: "16px",
          backgroundColor: "white",
          boxShadow: isDone ? "0 0 0 1.5px #1253FA" : "0 1px 6px rgba(0,0,0,0.04)",
          border: isDone || uploading ? "none" : "1.5px dashed #D8D9D4",
        }}
      >
        {isDone && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer active:scale-90"
            style={{ backgroundColor: "#F5F5F3" }}
            aria-label={`Remove ${label}`}
          >
            <CloseRounded sx={{ fontSize: 15, color: "#6B7280" }} />
          </button>
        )}

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isDone ? "rgba(18,83,250,0.08)" : "#F5F5F3" }}
        >
          {isDone ? (
            <PictureAsPdfRounded sx={{ fontSize: 22, color: "#1253FA" }} />
          ) : (
            <UploadFileRounded sx={{ fontSize: 22, color: uploading ? "#1253FA" : "#9CA3AF" }} />
          )}
        </div>

        <p className="mt-2.5 px-2 w-full truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
          {uploading ? "Uploading…" : fileName ? `${fileName}${fileSize ? ` · ${formatFileSize(fileSize)}` : ""}` : hint}
        </p>

        {uploading && (
          <div
            className="absolute left-0 bottom-0 h-[2.5px]"
            style={{ width: `${progress}%`, backgroundColor: "#1253FA", transition: "width 0.05s linear" }}
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {error && (
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#DC2626" }}>{error}</span>
      )}
    </div>
  );
}
