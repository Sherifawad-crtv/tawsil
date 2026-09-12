import { useState, useMemo, useEffect } from "react";

/* ── Types ── */
export type BookingCategory = "on-demand" | "rental";
export type OnDemandMode = "now" | "schedule";
export type RentalMode = "daily" | "monthly";

export interface BookingTypeState {
  category: BookingCategory;
  onDemandMode: OnDemandMode;
  rentalMode: RentalMode;
  /** Daily: single selected day */
  rentalDay: Date | null;
  /** Daily: estimated km for that day */
  dailyKm: number;
  /** Monthly: which month is being viewed / selected */
  rentalMonth: { month: number; year: number } | null;
  /** Monthly: specific working days chosen within the month */
  monthlyDays: Date[];
}

export const INITIAL_BOOKING_STATE: BookingTypeState = {
  category: "on-demand",
  onDemandMode: "now",
  rentalMode: "daily",
  rentalDay: null,
  dailyKm: 0,
  rentalMonth: null,
  monthlyDays: [],
};

interface Props {
  state: BookingTypeState;
  onChange: (state: BookingTypeState) => void;
  onOpenScheduleModal: () => void;
  scheduleSummary?: string | null;
}

/* ── Helpers ── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MIN_MONTHLY_DAYS = 10;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function BookingTypeSelector({ state, onChange, onOpenScheduleModal, scheduleSummary }: Props) {
  const update = (partial: Partial<BookingTypeState>) => onChange({ ...state, ...partial });

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Category Tabs: On-Demand / Rental ── */}
      <div
        className="flex rounded-2xl p-1"
        style={{ backgroundColor: "#F0F0EE" }}
      >
        {([
          { id: "on-demand" as const, label: "On-Demand", icon: OnDemandIcon },
          { id: "rental" as const, label: "Rental", icon: RentalIcon },
        ]).map(({ id, label, icon: Icon }) => {
          const active = state.category === id;
          return (
            <button
              key={id}
              onClick={() => update({ category: id })}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: active ? "white" : "transparent",
                boxShadow: active ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Icon active={active} />
              <span
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: active ? "#040033" : "#9CA3AF",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── On-Demand Sub-options ── */}
      {state.category === "on-demand" && (
        <OnDemandSection
          mode={state.onDemandMode}
          onModeChange={(m) => {
            update({ onDemandMode: m });
            if (m === "schedule") onOpenScheduleModal();
          }}
          scheduleSummary={scheduleSummary}
        />
      )}

      {/* ── Rental Sub-options ── */}
      {state.category === "rental" && (
        <RentalSection
          mode={state.rentalMode}
          onModeChange={(m) => update({ rentalMode: m })}
          rentalDay={state.rentalDay}
          onRentalDayChange={(d) => update({ rentalDay: d })}
          dailyKm={state.dailyKm}
          onDailyKmChange={(km) => update({ dailyKm: km })}
          rentalMonth={state.rentalMonth}
          onRentalMonthChange={(m) => update({ rentalMonth: m })}
          monthlyDays={state.monthlyDays}
          onMonthlyDaysChange={(days) => update({ monthlyDays: days })}
        />
      )}
    </div>
  );
}

/* ── Icons ── */
function OnDemandIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" transform="scale(0.65) translate(1,1)" fill={active ? "#1253FA" : "#9CA3AF"} />
    </svg>
  );
}

function RentalIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5.5C2 4.4 2.9 3.5 4 3.5H12C13.1 3.5 14 4.4 14 5.5V12C14 13.1 13.1 14 12 14H4C2.9 14 2 13.1 2 12V5.5Z" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" fill="none" />
      <path d="M5 2V4.5M11 2V4.5" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 7.5H14" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" />
      <path d="M5 10H11" stroke={active ? "#1253FA" : "#9CA3AF"} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   ON-DEMAND SECTION (Now / Schedule)
   ══════════════════════════════════════════ */
function OnDemandSection({
  mode,
  onModeChange,
  scheduleSummary,
}: {
  mode: OnDemandMode;
  onModeChange: (m: OnDemandMode) => void;
  scheduleSummary?: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Sub-toggle */}
      <div className="flex gap-2">
        {([
          {
            id: "now" as const,
            label: "Now",
            desc: "Instant dispatch",
            icon: (a: boolean) => (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" fill="none" />
                <path d="M9 5.5V9L11.5 10.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            id: "schedule" as const,
            label: "Schedule",
            desc: "Pick date & time",
            icon: (a: boolean) => (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2.5" y="3.5" width="13" height="11.5" rx="2" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" fill="none" />
                <path d="M2.5 7.5H15.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" />
                <path d="M6 2V4.5M12 2V4.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ),
          },
        ]).map(({ id, label, desc, icon }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              onClick={() => onModeChange(id)}
              className="flex-1 flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer active:scale-[0.97] transition-all"
              style={{
                backgroundColor: active ? "white" : "transparent",
                border: active ? "2px solid #1253FA" : "2px solid #E8E8E5",
                boxShadow: active ? "0 2px 12px rgba(18,83,250,0.1)" : "none",
                textAlign: "left",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: active ? "rgba(18,83,250,0.08)" : "#F0F0EE" }}
              >
                {icon(active)}
              </div>
              <div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: active ? "#040033" : "#6B7280" }}>
                  {label}
                </p>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", marginTop: "1px" }}>
                  {desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary cards */}
      {mode === "now" && (
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
          style={{ backgroundColor: "rgba(18,83,250,0.04)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="#1253FA" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
              Instant Dispatch
            </p>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
              Truck assigned within minutes
            </p>
          </div>
        </div>
      )}

      {mode === "schedule" && scheduleSummary && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
          style={{ backgroundColor: "rgba(18,83,250,0.05)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#1253FA" strokeWidth="1.4" fill="none" />
            <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#1253FA" }}>
            Scheduled: {scheduleSummary}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   RENTAL SECTION (Daily / Monthly)
   ══════════════════════════════════════════ */
function RentalSection({
  mode,
  onModeChange,
  rentalDay,
  onRentalDayChange,
  dailyKm,
  onDailyKmChange,
  rentalMonth,
  onRentalMonthChange,
  monthlyDays,
  onMonthlyDaysChange,
}: {
  mode: RentalMode;
  onModeChange: (m: RentalMode) => void;
  rentalDay: Date | null;
  onRentalDayChange: (d: Date | null) => void;
  dailyKm: number;
  onDailyKmChange: (km: number) => void;
  rentalMonth: { month: number; year: number } | null;
  onRentalMonthChange: (m: { month: number; year: number }) => void;
  monthlyDays: Date[];
  onMonthlyDaysChange: (days: Date[]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Sub-toggle */}
      <div className="flex gap-2">
        {([
          {
            id: "daily" as const,
            label: "Daily",
            desc: "Rent for a single day",
            icon: (a: boolean) => (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2.5" y="3" width="13" height="12" rx="2.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" fill="none" />
                <path d="M6 1.5V4M12 1.5V4" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
                <path d="M2.5 7H15.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" />
                <rect x="7" y="9.5" width="4" height="3.5" rx="1" fill={a ? "#1253FA" : "#D8D9D4"} opacity="0.5" />
              </svg>
            ),
          },
          {
            id: "monthly" as const,
            label: "Monthly",
            desc: "10+ days per month",
            icon: (a: boolean) => (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2C5.13 2 2 5.13 2 9C2 12.87 5.13 16 9 16C12.87 16 16 12.87 16 9" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <path d="M13.5 2.5L16 5L13.5 7.5" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 5H12.5C10.84 5 9.5 6.34 9.5 8" stroke={a ? "#1253FA" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ),
          },
        ]).map(({ id, label, desc, icon }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              onClick={() => onModeChange(id)}
              className="flex-1 flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer active:scale-[0.97] transition-all"
              style={{
                backgroundColor: active ? "white" : "transparent",
                border: active ? "2px solid #1253FA" : "2px solid #E8E8E5",
                boxShadow: active ? "0 2px 12px rgba(18,83,250,0.1)" : "none",
                textAlign: "left",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: active ? "rgba(18,83,250,0.08)" : "#F0F0EE" }}
              >
                {icon(active)}
              </div>
              <div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: active ? "#040033" : "#6B7280" }}>
                  {label}
                </p>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", marginTop: "1px" }}>
                  {desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Rental content */}
      {mode === "daily" ? (
        <DailyRentalPicker
          selectedDay={rentalDay}
          onDayChange={onRentalDayChange}
          dailyKm={dailyKm}
          onDailyKmChange={onDailyKmChange}
        />
      ) : (
        <MonthlyRentalPicker
          rentalMonth={rentalMonth}
          onRentalMonthChange={onRentalMonthChange}
          monthlyDays={monthlyDays}
          onMonthlyDaysChange={onMonthlyDaysChange}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   DAILY RENTAL PICKER (single day + km)
   ══════════════════════════════════════════ */

const KM_PRESETS = [50, 100, 150, 200, 300];

function DailyRentalPicker({
  selectedDay,
  onDayChange,
  dailyKm,
  onDailyKmChange,
}: {
  selectedDay: Date | null;
  onDayChange: (d: Date | null) => void;
  dailyKm: number;
  onDailyKmChange: (km: number) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    // Toggle: deselect if same day tapped again
    if (selectedDay && isSameDay(selectedDay, d)) {
      onDayChange(null);
    } else {
      onDayChange(d);
    }
  };

  const isSelected = (day: number) => selectedDay ? isSameDay(selectedDay, new Date(viewYear, viewMonth, day)) : false;
  const isToday = (day: number) => viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
  const isPast = (day: number) => new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  return (
    <div className="flex flex-col gap-3">
      {/* Calendar */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        {/* Month nav */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: canGoPrev ? "#F0F0EE" : "transparent", opacity: canGoPrev ? 1 : 0.3, pointerEvents: canGoPrev ? "auto" : "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7L9 11" stroke="#040033" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>
            {MONTHS_FULL[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: "#F0F0EE" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="#040033" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 px-3 pb-1">
          {DAYS.map((d) => (
            <div key={d} className="flex items-center justify-center py-1.5">
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.04em" }}>{d}</span>
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const sel = isSelected(day);
            const tod = isToday(day);
            const past = isPast(day);
            return (
              <button
                key={day}
                onClick={() => !past && selectDay(day)}
                className="flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  maxHeight: "38px",
                  backgroundColor: sel ? "#1253FA" : "transparent",
                  opacity: past ? 0.3 : 1,
                  pointerEvents: past ? "none" : "auto",
                  position: "relative",
                  border: "none",
                }}
              >
                <span style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: sel || tod ? 700 : 500,
                  fontSize: "13px",
                  color: sel ? "white" : tod ? "#1253FA" : "#040033",
                }}>
                  {day}
                </span>
                {tod && !sel && (
                  <div className="absolute rounded-full" style={{ width: "4px", height: "4px", backgroundColor: "#1253FA", bottom: "3px", left: "50%", transform: "translateX(-50%)" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day summary */}
      {selectedDay && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ backgroundColor: "rgba(18,83,250,0.04)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#1253FA" strokeWidth="1.4" fill="none" />
            <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#1253FA" }}>
            {selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      )}

      {/* Kilometer Input – shown after day is selected */}
      {selectedDay && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#040033" strokeWidth="1.4" fill="none" />
              <path d="M8 4.5V8" stroke="#040033" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M8 8L10.5 10" stroke="#040033" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="8" cy="8" r="1" fill="#040033" />
            </svg>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Estimated Kilometers
            </span>
          </div>

          {/* Custom km input */}
          <div className="px-4 pb-3">
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ backgroundColor: "#F5F5F3", border: dailyKm > 0 ? "2px solid #1253FA" : "2px solid transparent", transition: "border-color 0.2s" }}
            >
              <input
                type="number"
                value={dailyKm || ""}
                onChange={(e) => onDailyKmChange(Math.max(0, Number(e.target.value)))}
                placeholder="Enter km"
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#040033",
                  minWidth: 0,
                }}
              />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "14px", color: "#9CA3AF" }}>km</span>
            </div>
          </div>

          {/* Quick-select chips */}
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            {KM_PRESETS.map((km) => {
              const active = dailyKm === km;
              return (
                <button
                  key={km}
                  onClick={() => onDailyKmChange(active ? 0 : km)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl cursor-pointer active:scale-[0.96] transition-all duration-200"
                  style={{
                    backgroundColor: active ? "#1253FA" : "#F5F5F3",
                    boxShadow: active ? "0 4px 14px rgba(18,83,250,0.2)" : "none",
                  }}
                >
                  <span style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: active ? "white" : "#040033",
                    whiteSpace: "nowrap",
                  }}>
                    {km} km
                  </span>
                </button>
              );
            })}
          </div>

          {/* Info line */}
          <div className="px-4 pb-4">
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", lineHeight: "1.5" }}>
              Set the expected distance for this rental day. Charges apply per km.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!selectedDay && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ backgroundColor: "#F0F0EE" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#E8E8E5" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="#9CA3AF" strokeWidth="1.4" fill="none" />
              <path d="M2 7H14" stroke="#9CA3AF" strokeWidth="1.4" />
              <path d="M5.5 1.5V4M10.5 1.5V4" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
              Select a rental day
            </p>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF", marginTop: "1px" }}>
              Tap a date on the calendar above
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MONTHLY RENTAL PICKER
   Choose month → multi-select working days
   Min 10 days to qualify
   ══════════════════════════════════════════ */
function MonthlyRentalPicker({
  rentalMonth,
  onRentalMonthChange,
  monthlyDays,
  onMonthlyDaysChange,
}: {
  rentalMonth: { month: number; year: number } | null;
  onRentalMonthChange: (m: { month: number; year: number }) => void;
  monthlyDays: Date[];
  onMonthlyDaysChange: (days: Date[]) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Auto-select current month if nothing selected
  useEffect(() => {
    if (!rentalMonth) {
      onRentalMonthChange({ month: currentMonth, year: currentYear });
    }
  }, []);

  // Next 6 months for month selection
  const months = useMemo(() => {
    const result: { month: number; year: number; label: string }[] = [];
    let m = currentMonth;
    let y = currentYear;
    for (let i = 0; i < 6; i++) {
      if (m > 11) { m = 0; y++; }
      result.push({ month: m, year: y, label: `${MONTHS_SHORT[m]} ${y}` });
      m++;
    }
    return result;
  }, [currentMonth, currentYear]);

  const isMonthSelected = (m: number, y: number) => rentalMonth?.month === m && rentalMonth?.year === y;

  // When switching month, reset selected days
  const handleMonthSelect = (m: number, y: number) => {
    if (rentalMonth?.month === m && rentalMonth?.year === y) return;
    onRentalMonthChange({ month: m, year: y });
    onMonthlyDaysChange([]);
  };

  const eligible = monthlyDays.length >= MIN_MONTHLY_DAYS;

  return (
    <div className="flex flex-col gap-3">
      {/* Month selector chips */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {months.map(({ month, year, label }) => {
          const sel = isMonthSelected(month, year);
          const isCurrent = month === currentMonth && year === currentYear;
          return (
            <button
              key={`${month}-${year}`}
              onClick={() => handleMonthSelect(month, year)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer active:scale-[0.96] transition-all duration-200"
              style={{
                backgroundColor: sel ? "#1253FA" : "#F0F0EE",
                boxShadow: sel ? "0 4px 14px rgba(18,83,250,0.2)" : "none",
                scrollSnapAlign: "start",
              }}
            >
              <span style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                color: sel ? "white" : "#040033",
                whiteSpace: "nowrap",
              }}>
                {label}
              </span>
              {isCurrent && !sel && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#1253FA" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar for selected month */}
      {rentalMonth && (
        <MonthDayPicker
          month={rentalMonth.month}
          year={rentalMonth.year}
          selectedDays={monthlyDays}
          onDaysChange={onMonthlyDaysChange}
        />
      )}

      {/* Eligibility / summary */}
      {rentalMonth && (
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: eligible ? "rgba(18,83,250,0.04)" : "rgba(220,38,38,0.04)",
            transition: "background-color 0.3s",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: eligible ? "rgba(18,83,250,0.08)" : "rgba(220,38,38,0.08)" }}
            >
              {eligible ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="#1253FA" strokeWidth="1.4" fill="none" />
                  <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="#1253FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#DC2626" }}>
                  {monthlyDays.length}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
                  {monthlyDays.length} day{monthlyDays.length !== 1 ? "s" : ""} selected
                </p>
                {!eligible && monthlyDays.length > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-md"
                    style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#DC2626", backgroundColor: "rgba(220,38,38,0.08)", textTransform: "uppercase", letterSpacing: "0.04em" }}
                  >
                    Min {MIN_MONTHLY_DAYS}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280", marginTop: "3px", lineHeight: "1.5" }}>
                {eligible
                  ? `Eligible for monthly rental — ${MONTHS_FULL[rentalMonth.month]} ${rentalMonth.year}`
                  : `Select at least ${MIN_MONTHLY_DAYS} working days to qualify for monthly rental pricing.`}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: eligible ? "rgba(18,83,250,0.1)" : "rgba(220,38,38,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (monthlyDays.length / MIN_MONTHLY_DAYS) * 100)}%`,
                backgroundColor: eligible ? "#1253FA" : "#DC2626",
                transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.3s",
              }}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!rentalMonth && (
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "rgba(18,83,250,0.04)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#1253FA" strokeWidth="1.4" fill="none" />
                <path d="M8 5V8.5" stroke="#1253FA" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.7" fill="#1253FA" />
              </svg>
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
                Select a month to begin
              </p>
              <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#6B7280", marginTop: "3px", lineHeight: "1.5" }}>
                Choose your rental month above, then pick at least {MIN_MONTHLY_DAYS} working days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MONTH DAY PICKER (multi-select within month)
   ══════════════════════════════════════════ */
function MonthDayPicker({
  month,
  year,
  selectedDays,
  onDaysChange,
}: {
  month: number;
  year: number;
  selectedDays: Date[];
  onDaysChange: (days: Date[]) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const toggleDay = (day: number) => {
    const d = new Date(year, month, day);
    // Don't allow past dates
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    const exists = selectedDays.find((s) => isSameDay(s, d));
    if (exists) {
      onDaysChange(selectedDays.filter((s) => !isSameDay(s, d)));
    } else {
      onDaysChange([...selectedDays, d]);
    }
  };

  const selectAllWorkingDays = () => {
    const workDays: Date[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      if (dow !== 0 && dow !== 5 && date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        workDays.push(date);
      }
    }
    onDaysChange(workDays);
  };

  const clearAll = () => onDaysChange([]);

  const isSelected = (day: number) => selectedDays.some((s) => isSameDay(s, new Date(year, month, day)));
  const isToday = (day: number) => year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  const isPast = (day: number) => new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isWeekend = (day: number) => {
    const dow = new Date(year, month, day).getDay();
    return dow === 0 || dow === 5;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Header with month + bulk actions */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>
          {MONTHS_FULL[month]} {year}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={selectAllWorkingDays}
            className="px-2.5 py-1 rounded-lg cursor-pointer active:scale-[0.96] transition-all"
            style={{ backgroundColor: "rgba(18,83,250,0.06)" }}
          >
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              All Work Days
            </span>
          </button>
          {selectedDays.length > 0 && (
            <button
              onClick={clearAll}
              className="px-2.5 py-1 rounded-lg cursor-pointer active:scale-[0.96] transition-all"
              style={{ backgroundColor: "#F0F0EE" }}
            >
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Clear
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 pb-1">
        {DAYS.map((d) => (
          <div key={d} className="flex items-center justify-center py-1.5">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.04em" }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const sel = isSelected(day);
          const tod = isToday(day);
          const past = isPast(day);
          const wknd = isWeekend(day);

          return (
            <button
              key={day}
              onClick={() => !past && toggleDay(day)}
              className="flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200"
              style={{
                width: "100%",
                aspectRatio: "1",
                maxHeight: "38px",
                backgroundColor: sel ? "#1253FA" : "transparent",
                opacity: past ? 0.25 : wknd && !sel ? 0.4 : 1,
                pointerEvents: past ? "none" : "auto",
                position: "relative",
                border: "none",
              }}
            >
              <span style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: sel || tod ? 700 : 500,
                fontSize: "13px",
                color: sel ? "white" : tod ? "#1253FA" : wknd ? "#9CA3AF" : "#040033",
              }}>
                {day}
              </span>
              {tod && !sel && (
                <div className="absolute rounded-full" style={{ width: "4px", height: "4px", backgroundColor: "#1253FA", bottom: "3px", left: "50%", transform: "translateX(-50%)" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}