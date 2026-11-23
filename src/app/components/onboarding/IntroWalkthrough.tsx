import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * Three-step intro told as one journey. A long, gently zig-zagging road runs
 * through all three screens and a navigation arrow rides it. Tapping Next
 * drives the arrow to the next stop while the camera travels with it: the
 * road, the grid behind it and the next screen's words slide past, so it
 * feels like moving from one place to the next rather than switching pages.
 * Stops alternate between the top and the bottom of the screen, with the
 * words on the opposite side.
 */

export interface IntroStep {
  icon: ReactNode;
  title: string;
  body: string;
}

const BLUE = "#1253FA";
const ROAD = "#D5DEFA";
const PAGE = "#F5F5F3";
const ROAD_WIDTH = 52;
const TRAVEL_MS = 1400;
const ENTER_MS = 1000;

type Pt = { x: number; y: number };

/**
 * The arrow and the destination pin are drawn with the same four curve segments, so one
 * can flow into the other. Both are listed as [anchor, control, control] per segment,
 * nose to nose: arrow nose -> pin tip, arrow tail corners -> pin shoulders, arrow notch -> pin top.
 * The arrow is stored turned a quarter so that the pin stands upright when the turn is undone.
 */
const line = (a: [number, number], b: [number, number]): number[] => [a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3, a[0] + ((b[0] - a[0]) * 2) / 3, a[1] + ((b[1] - a[1]) * 2) / 3];
const ARROW_A: [number, number][] = [[0, 21], [15, -17], [0, -9], [-15, -17]];
const ARROW_SEGS = ARROW_A.map((a, i) => [...line(a, ARROW_A[(i + 1) % 4])]);
const PIN_A: [number, number][] = [[0, 0], [15, -26], [0, -41], [-15, -26]];
const PIN_SEGS: number[][] = [
  [4, -9, 15, -16],
  [15, -34.28, 8.28, -41],
  [-8.28, -41, -15, -34.28],
  [-15, -16, -4, -9],
];
const mix = (a: number, b: number, m: number) => a + (b - a) * m;
/** Path of the arrow (m = 0) through to the pin (m = 1); m may overshoot 1 for the bounce. */
function shapeAt(m: number) {
  const f = (n: number) => n.toFixed(2);
  let d = `M ${f(mix(ARROW_A[0][0], PIN_A[0][0], m))} ${f(mix(ARROW_A[0][1], PIN_A[0][1], m))}`;
  for (let i = 0; i < 4; i++) {
    const a = ARROW_SEGS[i];
    const b = PIN_SEGS[i];
    const end = (i + 1) % 4;
    d += ` C ${f(mix(a[0], b[0], m))} ${f(mix(a[1], b[1], m))} ${f(mix(a[2], b[2], m))} ${f(mix(a[3], b[3], m))} ${f(mix(ARROW_A[end][0], PIN_A[end][0], m))} ${f(mix(ARROW_A[end][1], PIN_A[end][1], m))}`;
  }
  return d + " Z";
}
/** Springy settle with a small overshoot: starts at 0, swings past 1, rests at 1. */
const spring = (t: number) => (t >= 1 ? 1 : 1 - Math.exp(-4 * t) * Math.cos(7 * t));
const MORPH_MS = 1700;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * The road in world coordinates: screen i spans x from i*w to (i+1)*w and its
 * stop sits at the middle of it. Stops alternate high and low; between them the
 * road runs straight, and only the tip at each stop is softened.
 */
function buildRoad(w: number, h: number, count: number) {
  const high = 0.36 * h;
  const low = 0.64 * h;
  const pts: Pt[] = [{ x: -0.5 * w, y: low }];
  for (let i = 0; i < count; i++) pts.push({ x: (i + 0.5) * w, y: i % 2 === 0 ? high : low });
  pts.push({ x: (count + 0.5) * w, y: count % 2 === 0 ? high : low });
  const soft = Math.min(190, w * 0.42);
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
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
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
  const count = steps.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(rootRef);
  const road = useMemo(() => buildRoad(w, h, count), [w, h, count]);
  const offset = 0.7 * w;
  const worldW = (count + 1) * w;

  const pathRef = useRef<SVGPathElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGGElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const morphRef = useRef(0);
  const morphRaf = useRef<number>(0);
  const litRef = useRef<SVGPathElement>(null);
  const litMaskRef = useRef<SVGPathElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stopsRef = useRef<number[]>([]);
  const totalRef = useRef(0);
  const lenRef = useRef(0);
  const camRef = useRef(0);
  const rafRef = useRef<number>(0);
  const reduced = useRef(false);

  const [step, setStep] = useState(0);

  const paint = useCallback(
    (len: number, cam: number) => {
      const path = pathRef.current;
      const arrow = arrowRef.current;
      if (!path || !arrow) return;
      const total = totalRef.current;
      const p = path.getPointAtLength(len);
      const q = path.getPointAtLength(Math.min(total, len + 2));
      const back = path.getPointAtLength(Math.max(0, len - 2));
      const angle = (Math.atan2(q.y - back.y, q.x - back.x) * 180) / Math.PI;
      const m = morphRef.current;
      arrow.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${mix(angle - 90, 0, m)}) scale(${mix(1.8, 1.5, m)})`);
      shapeRef.current?.setAttribute("d", shapeAt(m));
      dotRef.current?.setAttribute("opacity", String(clamp01((m - 0.55) * 2.2)));
      if (ringRef.current) {
        ringRef.current.setAttribute("cx", String(p.x));
        ringRef.current.setAttribute("cy", String(p.y));
      }
      const dash = `${len} ${total + 10}`;
      litRef.current?.setAttribute("stroke-dasharray", dash);
      litMaskRef.current?.setAttribute("stroke-dasharray", dash);
      // The camera: the whole world slides, the grid behind it slides slower.
      if (worldRef.current) worldRef.current.style.transform = `translate3d(${-cam}px,0,0)`;
      if (gridRef.current) gridRef.current.style.backgroundPosition = `${-cam * 0.45}px 0, ${-cam * 0.45}px 0`;
      // Words fade out as their screen leaves and in as the next one arrives.
      const pos = w > 0 ? cam / w : 0;
      pageRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(clamp01(1.25 - Math.abs(pos - i) * 1.9));
      });
    },
    [w],
  );

  const travel = useCallback(
    (toLen: number, toCam: number, ms: number) => {
      cancelAnimationFrame(rafRef.current);
      const fromLen = lenRef.current;
      const fromCam = camRef.current;
      if (reduced.current || ms <= 0 || (fromLen === toLen && fromCam === toCam)) {
        lenRef.current = toLen;
        camRef.current = toCam;
        paint(toLen, toCam);
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = ease(Math.min(1, (now - t0) / ms));
        lenRef.current = fromLen + (toLen - fromLen) * k;
        camRef.current = fromCam + (toCam - fromCam) * k;
        paint(lenRef.current, camRef.current);
        if (now - t0 < ms) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [paint],
  );

  /** Reaching the last stop: the arrow turns upright and springs into a location pin, with a ripple under it. */
  const arrive = useCallback(() => {
    cancelAnimationFrame(morphRaf.current);
    if (reduced.current) {
      morphRef.current = 1;
      paint(lenRef.current, camRef.current);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / MORPH_MS);
      morphRef.current = spring(t);
      paint(lenRef.current, camRef.current);
      const ring = ringRef.current;
      if (ring) {
        const rt = clamp01((now - t0 - 350) / 1000);
        ring.setAttribute("r", String(8 + 62 * (1 - Math.pow(1 - rt, 3))));
        ring.setAttribute("opacity", String(rt > 0 && rt < 1 ? 0.45 * (1 - rt) : 0));
      }
      if (t < 1 || now - t0 < MORPH_MS) morphRaf.current = requestAnimationFrame(tick);
    };
    morphRaf.current = requestAnimationFrame(tick);
  }, [paint]);

  // Measure the road and where each stop sits along it. Runs again when the screen size changes.
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
    if (lenRef.current === 0) {
      paint(0, 0);
    } else {
      lenRef.current = stopsRef.current[step] ?? 0;
      camRef.current = step * w;
      paint(lenRef.current, camRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [road, paint]);

  // Opening: the arrow drives in from the left edge to the first stop.
  useEffect(() => {
    const t = window.setTimeout(() => travel(stopsRef.current[0] ?? 0, 0, ENTER_MS), 200);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(morphRaf.current);
    };
  }, [travel]);

  const last = step === count - 1;

  function next() {
    if (last) {
      onDone();
      return;
    }
    const n = step + 1;
    setStep(n);
    travel(stopsRef.current[n] ?? 0, n * w, TRAVEL_MS);
    if (n === count - 1) window.setTimeout(arrive, reduced.current ? 0 : TRAVEL_MS - 80);
  }

  return (
    <div ref={rootRef} className="relative w-full h-dvh overflow-hidden" style={{ backgroundColor: PAGE }}>
      {/* a faint grid that slides slower than the road, for depth */}
      <div
        ref={gridRef}
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(to bottom, #E8E8E4 1px, transparent 1px), linear-gradient(to right, #E8E8E4 1px, transparent 1px)",
          backgroundSize: "112px 112px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 78%)",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 78%)",
        }}
      />

      {/* the world: road, arrow and every screen's words, side by side */}
      <div ref={worldRef} className="absolute top-0 bottom-0 left-0" style={{ width: worldW, willChange: "transform" }}>
        <svg aria-hidden className="absolute top-0" style={{ left: -offset }} width={worldW + offset} height={h} viewBox={`${-offset} 0 ${worldW + offset} ${h}`}>
          <defs>
            <mask id="intro-lit" maskUnits="userSpaceOnUse" x={-offset - 1000} y={-1000} width={worldW + offset + 2000} height={h + 2000}>
              <path ref={litMaskRef} d={road.d} fill="none" stroke="white" strokeWidth={ROAD_WIDTH + 8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0 99999" />
            </mask>
          </defs>
          <path d={road.d} fill="none" stroke={ROAD} strokeWidth={ROAD_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
          <path d={road.d} fill="none" stroke={BLUE} strokeOpacity={0.4} strokeWidth={2.5} strokeDasharray="11 10" />
          <path ref={litRef} d={road.d} fill="none" stroke={BLUE} strokeWidth={ROAD_WIDTH} strokeLinecap="butt" strokeLinejoin="round" strokeDasharray="0 99999" />
          <path d={road.d} fill="none" stroke="white" strokeOpacity={0.9} strokeWidth={2.5} strokeDasharray="11 10" mask="url(#intro-lit)" />
          <path ref={pathRef} d={road.d} fill="none" stroke="none" />
          <circle ref={ringRef} r="0" fill="none" stroke={BLUE} strokeWidth={3} opacity="0" />
          <g ref={arrowRef} transform="translate(-300 -300)">
            <path
              ref={shapeRef}
              d={shapeAt(0)}
              fill={BLUE}
              stroke="white"
              strokeWidth={6}
              strokeLinejoin="round"
              paintOrder="stroke"
              style={{ filter: "drop-shadow(0 4px 10px rgba(18,83,250,0.35))" }}
            />
            <circle ref={dotRef} cx="0" cy="-26" r="5.5" fill="white" opacity="0" />
          </g>
        </svg>

        {steps.map((s, i) => {
          const atBottom = i % 2 === 0; // the arrow is up at this stop, so the words go down
          return (
            <div
              key={i}
              ref={(el) => {
                pageRefs.current[i] = el;
              }}
              aria-hidden={i !== step}
              className="absolute"
              style={{
                left: i * w,
                width: w,
                opacity: 0,
                ...(atBottom
                  ? { bottom: "calc(max(env(safe-area-inset-bottom, 16px), 16px) + 88px)" }
                  : { top: "calc(max(env(safe-area-inset-top, 16px), 16px) + 56px)" }),
              }}
            >
              <div className="w-full max-w-lg mx-auto px-4 py-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#EAF0FE" }}>
                  {s.icon}
                </div>
                <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "28px", color: "#040033", lineHeight: 1.15 }}>{s.title}</h1>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#626A76", marginTop: "10px", lineHeight: 1.55 }}>{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* top bar: progress and skip */}
      <div className="absolute left-0 right-0 top-0 z-10" style={{ paddingTop: "max(env(safe-area-inset-top, 16px), 16px)" }}>
        <div className="w-full max-w-lg mx-auto px-4 flex items-center justify-between" style={{ height: "44px" }}>
          <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${count}`}>
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
