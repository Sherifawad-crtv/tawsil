import { useLayoutEffect, useRef, useState } from "react";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import HomeRounded from "@mui/icons-material/HomeRounded";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PersonRounded from "@mui/icons-material/PersonRounded";

export type NavScreen = "home" | "activity" | "profile" | "insights";

interface BottomNavProps {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

type IconComponent = typeof HomeOutlined;

const NAV_ITEMS: { id: NavScreen; label: string; outline: IconComponent; filled: IconComponent }[] = [
  { id: "home", label: "Home", outline: HomeOutlined, filled: HomeRounded },
  { id: "activity", label: "Activity", outline: CalendarMonthOutlined, filled: CalendarMonthRounded },
  { id: "insights", label: "Insights", outline: BarChartOutlined, filled: BarChartRounded },
  { id: "profile", label: "Profile", outline: PersonOutlined, filled: PersonRounded },
];

// A gentle spring overshoot - the pill settles past its target and eases
// back, instead of a flat ease that just stops dead on arrival.
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SPRING_MS = 520;

/**
 * Floating capsule tab bar - the whole pill is a frosted-glass surface.
 * A single indicator slides between tabs (measured off the real button
 * layout, not swapped per-button), and the active tab morphs into a
 * label alongside it while inactive tabs stay icon-only.
 */
export default function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Partial<Record<NavScreen, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[activeScreen];
      const container = containerRef.current;
      if (!el || !container) return;
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({ left: elRect.left - containerRect.left, width: elRect.width });
    };
    measure();
    // Labels animate their own width in via the button's padding
    // transition, so the indicator's final size settles slightly after
    // the state flip - keep re-measuring through that transition.
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [activeScreen]);

  return (
    <nav
      ref={containerRef}
      className="fixed left-1/2 z-40 flex items-center"
      style={{
        bottom: "max(env(safe-area-inset-bottom, 16px), 16px)",
        transform: "translateX(-50%)",
        gap: "4px",
        padding: "6px",
        borderRadius: "999px",
        backgroundColor: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "0 10px 36px rgba(4,0,51,0.16), inset 0 1px 0 rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.6)",
      }}
    >
      {/* Sliding selector - one element that glides between tabs */}
      {indicator && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "6px",
            bottom: "6px",
            left: 0,
            width: indicator.width,
            borderRadius: "999px",
            backgroundColor: "#040033",
            transform: `translateX(${indicator.left}px)`,
            transition: `transform ${SPRING_MS}ms ${SPRING}, width ${SPRING_MS}ms ${SPRING}`,
            willChange: "transform, width",
            zIndex: 0,
          }}
        />
      )}

      {NAV_ITEMS.map((item) => {
        const active = activeScreen === item.id;
        const Icon = active ? item.filled : item.outline;
        return (
          <button
            key={item.id}
            ref={(el) => { itemRefs.current[item.id] = el; }}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className="relative flex items-center justify-center cursor-pointer active:scale-95"
            style={{
              gap: "7px",
              border: "none",
              background: "none",
              height: "44px",
              padding: active ? "0 18px" : "0 12px",
              borderRadius: "999px",
              zIndex: 1,
              transition: `padding ${SPRING_MS}ms ${SPRING}`,
            }}
          >
            <Icon sx={{ fontSize: 22, color: active ? "white" : "#9CA3AF", transition: "color 0.3s ease 0.05s" }} />
            {active && (
              <span
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
