import { useLayoutEffect, useSyncExternalStore } from "react";

/**
 * Status-bar blending. In the installed app the page runs edge-to-edge under
 * the system status bar (iOS "black-translucent"). The strip behind the clock
 * and battery is always painted in the screen's own background colour, so the
 * status bar is never a different colour from the content beneath it; a short
 * fade at its lower edge keeps scrolled content from meeting it in a hard line.
 * Each screen states its background with useStatusBar(); the topmost screen
 * wins, and it falls back to the page default when it unmounts. Browsers with
 * no safe area (desktop, Android, plain Safari tabs) get no overlay at all.
 */

export const STATUS_NAVY = "#040033";
export const PAGE_BG = "#F5F5F3";

type Entry = { id: number; bg: string };

let stack: Entry[] = [];
let nextId = 1;
let snapshot: Entry = { id: 0, bg: PAGE_BG };
const listeners = new Set<() => void>();

function publish() {
  snapshot = stack[stack.length - 1] ?? { id: 0, bg: PAGE_BG };
  setThemeColor(snapshot.bg);
  listeners.forEach((l) => l());
}

/** Android and browser chrome can't do a gradient, but they do take a solid colour. */
function setThemeColor(color: string) {
  if (typeof document === "undefined") return;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

/** Declare this screen's background colour; the status bar strip is painted in it. */
export function useStatusBar(bg: string = PAGE_BG) {
  useLayoutEffect(() => {
    const entry: Entry = { id: nextId++, bg };
    stack = [...stack, entry];
    publish();
    return () => {
      stack = stack.filter((e) => e.id !== entry.id);
      publish();
    };
  }, [bg]);
}

// Preview aid: open the app with ?sat=47 to see the status-bar blend in a desktop
// browser or device emulator, which have no real status bar to measure.
if (typeof window !== "undefined") {
  const sat = Number(new URLSearchParams(window.location.search).get("sat"));
  if (sat > 0 && sat < 100) document.documentElement.style.setProperty("--sat", `${sat}px`);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** The overlay itself - mount once at the app root. */
export function StatusBarFade() {
  const { bg } = useSyncExternalStore(subscribe, () => snapshot);
  const sat = "var(--sat)";
  const fade = "min(calc(var(--sat) * 100), 12px)";
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 right-0"
      style={{
        zIndex: 66,
        height: `calc(${sat} + ${fade})`,
        // Solid in the screen's colour behind the clock, then a soft landing into the content.
        background: `linear-gradient(to bottom, ${bg} 0, ${bg} ${sat}, transparent calc(${sat} + ${fade}))`,
      }}
    />
  );
}
