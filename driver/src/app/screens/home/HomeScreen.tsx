import { useMemo, useRef, useState } from "react";
import InboxRounded from "@mui/icons-material/InboxRounded";
import MapView from "../../components/MapView";
import TopBar from "../../components/TopBar";
import NavDrawer from "../../components/NavDrawer";
import HomeOrderCard from "../../components/HomeOrderCard";
import { useDataStore } from "../../lib/store";
import { getPendingOrders, getActiveOrders } from "../../lib/selectors";

/**
 * Map-first Home: the map is the whole screen, a floating carousel of order
 * cards sits over its bottom edge, and whichever card is centered draws its
 * route on the map - scrolling through orders is how you look at each one,
 * tapping a card opens its full details. Active (already-underway) orders
 * come first, since that's "the current order"; Assigned ones - new
 * requests - follow, each needing a slide (not a tap) to accept.
 */
export default function HomeScreen() {
  const { orders, profile, acceptOrder } = useDataStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => getActiveOrders(orders), [orders]);
  const pending = useMemo(() => getPendingOrders(orders), [orders]);
  const feed = useMemo(() => [...active, ...pending], [active, pending]);

  const firstName = profile.fullName.split(" ")[0];
  const selectedOrder = feed[Math.min(selected, feed.length - 1)];

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || feed.length === 0) return;
    const cardWidth = el.scrollWidth / feed.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setSelected(Math.max(0, Math.min(feed.length - 1, index)));
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <MapView order={selectedOrder} />
      <TopBar greeting={`Hi, ${firstName}`} onMenu={() => setMenuOpen(true)} />
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} profile={profile} />

      {feed.length === 0 ? (
        <div
          className="fixed left-4 right-4 z-20 rounded-[22px] p-6 flex flex-col items-center text-center gap-2"
          style={{ bottom: "max(env(safe-area-inset-bottom, 20px), 20px)", backgroundColor: "white", boxShadow: "0 8px 28px rgba(4,0,51,0.16)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#F0F0EE" }}>
            <InboxRounded sx={{ fontSize: 22, color: "#9CA3AF" }} />
          </div>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>No orders right now</p>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#9CA3AF" }}>New requests will appear here as soon as they're assigned.</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="fixed left-0 right-0 z-20 flex overflow-x-auto"
          style={{
            bottom: "max(env(safe-area-inset-bottom, 16px), 16px)",
            gap: "14px",
            padding: "0 32px",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: "32px",
            scrollPaddingRight: "32px",
          }}
        >
          {feed.map((o) => (
            <div key={o.id} className="flex-shrink-0" style={{ width: "calc(100vw - 96px)", maxWidth: "360px", scrollSnapAlign: "center" }}>
              <HomeOrderCard order={o} onAccepted={() => acceptOrder(o.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
