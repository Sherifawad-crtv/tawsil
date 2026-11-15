import { useState, type ElementType } from "react";
import VisibilityRounded from "./icons/VisibilityRounded";
import VisibilityOffRounded from "./icons/VisibilityOffRounded";
import TrendingUpRounded from "./icons/TrendingUpRounded";
import SettingsRounded from "./icons/SettingsRounded";
import type { RevenueSummary } from "../lib/selectors";

const STORAGE_KEY = "contractor.walletHidden";

function readHidden() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const money = (n: number) => Math.round(n).toLocaleString("en-US");

export interface HeroAction {
  label: string;
  icon: ElementType;
  onClick: () => void;
  /** Small count shown on the tile, e.g. orders waiting for dispatch. */
  badge?: number;
}

/**
 * Hero of the Home screen: a full-width navy panel with rounded bottom corners
 * holding the greeting, the revenue "wallet" (total, this month, upcoming) and
 * three quick actions. The eye hides every amount; the choice is remembered on
 * the device.
 */
export default function WalletHero({
  title,
  subtitle,
  summary,
  actions,
  onSettings,
}: {
  title: string;
  subtitle: string;
  summary: RevenueSummary;
  actions: HeroAction[];
  onSettings: () => void;
}) {
  const [hidden, setHidden] = useState(readHidden);
  const show = (text: string) => (hidden ? "••••" : text);

  function toggle() {
    setHidden((h) => {
      try {
        localStorage.setItem(STORAGE_KEY, h ? "0" : "1");
      } catch {
        // storage unavailable: the choice just won't be remembered
      }
      return !h;
    });
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #040033 0%, #0A0070 62%, #1239B8 100%)",
        borderRadius: "0 0 32px 32px",
      }}
    >
      <div aria-hidden className="absolute rounded-full" style={{ width: 260, height: 260, right: -90, top: -110, border: "1px solid rgba(255,255,255,0.09)" }} />
      <div aria-hidden className="absolute rounded-full" style={{ width: 160, height: 160, right: -40, top: -60, border: "1px solid rgba(255,255,255,0.09)" }} />

      <div className="relative w-full max-w-lg mx-auto px-4 pb-6" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "white", lineHeight: "1.15" }}>{title}</h1>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "rgba(255,255,255,0.65)", marginTop: "6px" }}>{subtitle}</p>
          </div>
          <button
            onClick={onSettings}
            aria-label="Account"
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "none" }}
          >
            <SettingsRounded sx={{ fontSize: 19, color: "white" }} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-7">
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
            Total revenue
          </span>
          <button
            onClick={toggle}
            aria-label={hidden ? "Show amounts" : "Hide amounts"}
            className="w-10 h-10 -mr-2 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            style={{ background: "none", border: "none" }}
          >
            {hidden ? <VisibilityOffRounded sx={{ fontSize: 20, color: "rgba(255,255,255,0.8)" }} /> : <VisibilityRounded sx={{ fontSize: 20, color: "rgba(255,255,255,0.8)" }} />}
          </button>
        </div>

        <div className="flex items-baseline gap-2 -mt-1">
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>EGP</span>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "40px", lineHeight: 1.1, color: "white" }}>{show(money(summary.total))}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
            <TrendingUpRounded sx={{ fontSize: 14, color: "#86EFAC" }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "white" }}>{show(`${money(summary.thisMonth)} EGP`)} this month</span>
          </span>
          <span className="inline-flex items-center rounded-xl px-2.5 py-1" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "white" }}>{show(`${money(summary.upcoming)} EGP`)} upcoming</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="relative rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-[0.96] transition-transform"
              style={{ backgroundColor: "#EAF0FE", border: "none", height: "84px" }}
            >
              <a.icon sx={{ fontSize: 24, color: "#040033" }} />
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{a.label}</span>
              {a.badge ? (
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ top: "8px", right: "8px", minWidth: "20px", height: "20px", padding: "0 5px", backgroundColor: "#B45309", color: "white", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11px" }}
                >
                  {a.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
