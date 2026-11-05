import type { ReactNode } from "react";
import { PAGE_BG, useStatusBar } from "../../lib/statusBar";

/**
 * The same full-height off-white page wrapper every screen in this app uses.
 * `background` is decorative art painted behind the content (see MapBackdrop).
 */
export default function ScreenShell({
  children,
  background,
  fixedHeight,
}: {
  children: ReactNode;
  background?: ReactNode;
  /** Exactly one viewport tall and never scrolls (the welcome screen). */
  fixedHeight?: boolean;
}) {
  // The map backdrop is painted on white, so the status bar eases into white there.
  useStatusBar(background ? "#FFFFFF" : PAGE_BG);
  return (
    <div
      className={`relative w-full flex flex-col overflow-hidden ${fixedHeight ? "h-dvh" : "min-h-screen"}`}
      style={{ backgroundColor: "#F5F5F3" }}
    >
      {background && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {background}
          {/* Where the system draws its own status bar above the page, the map would
              otherwise start in a hard edge right under it. */}
          <div
            className="absolute top-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to bottom, #FFFFFF, rgba(255,255,255,0))" }}
          />
        </div>
      )}
      <div
        className="relative w-full max-w-lg mx-auto px-4 flex-1 min-h-0 flex flex-col"
        style={{ paddingTop: "max(env(safe-area-inset-top, 16px), 16px)", paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
      >
        {children}
      </div>
    </div>
  );
}
