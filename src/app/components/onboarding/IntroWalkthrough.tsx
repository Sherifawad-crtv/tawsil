import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * Three-step intro. One continuous road runs across the screen; a navigation
 * arrow rides along it and moves to the next stop when the person taps Next.
 * The road behind the arrow lights up in brand blue, the arrow turns with the
 * bends, and the stops alternate between the top and the bottom of the screen
 * while the text flips to the opposite side so the two never meet.
 */

export interface IntroStep {
  icon: ReactNode;
  title: string;
  body: string;
}

const BLUE = "#1253FA";
const ROAD = "#D5DEFA";
const PAGE = "#F5F5F3";
const ROAD_WIDTH = 46;
const TRAVEL_MS = 1100;
/** The new text waits until the arrow has left that side of the screen. */
const TEXT_IN_DELAY = 0.5;
const TEXT_OUT_MS = 200;

type Pt = { x: number; y: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Hairpin road: in from the left, up to a top stop, down to a bottom stop, up to a top stop, out to the right. Corners are softened with quadratic curves. */
function buildRoad(w: number, h: number) {
  const pts: Pt[] = [
    { x: -0.3 * w, y: 0.68 * h },
    { x: 0.14 * w, y: 0.35 * h },
    { x: 0.5 * w, y: 0.685 * h },
    { x: 0.86 * w, y: 0.35 * h },
    { x: 1.3 * w, y: 0.68 * h },
  ];
  const soft = Math.min(130, w * 0.3);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  const apexes: Pt[] = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const a = pts[i - 1];
    const b = pts[i + 1];
    const lenIn = Math.hypot(p.x - a.x, p.y - a.y);
    const lenOut = Math.hypot(b.x - p.x, b.y - p.y);
    const uin = { x: (p.x - a.x) / lenIn, y: (p.y - a.y) / lenIn };
    const uout = { x: (b.x - p.x) / lenOut, y: (b.y - p.y) / lenOut };
    const start = { x: p.x - uin.x * soft, y: p.y - uin.y * soft };
    const end = { x: p.x + uout.x * soft, y: p.y + uout.y * soft };
    d += ` L ${start.x} ${start.y} Q ${p.x} ${p.y} ${end.x} ${end.y}`;
    apexes.push({ x: 0.25 * start.x + 0.5 * p.x + 0.25 * end.x, y: 0.25 * start.y + 0.5 * p.y + 0.25 * end.y });
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return { d, apexes };
}

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: typeof window === "undefined" ? 390 : window.innerWidth, h: typeof window === "undefined" ? 800 : window.innerHeight });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export default function IntroWalkthrough({
  steps,
  onDone,
  finishLabel = "Get started",
}: {
  steps: IntroStep[];
  onDone: () => void;
  finishLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(rootRef);
  const road = useMemo(() => buildRoad(w, h), [w, h]);

  const pathRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGGElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const litMaskRef = useRef<SVGPathElement>(null);
  const stopsRef = useRef<number[]>([]);
  const totalRef = useRef(0);
  const curRef = useRef(0);
  const rafRef = useRef<number>(0);
  const reduced = useRef(false);

  const [step, setStep] = useState(0);
  const [textStep, setTextStep] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const timers = useRef<number[]>([]);

  const paint = useCallback((len: number) => {
    const path = pathRef.current;
    const arrow = arrowRef.current;
    if (!path || !arrow) return;
    const total = totalRef.current;
    const p = path.getPointAtLength(len);
    const q = path.getPointAtLength(Math.min(total, len + 2));
    const back = path.getPointAtLength(Math.max(0, len - 2));
    const angle = (Math.atan2(q.y - back.y, q.x - back.x) * 180) / Math.PI;
    arrow.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    const dash = `${len} ${total + 10}`;
    litRef.current?.setAttribute("stroke-dasharray", dash);
    litMaskRef.current?.setAttribute("stroke-dasharray", dash);
  }, []);

  const travelTo = useCallback(
    (target: number, ms: number) => {
      cancelAnimationFrame(rafRef.current);
      const from = curRef.current;
      if (reduced.current || ms <= 0 || from === target) {
        curRef.current = target;
        paint(target);
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        const len = from + (target - from) * ease(k);
        curRef.current = len;
        paint(len);
        if (k < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [paint],
  );

  // Measure the road and where each stop sits along it. Re-run when the screen size changes.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const total = path.getTotalLength();
    totalRef.current = total;
    stopsRef.current = road.apexes.map((apex) => {
      let best = 0;
      let bestD = Infinity;
      for (let s = 0; s <= total; s += 3) {
        const p = path.getPointAtLength(s);
        const dist = (p.x - apex.x) ** 2 + (p.y - apex.y) ** 2;
        if (dist < bestD) {
          bestD = dist;
          best = s;
        }
      }
      return best;
    });
    // Keep the arrow where it was (a resize or rotation must not leave it behind).
    const first = curRef.current === 0;
    if (first) {
      paint(0);
    } else {
      const target = stopsRef.current[step] ?? 0;
      curRef.current = target;
      paint(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [road, paint]);

  // Opening: the arrow drives in from the left edge to the first stop while the first text fades in.
  useEffect(() => {
    const t = window.setTimeout(() => {
      travelTo(stopsRef.current[0] ?? 0, 1000);
      setTextVisible(true);
    }, 200);
    timers.current.push(t);
    return () => {
      timers.current.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [travelTo]);

  const last = step === steps.length - 1;

  function next() {
    if (last) {
      onDone();
      return;
    }
    const n = step + 1;
    setStep(n);
    setTextVisible(false);
    travelTo(stopsRef.current[n] ?? 0, TRAVEL_MS);
    const swap = window.setTimeout(() => {
      setTextStep(n);
      setTextVisible(true);
    }, Math.max(TEXT_OUT_MS, TRAVEL_MS * TEXT_IN_DELAY));
    timers.current.push(swap);
  }

  // Steps 1 and 3 sit the arrow at the top, so the text goes to the bottom; step 2 flips it.
  const textAtBottom = textStep % 2 === 0;
  const s = steps[textStep];

  return (
    <div ref={rootRef} className="relative w-full h-dvh overflow-hidden" style={{ backgroundColor: PAGE }}>
      <svg aria-hidden className="absolute inset-0 w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <mask id="intro-lit" maskUnits="userSpaceOnUse" x="-1000" y="-1000" width={w + 2000} height={h + 2000}>
            <path ref={litMaskRef} d={road.d} fill="none" stroke="white" strokeWidth={ROAD_WIDTH + 8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 99999" />
          </mask>
        </defs>
        {/* the road */}
        <path d={road.d} fill="none" stroke={ROAD} strokeWidth={ROAD_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path d={road.d} fill="none" stroke={BLUE} strokeOpacity={0.4} strokeWidth={2.5} strokeDasharray="11 10" />
        {/* the part already driven */}
        <path ref={litRef} d={road.d} fill="none" stroke={BLUE} strokeWidth={ROAD_WIDTH} strokeLinecap="butt" strokeLinejoin="round" strokeDasharray="0 99999" />
        <path d={road.d} fill="none" stroke="white" strokeOpacity={0.9} strokeWidth={2.5} strokeDasharray="11 10" mask="url(#intro-lit)" />
        {/* measuring path, never painted */}
        <path ref={pathRef} d={road.d} fill="none" stroke="none" />
        {/* the arrow */}
        <g ref={arrowRef} transform="translate(-100 -100)">
          <path
            d="M -17 -15 L 21 0 L -17 15 L -9 0 Z"
            fill={BLUE}
            stroke="white"
            strokeWidth={6}
            strokeLinejoin="round"
            paintOrder="stroke"
            style={{ filter: "drop-shadow(0 4px 10px rgba(18,83,250,0.35))" }}
          />
        </g>
      </svg>

      {/* top bar: progress and skip */}
      <div className="absolute left-0 right-0 top-0 z-10" style={{ paddingTop: "max(env(safe-area-inset-top, 16px), 16px)" }}>
        <div className="w-full max-w-lg mx-auto px-4 flex items-center justify-between" style={{ height: "44px" }}>
          <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${steps.length}`}>
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === step ? "22px" : "6px",
                  height: "6px",
                  backgroundColor: i <= step ? BLUE : "#C4CBDA",
                  transition: "width 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease",
                }}
              />
            ))}
          </div>
          <button
            onClick={onDone}
            className="cursor-pointer active:opacity-70"
            style={{
              border: "none",
              background: "none",
              padding: "10px 0 10px 16px",
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#626A76",
              opacity: last ? 0 : 1,
              pointerEvents: last ? "none" : "auto",
              transition: "opacity 0.3s ease",
            }}
            aria-hidden={last}
            tabIndex={last ? -1 : 0}
          >
            Skip
          </button>
        </div>
      </div>

      {/* the words: always on the side of the screen the arrow is not on */}
      <div
        className="absolute left-0 right-0 z-10"
        style={textAtBottom ? { bottom: "calc(max(env(safe-area-inset-bottom, 16px), 16px) + 88px)" } : { top: "calc(max(env(safe-area-inset-top, 16px), 16px) + 56px)" }}
      >
        <div
          className="w-full max-w-lg mx-auto px-4"
          style={{
            paddingTop: textAtBottom ? "56px" : "8px",
            paddingBottom: textAtBottom ? "8px" : "56px",
            background: textAtBottom
              ? `linear-gradient(to bottom, rgba(245,245,243,0) 0%, ${PAGE} 40px)`
              : `linear-gradient(to bottom, ${PAGE} calc(100% - 40px), rgba(245,245,243,0) 100%)`,
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : `translateY(${textAtBottom ? 14 : -14}px)`,
            transition: textVisible ? "opacity 0.45s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)" : `opacity ${TEXT_OUT_MS}ms ease, transform ${TEXT_OUT_MS}ms ease`,
          }}
          aria-live="polite"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#EAF0FE" }}>
            {s.icon}
          </div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: 1.15 }}>{s.title}</h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#626A76", marginTop: "10px", lineHeight: 1.55 }}>{s.body}</p>
        </div>
      </div>

      {/* bottom action */}
      <div className="absolute left-0 right-0 bottom-0 z-20" style={{ backgroundColor: PAGE }}>
        <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "12px", paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}>
          <button
            onClick={next}
            className="w-full rounded-2xl flex items-center justify-center cursor-pointer active:scale-[0.97]"
            style={{ backgroundColor: BLUE, padding: "16px", border: "none", transition: "transform 0.2s ease" }}
          >
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>{last ? finishLabel : "Next"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
