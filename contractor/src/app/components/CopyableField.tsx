import { useState } from "react";
import ContentCopyRounded from "./icons/ContentCopyRounded";
import CheckRounded from "./icons/CheckRounded";

/**
 * Label + value row with a copy icon. The icon renders only when there's a
 * value to copy - an empty field (Username in the seeded profile) has
 * nothing to copy, so no action icon is shown until it's filled in.
 */
export default function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) - fail silently, no error UI needed for a convenience action.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#9CA3AF" }}>{label}</p>
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13.5px", color: value ? "#040033" : "#9CA3AF" }}>
          {value || "Not set"}
        </p>
      </div>
      {value && (
        <button onClick={copy} aria-label={`Copy ${label}`} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0" style={{ backgroundColor: "#F0F0EE" }}>
          {copied ? <CheckRounded sx={{ fontSize: 15, color: "#16803C" }} /> : <ContentCopyRounded sx={{ fontSize: 14, color: "#6B7280" }} />}
        </button>
      )}
    </div>
  );
}
