import { useState } from "react";
import VisibilityRounded from "./icons/VisibilityRounded";
import VisibilityOffRounded from "./icons/VisibilityOffRounded";
import TrendingUpRounded from "./icons/TrendingUpRounded";
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

/**
 * Wallet-style revenue card: total earned on completed trips, how much of it
 * came in this month, and what is still to come. The eye hides every figure
 * (remembered on the device) so it can be glanced at in public.
 */
export default function WalletCard({ summary }: { summary: RevenueSummary }) {
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
      className="relative overflow-hidden rounded-[22px] p-5 text-white"
      style={{ background: "linear-gradient(135deg, #040033 0%, #0A0070 50%, #1253FA 100%)", boxShadow: "0 8px 32px rgba(18,83,250,0.25)" }}
    >
      <div aria-hidden className="absolute rounded-full" style={{ width: 220, height: 220, right: -70, top: -90, border: "1px solid rgba(255,255,255,0.10)" }} />
      <div aria-hidden className="absolute rounded-full" style={{ width: 140, height: 140, right: -30, top: -50, border: "1px solid rgba(255,255,255,0.10)" }} />

      <div className="relative flex items-center justify-between">
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
          Total revenue
        </span>
        <button
          onClick={toggle}
          aria-label={hidden ? "Show amounts" : "Hide amounts"}
          className="w-10 h-10 -mr-2 -mt-2 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
          style={{ background: "none", border: "none" }}
        >
          {hidden ? <VisibilityOffRounded sx={{ fontSize: 20, color: "rgba(255,255,255,0.8)" }} /> : <VisibilityRounded sx={{ fontSize: 20, color: "rgba(255,255,255,0.8)" }} />}
        </button>
      </div>

      <div className="relative flex items-baseline gap-2 mt-1">
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "rgba(255,255,255,0.7)" }}>EGP</span>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "36px", lineHeight: 1.1 }}>{show(money(summary.total))}</span>
      </div>

      <div
        className="relative inline-flex items-center gap-1.5 mt-3 rounded-xl px-2.5 py-1"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      >
        <TrendingUpRounded sx={{ fontSize: 14, color: "#86EFAC" }} />
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px" }}>{show(`${money(summary.thisMonth)} EGP`)} this month</span>
      </div>

      <div className="relative grid grid-cols-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
        <Figure label="Upcoming" value={show(`${money(summary.upcoming)}`)} />
        <Figure label="Trips done" value={String(summary.tripsDone)} />
        <Figure label="Avg / trip" value={show(money(summary.averagePerTrip))} />
      </div>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{label}</p>
      <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "15px", marginTop: "2px" }}>{value}</p>
    </div>
  );
}
