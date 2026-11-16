import type { ReactNode } from "react";
import { isExpired } from "../lib/format";
import type { Driver } from "../lib/types";

const INK = "#1F2A33";
const MUTED = "#7A6E52";
const ARABIC = "'Cairo', 'Noto Naskh Arabic', 'Segoe UI', system-ui, sans-serif";

function ddmmyyyy(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Plain avatar for the photo slot: the app has no driver photos. */
function PhotoPlaceholder() {
  return (
    <svg viewBox="0 0 72 88" width="100%" height="100%" aria-hidden>
      <rect width="72" height="88" fill="#E8EEE9" />
      <path d="M6 88c0-17 13-27 30-27s30 10 30 27z" fill="#2BA6B8" />
      <rect x="29" y="48" width="14" height="14" rx="5" fill="#E9B48F" />
      <ellipse cx="36" cy="36" rx="15" ry="17" fill="#F2C3A0" />
      <path d="M21 33c0-12 8-18 17-18 9 0 15 6 14 17-3-5-8-8-14-8-6 0-12 3-17 9z" fill="#3B2F2A" />
    </svg>
  );
}

function Field({ ar, en, children, danger }: { ar: string; en: string; children: ReactNode; danger?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2" style={{ color: MUTED }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "8.5px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{en}</span>
        <span dir="rtl" style={{ fontFamily: ARABIC, fontSize: "10px", fontWeight: 600 }}>{ar}</span>
      </div>
      <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: danger ? "#B91C1C" : INK, lineHeight: 1.25 }}>
        {children}
      </p>
    </div>
  );
}

/**
 * The driver's licence drawn like the printed Egyptian driving licence: cream
 * card with a fine security pattern, the issuing authority across the top, the
 * photo on the left and the licence details beside it. Only fields the app
 * holds are shown (name, number, expiry); the photo slot is a plain avatar.
 */
export default function LicenseCard({ driver }: { driver: Driver }) {
  const expired = isExpired(driver.licenseExpiry);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        aspectRatio: "1.62",
        background: "linear-gradient(135deg, #F8F2DF 0%, #F1E9CB 55%, #E9F0DE 100%)",
        boxShadow: "inset 0 0 0 1px rgba(160,130,70,0.25)",
      }}
    >
      {/* security pattern: concentric rings and fine diagonal lines, plus a faint seal */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 68% 62%, rgba(176,140,70,0.16) 0 1px, transparent 1px 7px)," +
            "repeating-linear-gradient(118deg, rgba(90,150,120,0.10) 0 1px, transparent 1px 5px)",
        }}
      />
      <div
        aria-hidden
        className="absolute rounded-full"
        style={{ width: "58%", aspectRatio: "1", right: "-6%", bottom: "-28%", border: "2px solid rgba(176,140,70,0.22)", boxShadow: "inset 0 0 0 10px rgba(176,140,70,0.06), inset 0 0 0 12px rgba(176,140,70,0.14)" }}
      />

      <div className="relative h-full flex flex-col p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div style={{ color: INK }}>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "8.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED }}>Driving license</p>
            <p dir="rtl" className="text-left" style={{ fontFamily: ARABIC, fontSize: "13px", fontWeight: 800, lineHeight: 1.2 }}>رخصة قيادة</p>
          </div>
          <div dir="rtl" className="text-right" style={{ fontFamily: ARABIC, color: INK }}>
            <p style={{ fontSize: "12px", fontWeight: 800, lineHeight: 1.25 }}>جمهورية مصر العربية</p>
            <p style={{ fontSize: "10.5px", fontWeight: 700, lineHeight: 1.25 }}>وزارة الداخلية</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3.5 mt-2.5 min-h-0">
          <div className="flex-shrink-0 rounded-md overflow-hidden" style={{ width: "27%", aspectRatio: "0.82", boxShadow: "0 0 0 1px rgba(120,100,60,0.4)" }}>
            <PhotoPlaceholder />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <Field ar="الاسم" en="Name">{driver.name}</Field>
            <Field ar="رقم الرخصة" en="License no.">{driver.licenseNumber}</Field>
            <Field ar="تاريخ الانتهاء" en="Expires" danger={expired}>{ddmmyyyy(driver.licenseExpiry)}</Field>
          </div>
        </div>

        {expired && (
          <div
            aria-hidden
            className="absolute"
            style={{
              right: "6%",
              bottom: "5%",
              transform: "rotate(-12deg)",
              border: "2px solid rgba(185,28,28,0.85)",
              color: "rgba(185,28,28,0.9)",
              borderRadius: "6px",
              padding: "1px 8px",
              fontFamily: "'Courier Prime', monospace",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.12em",
              background: "rgba(255,255,255,0.35)",
            }}
          >
            EXPIRED
          </div>
        )}
      </div>
    </div>
  );
}
