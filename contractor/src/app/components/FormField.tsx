import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const LABEL_STYLE = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: "11px",
  color: "#9CA3AF",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};
const FIELD_STYLE = { fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px", color: "#040033" };

/** Same white-card/soft-shadow input as the client app's AuthTextField, with an error state shown as a red ring. */
export function TextField({
  label,
  required,
  error,
  ...props
}: { label: string; required?: boolean; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={LABEL_STYLE}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </span>
      <div
        className="flex items-center rounded-2xl px-4"
        style={{ backgroundColor: "white", boxShadow: error ? "0 0 0 1.5px #DC2626" : "0 1px 6px rgba(0,0,0,0.04)", height: "52px" }}
      >
        <input {...props} className="flex-1 border-none outline-none bg-transparent w-full" style={{ ...FIELD_STYLE, caretColor: "#1253FA" }} />
      </div>
      {error && <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#DC2626" }}>{error}</span>}
    </label>
  );
}

export function SelectField({
  label,
  required,
  error,
  children,
  ...props
}: { label: string; required?: boolean; error?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={LABEL_STYLE}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </span>
      <div
        className="flex items-center rounded-2xl px-4"
        style={{ backgroundColor: "white", boxShadow: error ? "0 0 0 1.5px #DC2626" : "0 1px 6px rgba(0,0,0,0.04)", height: "52px" }}
      >
        <select {...props} className="flex-1 border-none outline-none bg-transparent w-full appearance-none" style={FIELD_STYLE}>
          {children}
        </select>
      </div>
      {error && <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#DC2626" }}>{error}</span>}
    </label>
  );
}
