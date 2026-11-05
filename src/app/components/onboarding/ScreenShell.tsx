import type { ReactNode } from "react";

/**
 * The same full-height off-white page wrapper every screen in this app uses.
 * `background` is decorative art painted behind the content (see MapBackdrop).
 */
export default function ScreenShell({ children, background }: { children: ReactNode; background?: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: "#F5F5F3" }}>
      {background && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {background}
        </div>
      )}
      <div
        className="relative w-full max-w-lg mx-auto px-4 flex-1 flex flex-col"
        style={{ paddingTop: "max(env(safe-area-inset-top, 16px), 16px)", paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
      >
        {children}
      </div>
    </div>
  );
}
