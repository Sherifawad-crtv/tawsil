import { useLocation, useNavigate } from "react-router";
import HomeRounded from "./icons/HomeRounded";
import { useDataStore } from "../lib/store";
import { getPendingOrders } from "../lib/selectors";
import HomeOutlined from "./icons/HomeOutlined";
import BoxRounded from "./icons/Inventory2Rounded";
import BoxOutlined from "./icons/Inventory2Outlined";
import PersonRounded from "./icons/PersonRounded";
import PersonOutlineRounded from "./icons/PersonOutlineRounded";

// Three tabs: the driver has no fleet to manage, so no Trucks/Drivers tabs like the contractor's bar.
const TABS = [
  { to: "/home", label: "Home", filled: HomeRounded, outline: HomeOutlined },
  { to: "/orders", label: "Orders", filled: BoxRounded, outline: BoxOutlined },
  { to: "/account", label: "Account", filled: PersonRounded, outline: PersonOutlineRounded },
];

// Fixed slot geometry: inactive tabs are all the same square, the active pill is one constant width,
// so the selector can be placed straight from the active index.
const CONTAINER_PADDING = 6;
const GAP = 4;
const INACTIVE_WIDTH = 44;
const ACTIVE_WIDTH = 108;
const SLOT = INACTIVE_WIDTH + GAP;

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION_MS = 380;

/** Floating capsule tab bar, the same as the client and contractor apps, with a page-colour fade behind it. */
export default function BottomTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { orders } = useDataStore();
  const pendingOrders = getPendingOrders(orders).length;
  const activeIndex = Math.max(0, TABS.findIndex((tab) => pathname.startsWith(tab.to)));
  const indicatorLeft = CONTAINER_PADDING + activeIndex * SLOT;

  return (
    <>
      {/* Page-colour fade behind the bar, so content dissolves under it instead of being cut off */}
      <div
        aria-hidden
        className="fixed left-0 right-0 bottom-0 pointer-events-none"
        style={{
          zIndex: 39,
          height: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
          background: "linear-gradient(to top, rgba(245,245,243,0.98) 0%, rgba(245,245,243,0.92) 35%, rgba(245,245,243,0) 100%)",
        }}
      />
      <nav
        className="fixed left-1/2 z-40 flex items-center"
        style={{
          bottom: "max(calc(env(safe-area-inset-bottom, 0px) - 8px), 12px)",
          transform: "translateX(-50%)",
          gap: `${GAP}px`,
          padding: `${CONTAINER_PADDING}px`,
          borderRadius: "999px",
          backgroundColor: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 6px 22px rgba(4,0,51,0.10), 0 1px 4px rgba(4,0,51,0.06)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: `${CONTAINER_PADDING}px`,
            bottom: `${CONTAINER_PADDING}px`,
            left: 0,
            width: `${ACTIVE_WIDTH}px`,
            borderRadius: "999px",
            backgroundColor: "#1253FA",
            transform: `translateX(${indicatorLeft}px)`,
            transition: `transform ${DURATION_MS}ms ${EASE}`,
            willChange: "transform",
            zIndex: 0,
          }}
        />

        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.to);
          const Icon = active ? tab.filled : tab.outline;
          const badge = tab.to === "/orders" && !active ? pendingOrders : 0;
          return (
            <button
              key={tab.to}
              onClick={() => navigate(tab.to)}
              aria-label={badge ? `${tab.label}, ${badge} pending` : tab.label}
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
              <span className="relative flex flex-shrink-0">
                <Icon sx={{ fontSize: 22, color: active ? "white" : "#626A76", flexShrink: 0, transition: "color 0.3s ease" }} />
                {badge > 0 && (
                  <span
                    className="absolute flex items-center justify-center rounded-full"
                    style={{
                      top: "-6px",
                      right: "-8px",
                      minWidth: "17px",
                      height: "17px",
                      padding: "0 4px",
                      backgroundColor: "#B45309",
                      color: "white",
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 700,
                      fontSize: "10px",
                      boxShadow: "0 0 0 2px white",
                    }}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
              <span
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
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
    </>
  );
}
