import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const LABEL_STYLE = { fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" };
const FIELD_STYLE = { fontFamily: "'Archivo', sans-serif", fontSize: "14px", color: "#040033" };

export function TextField({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block mb-1.5" style={LABEL_STYLE}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </span>
      <input
        {...props}
        className="w-full h-12 rounded-2xl px-4 outline-none focus:ring-2"
        style={{ ...FIELD_STYLE, backgroundColor: "#F5F5F3", ["--tw-ring-color" as string]: "#1253FA" }}
      />
    </label>
  );
}

export function SelectField({
  label,
  required,
  children,
  ...props
}: { label: string; required?: boolean } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="block mb-1.5" style={LABEL_STYLE}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </span>
      <select
        {...props}
        className="w-full h-12 rounded-2xl px-4 outline-none focus:ring-2 appearance-none"
        style={{ ...FIELD_STYLE, backgroundColor: "#F5F5F3", ["--tw-ring-color" as string]: "#1253FA" }}
      >
        {children}
      </select>
    </label>
  );
}
