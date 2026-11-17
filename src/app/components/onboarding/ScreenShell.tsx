import type { ReactNode } from "react";

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
  return (
    <div
      className={`relative w-full flex flex-col overflow-hidden ${fixedHeight ? "h-dvh" : "min-h-screen"}`}
      style={{ backgroundColor: "#F5F5F3" }}
    >
      {background && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {background}
          {/* The map starts in the page tone (the same colour the status bar shows)
              and eases into the artwork, so there is no edge under the system bar. */}
          <div
            className="absolute top-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to bottom, #F5F5F3 0%, rgba(245,245,243,0.75) 35%, rgba(245,245,243,0.3) 70%, rgba(245,245,243,0) 100%)" }}
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
