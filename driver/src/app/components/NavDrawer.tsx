import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import HomeRounded from "@mui/icons-material/HomeRounded";
import InboxRounded from "@mui/icons-material/InboxRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import type { DriverProfile } from "../lib/types";

const LINKS = [
  { to: "/home", label: "Home", icon: HomeRounded },
  { to: "/orders", label: "Orders", icon: InboxRounded },
  { to: "/account", label: "Account", icon: PersonRounded },
];

/**
 * Slide-in menu replacing the bottom tab bar on the map-first Home screen -
 * a full-bleed map has no room for a fixed bottom bar, and a floating
 * carousel already occupies that space. Portaled to <body> for the same
 * reason DispatchSheet is: nested inside an ancestor that ever gets a CSS
 * transform (a pressed card, a carousel snap), position: fixed re-anchors
 * to that ancestor instead of the viewport.
 */
export default function NavDrawer({ open, onClose, profile }: { open: boolean; onClose: () => void; profile: DriverProfile }) {
  const navigate = useNavigate();
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: "rgba(4,0,51,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="h-full flex flex-col"
        style={{ width: "78%", maxWidth: "320px", backgroundColor: "#F5F5F3", paddingTop: "max(env(safe-area-inset-top, 16px), 16px)" }}
      >
        <div className="flex items-center justify-between px-5 pb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white" }}>{profile.fullName[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>{profile.fullName}</p>
              <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>{profile.contractorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
            style={{ backgroundColor: "white" }}
          >
            <CloseRounded sx={{ fontSize: 15, color: "#040033" }} />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-3">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = link.to === "/home";
            return (
              <button
                key={link.to}
                onClick={() => { onClose(); navigate(link.to); }}
                className="flex items-center gap-3 rounded-2xl px-3.5 py-3 cursor-pointer active:scale-[0.98] transition-transform text-left"
                style={{ backgroundColor: active ? "white" : "transparent", boxShadow: active ? "0 2px 14px rgba(0,0,0,0.04)" : "none" }}
              >
                <Icon sx={{ fontSize: 19, color: active ? "#1253FA" : "#6B7280" }} />
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: active ? 700 : 600, fontSize: "14px", color: active ? "#040033" : "#6B7280" }}>
                  {link.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="px-3 pb-5" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}>
          <button
            onClick={() => { onClose(); navigate("/account"); }}
            className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-3 cursor-pointer active:scale-[0.98] transition-transform text-left"
          >
            <LogoutRounded sx={{ fontSize: 19, color: "#DC2626" }} />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#DC2626" }}>Logout</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
