import { useEffect, useRef } from "react";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";

export type NavScreen = "home" | "activity" | "profile" | "insights";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

const NAV_ITEMS: { id: NavScreen; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (a) => <HomeOutlined sx={{ fontSize: 20, color: a ? "#1253FA" : "#6B7280" }} />,
  },
  {
    id: "activity",
    label: "Activity",
    icon: (a) => <CalendarMonthOutlined sx={{ fontSize: 20, color: a ? "#1253FA" : "#6B7280" }} />,
  },
  {
    id: "insights",
    label: "Insights",
    icon: (a) => <BarChartOutlined sx={{ fontSize: 20, color: a ? "#1253FA" : "#6B7280" }} />,
  },
  {
    id: "profile",
    label: "Profile",
    icon: (a) => <PersonOutlined sx={{ fontSize: 20, color: a ? "#1253FA" : "#6B7280" }} />,
  },
];

export default function SideNav({ isOpen, onClose, activeScreen, onNavigate }: SideNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          backgroundColor: isOpen ? "rgba(4,0,51,0.4)" : "rgba(4,0,51,0)",
          backdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "background-color 0.35s ease, backdrop-filter 0.35s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          maxWidth: "80vw",
          zIndex: 999,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          backgroundColor: "#FAFAF8",
          boxShadow: isOpen ? "8px 0 40px rgba(4,0,51,0.12)" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: "max(env(safe-area-inset-top, 20px), 20px) 20px 16px 20px",
          }}
        >
          <div>
            <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>
              FleetLink
            </h2>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
              Logistics Platform
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            style={{ backgroundColor: "#F0F0EE" }}
          >
            <CloseRounded sx={{ fontSize: 18, color: "#040033" }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#E8E8E5", margin: "0 20px" }} />

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 py-4 px-3">
          {NAV_ITEMS.map((item) => {
            const active = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  backgroundColor: active ? "rgba(18,83,250,0.06)" : "transparent",
                  border: "none",
                  textAlign: "left",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: active ? "rgba(18,83,250,0.1)" : "#F0F0EE",
                    transition: "background-color 0.3s",
                  }}
                >
                  {item.icon(active)}
                </div>
                <span
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: active ? 700 : 500,
                    fontSize: "15px",
                    color: active ? "#1253FA" : "#040033",
                    transition: "color 0.3s",
                  }}
                >
                  {item.label}
                </span>
                {active && (
                  <div
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#1253FA" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 pb-6">
          <div style={{ height: "1px", backgroundColor: "#E8E8E5", marginBottom: "16px" }} />
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#040033" }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "14px", color: "white" }}>AK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>Ahmed Khan</p>
              <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>ahmed@fleetlink.ae</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Hamburger Button (exported separately) ── */
export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
      style={{
        top: "max(env(safe-area-inset-top, 16px), 16px)",
        left: "16px",
        width: "44px",
        height: "44px",
        borderRadius: "16px",
        backgroundColor: "white",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        border: "none",
      }}
    >
      <MenuRounded sx={{ fontSize: 24, color: "#040033" }} />
    </button>
  );
}