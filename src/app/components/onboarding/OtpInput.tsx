import { useRef } from "react";

const LENGTH = 6;

/** Six boxes, one digit each - auto-advances on entry, backspace steps back. */
export default function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(index: number, digit: string) {
    const chars = value.padEnd(LENGTH, " ").split("");
    chars[index] = digit;
    onChange(chars.join("").trimEnd());
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    setDigit(index, digit);
    if (index < LENGTH - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (value[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          className="text-center border-none outline-none"
          style={{
            width: "44px",
            height: "56px",
            borderRadius: "16px",
            backgroundColor: "white",
            boxShadow: value[i] ? "0 0 0 1.5px #1253FA" : "0 1px 6px rgba(0,0,0,0.04)",
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "20px",
            color: "#040033",
            caretColor: "#1253FA",
          }}
        />
      ))}
    </div>
  );
}
