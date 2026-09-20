import type { ReactNode } from "react";

/** The same full-height off-white page wrapper every screen in this app uses. */
export default function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#F5F5F3" }}>
      <div
        className="w-full max-w-lg mx-auto px-4 flex-1 flex flex-col"
        style={{ paddingTop: "max(env(safe-area-inset-top, 16px), 16px)", paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
      >
        {children}
      </div>
    </div>
  );
}
