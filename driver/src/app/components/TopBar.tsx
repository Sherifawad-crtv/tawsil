import MenuRounded from "@mui/icons-material/MenuRounded";

/** Replaces the bottom tab bar on the map-first Home screen - a menu button opens NavDrawer instead. */
export default function TopBar({ greeting, onMenu }: { greeting: string; onMenu: () => void }) {
  return (
    <div
      className="fixed left-0 right-0 z-30 flex items-center justify-between px-4"
      style={{ top: "max(env(safe-area-inset-top, 12px), 12px)" }}
    >
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(4,0,51,0.12)" }}
      >
        <MenuRounded sx={{ fontSize: 20, color: "#040033" }} />
      </button>

      <div
        className="px-4 py-2.5 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", boxShadow: "0 2px 14px rgba(4,0,51,0.1)" }}
      >
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033" }}>{greeting}</span>
      </div>
    </div>
  );
}
