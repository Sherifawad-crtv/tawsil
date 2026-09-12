import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const TRUCKS = [
  {
    id: "pickup",
    name: "Pickup Truck",
    capacity: "Up to 1 ton",
    tag: "LIGHT DUTY",
    image:
      "https://images.unsplash.com/photo-1758224388809-35bb3c3f89b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWNrdXAlMjB0cnVjayUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzc1MjMyNzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "box",
    name: "Box Truck",
    capacity: "Up to 5 tons",
    tag: "MEDIUM DUTY",
    image:
      "https://images.unsplash.com/photo-1760035434884-f77dc4ce45af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3glMjB0cnVjayUyMGRlbGl2ZXJ5JTIwY2FyZ298ZW58MXx8fHwxNzc1MjMyNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "refrigerated",
    name: "Refrigerated Truck",
    capacity: "Up to 8 tons",
    tag: "COLD CHAIN",
    image:
      "https://images.unsplash.com/photo-1673005479839-2f3620716d1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZyaWdlcmF0ZWQlMjB0cnVjayUyMGNvbGQlMjBjaGFpbnxlbnwxfHx8fDE3NzUyMzI3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "trailer",
    name: "Semi Trailer",
    capacity: "Up to 25 tons",
    tag: "HEAVY DUTY",
    image:
      "https://images.unsplash.com/photo-1774116196662-a9e1e4fa1612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW1pJTIwdHJhaWxlciUyMHRydWNrJTIwaGlnaHdheXxlbnwxfHx8fDE3NzUyMzI3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function TruckSelector() {
  const [selected, setSelected] = useState<string>("box");

  return (
    <div
      className="relative flex flex-col min-h-screen w-full max-w-[390px] mx-auto"
      style={{ backgroundColor: "#D8D9D4", fontFamily: "'Courier Prime', monospace" }}
    >
      {/* Status bar placeholder */}
      <div
        className="h-11 flex items-center px-6 justify-between"
        style={{ backgroundColor: "#040033" }}
      >
        <span
          className="text-white text-xs tracking-widest"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600 }}
        >
          9:41
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-sm"
                style={{ height: `${h}px`, backgroundColor: i < 3 ? "white" : "rgba(255,255,255,0.3)" }}
              />
            ))}
          </div>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0.5" y="0.5" width="13" height="11" rx="2" stroke="white" strokeOpacity="0.5" />
            <rect x="2" y="2" width="9" height="8" rx="1" fill="white" />
            <path d="M14 4V8C14.8 7.5 15.5 6.8 15.5 6C15.5 5.2 14.8 4.5 14 4Z" fill="white" fillOpacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div
        className="px-5 pt-6 pb-5"
        style={{ backgroundColor: "#040033" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 flex justify-center">
            {/* Progress steps */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: step === 1 ? "24px" : "8px",
                      height: "8px",
                      backgroundColor: step === 1 ? "#1253FA" : step < 1 ? "white" : "rgba(255,255,255,0.2)",
                    }}
                  />
                  {step < 4 && (
                    <div
                      className="h-px w-5"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-9" />
        </div>

        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ color: "#1253FA", fontFamily: "'Archivo', sans-serif", fontWeight: 600 }}
        >
          Step 1 of 4
        </p>
        <h1
          className="text-white mb-1"
          style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", lineHeight: "1.1" }}
        >
          Select Your<br />Truck Type
        </h1>
        <p
          className="text-sm"
          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Courier Prime', monospace" }}
        >
          Choose the vehicle that fits your load.
        </p>
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-36 flex flex-col gap-4">
        {TRUCKS.map((truck) => {
          const isSelected = selected === truck.id;
          return (
            <button
              key={truck.id}
              onClick={() => setSelected(truck.id)}
              className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98]"
              style={{
                border: isSelected ? "2.5px solid #1253FA" : "2.5px solid transparent",
                boxShadow: isSelected
                  ? "0 8px 32px rgba(18,83,250,0.18), 0 2px 8px rgba(4,0,51,0.10)"
                  : "0 2px 12px rgba(4,0,51,0.07)",
                backgroundColor: "white",
                transform: isSelected ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden" style={{ height: "180px" }}>
                <ImageWithFallback
                  src={truck.image}
                  alt={truck.name}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isSelected ? "brightness(1)" : "brightness(0.92) saturate(0.9)",
                    transition: "filter 0.2s",
                  }}
                />
                {/* Tag badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: isSelected ? "#1253FA" : "#040033",
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "white",
                  }}
                >
                  {truck.tag}
                </div>
                {/* Selected check */}
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#1253FA" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div
                className="px-4 py-4 flex items-center justify-between"
                style={{ backgroundColor: isSelected ? "#040033" : "white", transition: "background-color 0.2s" }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: "17px",
                      color: isSelected ? "white" : "#040033",
                      lineHeight: "1.2",
                    }}
                  >
                    {truck.name}
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      fontFamily: "'Courier Prime', monospace",
                      color: isSelected ? "rgba(255,255,255,0.55)" : "#6B7280",
                    }}
                  >
                    {truck.capacity}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isSelected ? "rgba(255,255,255,0.1)" : "#D8D9D4",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4L10 8L6 12"
                      stroke={isSelected ? "white" : "#040033"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sticky bottom CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-8 pt-4"
        style={{
          background: "linear-gradient(to top, #D8D9D4 70%, rgba(216,217,212,0))",
        }}
      >
        <button
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "#FF4310",
            boxShadow: "0 4px 20px rgba(4,0,51,0.35)",
          }}
        >
          <span
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "16px",
              color: "white",
              letterSpacing: "0.02em",
            }}
          >
            Continue
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}