import { useState, type ReactNode } from "react";
import ContentCopyRounded from "./icons/ContentCopyRounded";
import CheckRounded from "./icons/CheckRounded";
import ChatBubbleOutlineRounded from "./icons/ChatBubbleOutlineRounded";

/** 44px action button - comfortable one-handed touch target (Section 5.5). */
function ActionButton({ onClick, ariaLabel, children }: { onClick: () => void; ariaLabel: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
      style={{ backgroundColor: "#F5F5F3", border: "none" }}
    >
      {children}
    </button>
  );
}

/**
 * Label + value row. Copy is always offered when there's a value; `message`
 * additionally offers an sms: hand-off - both only render when the field has
 * a value (an empty field has nothing to copy or text). Phone is the only
 * field that uses `message` here, matching the spec's "both correctly shown
 * since Phone has a value" note.
 */
export default function ActionField({ label, value, message = false }: { label: string; value: string; message?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard access can be denied - fail silently, no error UI needed for a convenience action.
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
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {message && (
            <a href={`sms:${value}`} aria-label={`Message ${label}`} className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F5F5F3" }}>
              <ChatBubbleOutlineRounded sx={{ fontSize: 15, color: "#6B7280" }} />
            </a>
          )}
          <ActionButton onClick={copy} ariaLabel={`Copy ${label}`}>
            {copied ? <CheckRounded sx={{ fontSize: 15, color: "#16803C" }} /> : <ContentCopyRounded sx={{ fontSize: 14, color: "#6B7280" }} />}
          </ActionButton>
        </div>
      )}
    </div>
  );
}
