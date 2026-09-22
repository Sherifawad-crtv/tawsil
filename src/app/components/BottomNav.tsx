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

/**
 * Floating capsule tab bar - the whole pill is a frosted-glass surface,
 * and the active tab morphs into its own filled pill with a label,
 * while inactive tabs stay icon-only.
 */
export default function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  return (
    <nav
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
      {NAV_ITEMS.map((item) => {
        const active = activeScreen === item.id;
        const Icon = active ? item.filled : item.outline;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className="flex items-center justify-center cursor-pointer active:scale-95"
            style={{
              gap: "7px",
              border: "none",
              height: "44px",
              padding: active ? "0 18px" : "0 12px",
              borderRadius: "999px",
              backgroundColor: active ? "#040033" : "transparent",
              transition: "background-color 0.35s cubic-bezier(0.16,1,0.3,1), padding 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Icon sx={{ fontSize: 22, color: active ? "white" : "#9CA3AF" }} />
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
