import { useState } from "react";
import ContentCopyRounded from "./icons/ContentCopyRounded";
import CheckRounded from "./icons/CheckRounded";

/** Label and value with a copy button; the button only shows when there is something to copy. */
export default function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard can be blocked (permissions, insecure context); nothing useful to show.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#626A76", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: value ? "#040033" : "#626A76", marginTop: "2px" }}>
          {value || "Not set"}
        </p>
      </div>
      {value && (
        <button
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
          style={{ backgroundColor: "#F5F5F3", border: "none" }}
        >
          {copied ? <CheckRounded sx={{ fontSize: 16, color: "#16803C" }} /> : <ContentCopyRounded sx={{ fontSize: 16, color: "#626A76" }} />}
        </button>
      )}
    </div>
  );
}
