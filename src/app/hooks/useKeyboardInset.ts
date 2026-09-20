import { useEffect, useState } from "react";

/**
 * How many px of the viewport's bottom the on-screen keyboard currently
 * covers - 0 when it's closed. Backed by the VisualViewport API, which is
 * the only reliable cross-browser signal for "the keyboard just opened";
 * layout viewport height (100vh/100dvh) doesn't shrink the same way on iOS.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const covered = window.innerHeight - vv.height - vv.offsetTop;
      setInset(Math.max(0, Math.round(covered)));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}
