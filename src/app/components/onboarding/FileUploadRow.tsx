import { useRef, useState } from "react";
import UploadFileRounded from "@mui/icons-material/UploadFileRounded";
import PictureAsPdfRounded from "@mui/icons-material/PictureAsPdfRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";

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
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => { if (!uploading) inputRef.current?.click(); }}
        onKeyDown={(e) => { if (!uploading && (e.key === "Enter" || e.key === " ")) inputRef.current?.click(); }}
        className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform text-left relative overflow-hidden"
        style={{
          backgroundColor: "white",
          boxShadow: isDone ? "0 0 0 1.5px #1253FA" : "0 1px 6px rgba(0,0,0,0.04)",
          border: isDone || uploading ? "none" : "1.5px dashed #D8D9D4",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isDone ? "rgba(18,83,250,0.08)" : "#F5F5F3" }}
        >
          {isDone ? (
            <PictureAsPdfRounded sx={{ fontSize: 20, color: "#1253FA" }} />
          ) : (
            <UploadFileRounded sx={{ fontSize: 20, color: uploading ? "#1253FA" : "#9CA3AF" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
            {label}
          </p>
          <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
            {uploading ? "Uploading…" : fileName ? `${fileName}${fileSize ? ` · ${formatFileSize(fileSize)}` : ""}` : hint}
          </p>
        </div>

        {isDone && (
          <button
            type="button"
            onClick={handleRemove}
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-90"
            style={{ backgroundColor: "#F5F5F3" }}
            aria-label={`Remove ${label}`}
          >
            <CloseRounded sx={{ fontSize: 15, color: "#6B7280" }} />
          </button>
        )}

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
        <p className="mt-1.5 px-1" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}
