import type { InputHTMLAttributes } from "react";

interface AuthTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "style"> {
  label: string;
  error?: string;
}

/** One labelled input, same white-card/Archivo look as the rest of this app's inline inputs. */
export default function AuthTextField({ label, error, id, ...inputProps }: AuthTextFieldProps) {
  const fieldId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {label}
      </label>
      <div
        className="flex items-center rounded-2xl px-4"
        style={{
          backgroundColor: "white",
          boxShadow: error ? "0 0 0 1.5px #DC2626" : "0 1px 6px rgba(0,0,0,0.04)",
          height: "52px",
        }}
      >
        <input
          id={fieldId}
          {...inputProps}
          className="flex-1 border-none outline-none bg-transparent w-full"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033", caretColor: "#1253FA" }}
        />
      </div>
      {error && (
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#DC2626" }}>{error}</span>
      )}
    </div>
  );
}
