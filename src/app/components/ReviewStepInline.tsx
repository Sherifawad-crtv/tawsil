import { VEHICLES } from "./VehicleCarouselSelectable";
import type { DropoffStop } from "./DropoffStops";
import type { AddedLocation } from "./PickupStepInline";
import ShieldRounded from "./icons/ShieldRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import CreditCardRounded from "./icons/CreditCardRounded";
import RemoveRounded from "./icons/RemoveRounded";
import AddRounded from "./icons/AddRounded";
import TrendingUpRounded from "./icons/TrendingUpRounded";
import TrendingDownRounded from "./icons/TrendingDownRounded";
import HorizontalRuleRounded from "./icons/HorizontalRuleRounded";

interface ReviewStepInlineProps {
  truckId: string;
  configId: string;
  weightKg: number;
  schedule: { mode: "now" | "schedule"; date?: Date; time?: string };
  deliverySettings: boolean;
  dropoffStops: DropoffStop[];
  pickupLocations: AddedLocation[];
  clientOffer?: number | null;
  onClientOfferChange?: (v: number) => void;
  showCargoDetails?: boolean;
}

const CONFIG_LABELS: Record<string, { name: string; detail: string }> = {
  frozen: { name: "Frozen", detail: "Below -18°C" },
  chilled: { name: "Chilled", detail: "0°C to 5°C" },
  open: { name: "Open", detail: "Flatbed cargo" },
  closed: { name: "Closed", detail: "Sealed box" },
};

const QUICK_DELTAS = [-50, -20, 0, 20, 50];

function formatDate(d?: Date) {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/* ── Small section label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block mb-2"
      style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#9CA3AF",
      }}
    >
      {children}
    </span>
  );
}

/* ── Divider ── */
function Divider() {
  return <div className="my-4" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />;
}

/* ── Status pill ── */
function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl"
      style={{
        backgroundColor: active ? "rgba(18,83,250,0.07)" : "rgba(0,0,0,0.03)",
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 600,
        fontSize: "11px",
        color: active ? "#1253FA" : "#9CA3AF",
      }}
    >
      <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: active ? "#1253FA" : "#D8D9D4" }} />
      {label}
    </span>
  );
}

export default function ReviewStepInline(props: ReviewStepInlineProps) {
  const { truckId, configId, weightKg, schedule, deliverySettings, dropoffStops, pickupLocations, clientOffer, onClientOfferChange, showCargoDetails = true } = props;
  const truck = VEHICLES.find((v) => v.id === truckId) || VEHICLES[0];
  const config = CONFIG_LABELS[configId] || CONFIG_LABELS["closed"];

  /* fake price */
  const basePrice = truck.id === "jumbo" ? 850 : truck.id === "trailer" ? 620 : truck.id === "van" ? 380 : 280;
  const configMult = configId === "frozen" ? 1.4 : configId === "chilled" ? 1.2 : 1;
  const weightSurcharge = weightKg > 1000 ? 120 : weightKg > 500 ? 60 : 0;
  const stopFee = Math.max(0, dropoffStops.length - 1) * 45;
  const subtotal = Math.round(basePrice * configMult + weightSurcharge + stopFee);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;
  const currentOffer = clientOffer ?? total;
  const diff = currentOffer - total;

  return (
    <div className="flex flex-col gap-0">
      {/* ── Vehicle ── */}
      <SectionLabel>Vehicle</SectionLabel>
      <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F8F8F6" }}>
          <img src={truck.image} alt={truck.name} className="w-11 h-11 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>{truck.name}</h3>
          <span
            className="inline-block mt-0.5 px-2 py-0.5 rounded-md"
            style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", backgroundColor: "rgba(18,83,250,0.06)", textTransform: "uppercase" }}
          >
            {truck.id === "jumbo" ? "Heavy Duty" : truck.id === "trailer" ? "Long Haul" : truck.id === "van" ? "Mid-Range" : "Light Load"}
          </span>
        </div>
      </div>

      {showCargoDetails && (
        <>
          <Divider />

          {/* ── Config + Weight side by side ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <SectionLabel>Configuration</SectionLabel>
              <div className="p-3 rounded-2xl" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>{config.name}</span>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>{config.detail}</p>
              </div>
            </div>
            <div>
              <SectionLabel>Weight</SectionLabel>
              <div className="p-3 rounded-2xl" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "#040033" }}>{weightKg > 0 ? weightKg.toLocaleString() : "—"}</span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF", marginLeft: "3px" }}>kg</span>
              </div>
            </div>
          </div>
        </>
      )}

      <Divider />

      {/* ── Route ── */}
      <SectionLabel>Route</SectionLabel>
      <div className="p-3 rounded-2xl" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        {/* Pickup */}
        <div className="flex items-start gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 1.5px #040033" }} />
            <div style={{ width: "1.5px", height: "18px", backgroundColor: "#E8E8E5", margin: "3px 0" }} />
          </div>
          <div className="flex-1 min-w-0 -mt-0.5">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pickup</span>
            <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
              {pickupLocations.length > 0 ? pickupLocations[0].address : "Al Quoz Industrial Area"}
            </p>
          </div>
        </div>

        {/* Drop-offs */}
        {(dropoffStops.length > 0 ? dropoffStops : [{ id: "d", address: "Jebel Ali Free Zone, Gate 3", label: "Warehouse A" }]).map((stop, i, arr) => (
          <div key={stop.id} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 1.5px #1253FA" }} />
              {i < arr.length - 1 && <div style={{ width: "1.5px", height: "18px", backgroundColor: "#E8E8E5", margin: "3px 0" }} />}
            </div>
            <div className="flex-1 min-w-0 -mt-0.5">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Drop-off{arr.length > 1 ? ` #${i + 1}` : ""}
              </span>
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{stop.address}</p>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Schedule ── */}
      <SectionLabel>Schedule</SectionLabel>
      <div className="p-3 rounded-2xl" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        {schedule.mode === "now" ? (
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>ASAP</span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>~15 min dispatch</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>{formatDate(schedule.date)}</span>
            {schedule.time && <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#1253FA" }}>{schedule.time}</span>}
          </div>
        )}
      </div>

      <Divider />

      {/* ── Delivery & POD ── */}
      <SectionLabel>Proof of Delivery</SectionLabel>
      <div className="p-3 rounded-2xl flex items-center gap-3" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <StatusPill active={deliverySettings} label="Photo POD" />
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>
          {deliverySettings ? "Enabled — photo required at drop‑off" : "Disabled"}
        </span>
      </div>

      <Divider />

      {/* ── Price ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #040033" }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#040033" }}>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
            Price Estimate
          </span>
          <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", textTransform: "uppercase", color: "#FF4310", backgroundColor: "rgba(255,67,16,0.15)" }}>
            Final at delivery
          </span>
        </div>
        <div className="px-4 py-3" style={{ backgroundColor: "white" }}>
          <div className="flex items-center justify-between py-1">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>Base fare</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>EGP {basePrice}</span>
          </div>
          {configMult > 1 && (
            <div className="flex items-center justify-between py-1">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>Config surcharge</span>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>EGP {Math.round(basePrice * (configMult - 1))}</span>
            </div>
          )}
          {weightSurcharge > 0 && (
            <div className="flex items-center justify-between py-1">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>Weight</span>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>EGP {weightSurcharge}</span>
            </div>
          )}
          {stopFee > 0 && (
            <div className="flex items-center justify-between py-1">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>Multi-stop</span>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>EGP {stopFee}</span>
            </div>
          )}

          <div className="my-2" style={{ height: "1px", backgroundColor: "#E8E8E5" }} />

          <div className="flex items-center justify-between py-1">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>Subtotal</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>EGP {subtotal}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>VAT (5%)</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#9CA3AF" }}>EGP {vat}</span>
          </div>

          <div className="my-2" style={{ height: "1.5px", backgroundColor: "#040033" }} />

          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>Total</span>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "24px", color: "#040033", lineHeight: "1.1" }}>EGP {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Your Offer (Bidding) ── */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Your Offer</SectionLabel>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Bid your price
          </span>
        </div>

        <div className="rounded-2xl p-4" style={{ backgroundColor: "white", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", border: "1.5px solid rgba(18,83,250,0.15)" }}>
          {/* Recommended */}
          <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: "1px dashed #E8E8E5" }}>
            <div className="flex flex-col">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Recommended
              </span>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                Based on similar trips
              </span>
            </div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "16px", color: "#040033" }}>
              EGP {total.toLocaleString()}
            </span>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => onClientOfferChange?.(Math.max(50, currentOffer - 10))}
              className="flex items-center justify-center cursor-pointer active:scale-90"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "16px",
                backgroundColor: "#F5F5F3",
                border: "1px solid #E8E8E5",
                transition: "transform 0.2s ease, background-color 0.2s ease",
              }}
              aria-label="Decrease offer"
            >
              <RemoveRounded sx={{ fontSize: 20, color: "#040033" }} />
            </button>

            <div className="flex-1 flex flex-col items-center">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#9CA3AF", letterSpacing: "0.12em" }}>
                EGP
              </span>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "30px", color: "#040033", lineHeight: 1.05 }}>
                {currentOffer.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {diff === 0 && (
                  <>
                    <HorizontalRuleRounded sx={{ fontSize: 12, color: "#6B7280" }} />
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>
                      Match recommended
                    </span>
                  </>
                )}
                {diff > 0 && (
                  <>
                    <TrendingUpRounded sx={{ fontSize: 12, color: "#1253FA" }} />
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA" }}>
                      +EGP {diff} · faster match
                    </span>
                  </>
                )}
                {diff < 0 && (
                  <>
                    <TrendingDownRounded sx={{ fontSize: 12, color: "#DC2626" }} />
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#DC2626" }}>
                      {diff} EGP · fewer offers
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => onClientOfferChange?.(currentOffer + 10)}
              className="flex items-center justify-center cursor-pointer active:scale-90"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "16px",
                backgroundColor: "#1253FA",
                border: "none",
                boxShadow: "0 2px 10px rgba(18,83,250,0.25)",
                transition: "transform 0.2s ease",
              }}
              aria-label="Increase offer"
            >
              <AddRounded sx={{ fontSize: 20, color: "white" }} />
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-1.5 mt-3">
            {QUICK_DELTAS.map((d) => {
              const active = diff === d;
              return (
                <button
                  key={d}
                  onClick={() => onClientOfferChange?.(Math.max(50, total + d))}
                  className="flex-1 rounded-xl cursor-pointer active:scale-95"
                  style={{
                    backgroundColor: active ? "#040033" : "#F5F5F3",
                    border: active ? "1px solid #040033" : "1px solid #E8E8E5",
                    padding: "8px 4px",
                    transition: "background-color 0.2s ease, transform 0.15s ease",
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: "12px",
                    color: active ? "white" : "#040033",
                  }}
                >
                  {d === 0 ? "Match" : d > 0 ? `+${d}` : `${d}`}
                </button>
              );
            })}
          </div>

          <p className="mt-3" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10.5px", color: "#9CA3AF", lineHeight: 1.5, textAlign: "center" }}>
            Drivers will counter-bid live. Higher offers attract faster pickups.
          </p>
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="flex items-center gap-1">
          <ShieldRounded sx={{ fontSize: 10, color: "#D8D9D4" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#9CA3AF" }}>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <AccessTimeRounded sx={{ fontSize: 10, color: "#D8D9D4" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#9CA3AF" }}>Cancel anytime</span>
        </div>
        <div className="flex items-center gap-1">
          <CreditCardRounded sx={{ fontSize: 10, color: "#D8D9D4" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#9CA3AF" }}>Pay on delivery</span>
        </div>
      </div>
    </div>
  );
}

/* Export total calculator for use in parent CTA */
export function calcTotal(props: ReviewStepInlineProps) {
  const truck = VEHICLES.find((v) => v.id === props.truckId) || VEHICLES[0];
  const basePrice = truck.id === "jumbo" ? 850 : truck.id === "trailer" ? 620 : truck.id === "van" ? 380 : 280;
  const configMult = props.configId === "frozen" ? 1.4 : props.configId === "chilled" ? 1.2 : 1;
  const weightSurcharge = props.weightKg > 1000 ? 120 : props.weightKg > 500 ? 60 : 0;
  const stopFee = Math.max(0, props.dropoffStops.length - 1) * 45;
  const subtotal = Math.round(basePrice * configMult + weightSurcharge + stopFee);
  const vat = Math.round(subtotal * 0.05);
  return subtotal + vat;
}