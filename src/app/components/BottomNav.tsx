import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import HomeBlendedRounded from "./icons/HomeBlendedRounded";

export type NavScreen = "home" | "activity" | "profile" | "insights";

interface BottomNavProps {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

type IconComponent = React.ComponentType<SvgIconProps>;

const NAV_ITEMS: { id: NavScreen; label: string; icon: IconComponent }[] = [
  { id: "home", label: "Home", icon: HomeBlendedRounded },
  { id: "activity", label: "Activity", icon: CalendarMonthRounded },
  { id: "insights", label: "Insights", icon: BarChartRounded },
  { id: "profile", label: "Profile", icon: PersonRounded },
];

// Fixed slot geometry - every inactive tab is the same square size and
// the active pill is always the same width, so the selector's position
// is computed directly from the active index instead of being measured
// off a button mid-transition (that's what made the padding look uneven).
const CONTAINER_PADDING = 6;
const GAP = 4;
const INACTIVE_WIDTH = 44;
const ACTIVE_WIDTH = 132;
const SLOT = INACTIVE_WIDTH + GAP;

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)"; // smooth deceleration, no overshoot
const DURATION_MS = 380;

/**
 * Floating capsule tab bar - the whole pill is a frosted-glass surface.
 * A single selector of constant width walks between fixed slots as the
 * active tab changes, staying visible throughout instead of resizing
 * to match per-button content.
 */
export default function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const activeIndex = Math.max(0, NAV_ITEMS.findIndex((item) => item.id === activeScreen));
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

      {NAV_ITEMS.map((item) => {
        const active = activeScreen === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
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
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
