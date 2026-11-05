import { useLayoutEffect, useSyncExternalStore } from "react";

/**
 * Status-bar blending. In the installed app the page runs edge-to-edge under
 * the system status bar (iOS "black-translucent"), whose clock and battery are
 * always white. So the top of every screen gets a gradient: brand navy behind
 * the status bar so the white text stays readable, easing into whatever
 * background the screen has. Each screen states its background with
 * useStatusBar(); the topmost screen wins, and it falls back to the page
 * default when it unmounts. Browsers with no safe area (desktop, Android,
 * plain Safari tabs) get no overlay at all.
 */

export const STATUS_NAVY = "#040033";
export const PAGE_BG = "#F5F5F3";

type Entry = { id: number; bg: string; top: string };

let stack: Entry[] = [];
let nextId = 1;
let snapshot: Entry = { id: 0, bg: PAGE_BG, top: STATUS_NAVY };
const listeners = new Set<() => void>();

function publish() {
  snapshot = stack[stack.length - 1] ?? { id: 0, bg: PAGE_BG, top: STATUS_NAVY };
  setThemeColor(snapshot.bg);
  listeners.forEach((l) => l());
}

/** Android and browser chrome can't do a gradient, but they do take a solid colour. */
function setThemeColor(color: string) {
  if (typeof document === "undefined") return;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

/** Declare this screen's background (and optionally a different colour behind the clock). */
export function useStatusBar(bg: string = PAGE_BG, top: string = STATUS_NAVY) {
  useLayoutEffect(() => {
    const entry: Entry = { id: nextId++, bg, top };
    stack = [...stack, entry];
    publish();
    return () => {
      stack = stack.filter((e) => e.id !== entry.id);
      publish();
    };
  }, [bg, top]);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** The overlay itself - mount once at the app root. */
export function StatusBarFade() {
  const { bg, top } = useSyncExternalStore(subscribe, () => snapshot);
  const sat = "var(--sat)";
  const fade = "min(calc(var(--sat) * 100), 12px)";
  const mix = (pct: number) => `color-mix(in srgb, ${top} ${pct}%, ${bg})`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 right-0"
      style={{
        zIndex: 66,
        height: `calc(${sat} + ${fade})`,
        // Eased stops so there is no visible edge: solid behind the clock, then a long soft landing.
        background: `linear-gradient(to bottom, ${top} 0, ${top} calc(${sat} * 0.4), ${mix(60)} calc(${sat} * 0.7), ${mix(22)} calc(${sat} * 0.85), ${bg} ${sat}, transparent calc(${sat} + ${fade}))`,
      }}
    />
  );
}
