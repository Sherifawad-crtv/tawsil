import { useLocation, useNavigate } from "react-router";
import HomeRounded from "./icons/HomeRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import GroupsRounded from "./icons/GroupsRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";

type IconComponent = typeof HomeRounded;

const TABS: { to: string; label: string; icon: IconComponent }[] = [
  { to: "/home", label: "Home", icon: HomeRounded },
  { to: "/trucks", label: "Trucks", icon: LocalShippingRounded },
  { to: "/drivers", label: "Drivers", icon: GroupsRounded },
  { to: "/history", label: "History", icon: AccessTimeRounded },
];

// Fixed slot geometry - every inactive tab is the same square size and
// the active pill is always the same width, so the selector's position
// is computed directly from the active index instead of being measured
// off a button mid-transition (that's what made the padding look uneven).
const CONTAINER_PADDING = 6;
const GAP = 4;
const INACTIVE_WIDTH = 44;
const ACTIVE_WIDTH = 118;
const SLOT = INACTIVE_WIDTH + GAP;

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)"; // smooth deceleration, no overshoot
const DURATION_MS = 380;

/**
 * Floating capsule tab bar - same pill-nav construction as the client app's
 * BottomNav: a single selector of constant width walks between fixed slots,
 * staying visible throughout instead of resizing to match per-button content.
 */
export default function BottomTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeIndex = Math.max(0, TABS.findIndex((tab) => pathname.startsWith(tab.to)));
  const indicatorLeft = CONTAINER_PADDING + activeIndex * SLOT;

  return (
    <nav
      className="fixed left-1/2 z-40 flex items-center"
      style={{
        bottom: "max(env(safe-area-inset-bottom, 16px), 16px)",
        transform: "translateX(-50%)",
        gap: `${GAP}px`,
        padding: `${CONTAINER_PADDING}px`,
        borderRadius: "999px",
        backgroundColor: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "0 10px 36px rgba(4,0,51,0.16), inset 0 1px 0 rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.6)",
      }}
    >
      {/* Sliding selector - constant size, always visible, walks between slots */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: `${CONTAINER_PADDING}px`,
          bottom: `${CONTAINER_PADDING}px`,
          left: 0,
          width: `${ACTIVE_WIDTH}px`,
          borderRadius: "999px",
          backgroundColor: "#040033",
          transform: `translateX(${indicatorLeft}px)`,
          transition: `transform ${DURATION_MS}ms ${EASE}`,
          willChange: "transform",
          zIndex: 0,
        }}
      />

      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.to);
        const Icon = tab.icon;
        return (
          <button
            key={tab.to}
            onClick={() => navigate(tab.to)}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
            className="relative flex items-center justify-center cursor-pointer active:scale-95"
            style={{
              flexShrink: 0,
              border: "none",
              background: "none",
              height: "44px",
              width: active ? `${ACTIVE_WIDTH}px` : `${INACTIVE_WIDTH}px`,
              borderRadius: "999px",
              zIndex: 1,
              transition: `width ${DURATION_MS}ms ${EASE}`,
            }}
          >
            <Icon sx={{ fontSize: 22, color: active ? "white" : "#9CA3AF", flexShrink: 0, transition: "color 0.3s ease" }} />
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "inline-block",
                marginLeft: active ? "7px" : "0px",
                maxWidth: active ? "84px" : "0px",
                opacity: active ? 1 : 0,
                transition: `max-width ${DURATION_MS}ms ${EASE}, margin-left ${DURATION_MS}ms ${EASE}, opacity ${DURATION_MS}ms ${EASE}`,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
