import { useState, useMemo, useEffect } from "react";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";

type Mode = "now" | "schedule";

/* ── Helpers ── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/* ── Time slots ── */
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 22; h++) {
    slots.push(`${pad(h)}:00`);
    slots.push(`${pad(h)}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

/* ══════════════════════════════════════════
   MODE TOGGLE (Now / Schedule)
   ══════════════════════════════════════════ */
export function ScheduleToggle({
  mode,
  onModeChange,
  scheduleSummary,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  scheduleSummary?: string | null;
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className="flex rounded-2xl p-1"
        style={{ backgroundColor: "#F0F0EE" }}
      >
        {(["now", "schedule"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-all duration-300"
            style={{
              backgroundColor: mode === m ? "white" : "transparent",
              boxShadow: mode === m ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {m === "now" ? (
              mode === m
                ? <AccessTimeRounded sx={{ fontSize: 16, color: "#1253FA" }} />
                : <AccessTimeOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
            ) : (
              mode === m
                ? <CalendarMonthRounded sx={{ fontSize: 16, color: "#1253FA" }} />
                : <CalendarMonthOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
            )}
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: mode === m ? "#040033" : "#9CA3AF",
                transition: "color 0.2s",
              }}
            >
              {m === "now" ? "Now" : "Schedule"}
            </span>
          </button>
        ))}
      </div>

      {/* Inline summary when scheduled */}
      {mode === "now" && (
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-2xl mt-3"
          style={{ backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
          >
            <BoltOutlined sx={{ fontSize: 20, color: "#1253FA" }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", color: "#040033" }}>
              Instant Dispatch
            </p>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
              Truck assigned within minutes
            </p>
          </div>
        </div>
      )}

      {mode === "schedule" && scheduleSummary && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mt-3"
          style={{ backgroundColor: "rgba(18,83,250,0.05)" }}
        >
          <CheckCircleOutlined sx={{ fontSize: 16, color: "#1253FA" }} />
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#1253FA" }}>
            Scheduled: {scheduleSummary}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SCHEDULE MODAL (Calendar + Time Picker)
   ══════════════════════════════════════════ */
export function ScheduleModal({
  value,
  onConfirm,
  onClose,
}: {
  value: { date?: Date; time?: string };
  onConfirm: (data: { date: Date; time: string }) => void;
  onClose: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(value?.date || today);
  const [selectedTime, setSelectedTime] = useState(value?.time || "09:00");
  const [viewYear, setViewYear] = useState((value?.date || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((value?.date || today).getMonth());
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
  }, []);

  const handleClose = () => {
    setExiting(true);
    setEntered(false);
    setTimeout(() => onClose(), 350);
  };

  const handleConfirm = () => {
    setExiting(true);
    setEntered(false);
    setTimeout(() => onConfirm({ date: selectedDate, time: selectedTime }), 300);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const handleDateSelect = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    setSelectedDate(d);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const isToday = (day: number) =>
    viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

  const isSelected = (day: number) =>
    viewYear === selectedDate.getFullYear() && viewMonth === selectedDate.getMonth() && day === selectedDate.getDate();

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        backgroundColor: entered ? "rgba(4,0,51,0.5)" : "rgba(4,0,51,0)",
        backdropFilter: entered ? "blur(8px)" : "blur(0px)",
        transition: "background-color 0.4s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.4s ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full flex flex-col"
        style={{
          backgroundColor: "#F5F5F3",
          borderRadius: "24px 24px 0 0",
          maxHeight: "85dvh",
          overflow: "hidden",
          transform: entered ? "translateY(0)" : "translateY(100%)",
          opacity: entered ? 1 : 0,
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "20px", color: "#040033" }}>
            Schedule Pickup
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: "#E8E8E5" }}
          >
            <CloseOutlined sx={{ fontSize: 14, color: "#040033" }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-3" style={{ minHeight: 0 }}>
          {/* Calendar card */}
          <div
            className="rounded-2xl mb-4 overflow-hidden"
            style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  backgroundColor: canGoPrev ? "#F0F0EE" : "transparent",
                  opacity: canGoPrev ? 1 : 0.3,
                  pointerEvents: canGoPrev ? "auto" : "none",
                }}
              >
                <ChevronLeftOutlined sx={{ fontSize: 14, color: "#040033" }} />
              </button>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" }}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "#F0F0EE" }}
              >
                <ChevronRightOutlined sx={{ fontSize: 14, color: "#040033" }} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 px-4 pb-1">
              {DAYS.map((d) => (
                <div key={d} className="flex items-center justify-center py-1.5">
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.04em" }}>
                    {d}
                  </span>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 px-4 pb-4 gap-y-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const sel = isSelected(day);
                const tod = isToday(day);
                const past = isPast(day);

                return (
                  <button
                    key={day}
                    onClick={() => !past && handleDateSelect(day)}
                    className="flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      maxHeight: "40px",
                      backgroundColor: sel ? "#1253FA" : "transparent",
                      opacity: past ? 0.3 : 1,
                      pointerEvents: past ? "none" : "auto",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: sel || tod ? 700 : 500,
                        fontSize: "14px",
                        color: sel ? "white" : tod ? "#1253FA" : "#040033",
                      }}
                    >
                      {day}
                    </span>
                    {tod && !sel && (
                      <div
                        className="absolute rounded-full"
                        style={{ width: "4px", height: "4px", backgroundColor: "#1253FA", bottom: "4px", left: "50%", transform: "translateX(-50%)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time picker card */}
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="px-5 pt-4 pb-2 flex items-center gap-2">
              <AccessTimeOutlined sx={{ fontSize: 14, color: "#040033" }} />
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Pickup Time
              </span>
            </div>

            <div
              className="flex gap-2 px-4 pb-4 overflow-x-auto"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {TIME_SLOTS.map((t) => {
                const isActive = selectedTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl cursor-pointer active:scale-[0.96] transition-all duration-200"
                    style={{
                      scrollSnapAlign: "start",
                      backgroundColor: isActive ? "#1253FA" : "#F5F5F3",
                      boxShadow: isActive ? "0 4px 14px rgba(18,83,250,0.2)" : "none",
                      minWidth: "72px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: isActive ? "white" : "#040033",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confirm button */}
        <div className="flex-shrink-0 px-5 pb-5 pt-3" style={{ borderTop: "1px solid #E8E8E5" }}>
          <button
            onClick={handleConfirm}
            className="w-full rounded-2xl flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer"
            style={{
              backgroundColor: "#1253FA",
              boxShadow: "0 4px 20px rgba(18,83,250,0.3)",
              padding: "16px",
              transition: "transform 0.2s ease",
            }}
          >
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white", letterSpacing: "0.02em" }}>
              Confirm Schedule
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LEGACY DEFAULT EXPORT (kept for compatibility)
   ══════════════════════════════════════════ */
export default function SchedulePicker({
  value,
  onChange,
}: {
  value?: { mode: Mode; date?: Date; time?: string };
  onChange?: (data: { mode: Mode; date?: Date; time?: string }) => void;
}) {
  const [mode, setMode] = useState<Mode>(value?.mode || "now");
  const [selectedDate, setSelectedDate] = useState<Date>(value?.date || new Date());
  const [selectedTime, setSelectedTime] = useState(value?.time || "09:00");
  const [showModal, setShowModal] = useState(false);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    if (m === "schedule") {
      setShowModal(true);
    } else {
      onChange?.({ mode: "now" });
    }
  };

  const scheduleSummary = mode === "schedule" && selectedDate
    ? `${selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${selectedTime}`
    : null;

  return (
    <>
      <ScheduleToggle mode={mode} onModeChange={handleModeChange} scheduleSummary={scheduleSummary} />
      {showModal && (
        <ScheduleModal
          value={{ date: selectedDate, time: selectedTime }}
          onConfirm={({ date, time }) => {
            setSelectedDate(date);
            setSelectedTime(time);
            setShowModal(false);
            onChange?.({ mode: "schedule", date, time });
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}