/**
 * Small taps for the intro. Two routes, whichever the device offers:
 * - Android browsers have the Vibration API.
 * - iPhones (Safari 17.4 and later, including a home-screen app) give a light tap when a
 *   hidden `<input type="checkbox" switch>` is toggled, so we toggle one on demand.
 * Both are best effort: a browser or setting that says no simply gets no tap.
 */

type Kind = "step" | "arrive";

/** Vibration patterns in ms: a single light tick, and a double tap for the destination. */
const PATTERNS: Record<Kind, number[]> = {
  step: [14],
  arrive: [14, 55, 26],
};

let label: HTMLLabelElement | null = null;

function iosTap() {
  if (typeof document === "undefined") return;
  if (!label) {
    label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.cssText = "position:fixed;left:-100px;top:-100px;width:1px;height:1px;opacity:0;pointer-events:none;";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    label.appendChild(input);
    document.body.appendChild(label);
  }
  label.click();
}

export function haptic(kind: Kind) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(PATTERNS[kind]);
      return;
    }
    // iPhone: one tap per pulse in the pattern.
    const pulses = PATTERNS[kind].filter((_, i) => i % 2 === 0).length;
    iosTap();
    for (let i = 1; i < pulses; i++) window.setTimeout(iosTap, i * 90);
  } catch {
    // Haptics are a nicety; never let them break the intro.
  }
}
