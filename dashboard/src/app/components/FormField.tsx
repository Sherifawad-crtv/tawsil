import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

const labelClass = "block text-xs font-semibold text-navy mb-1";
const controlClass =
  "w-full px-3 py-2 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/30";

function FieldLabel({ label, required, badge }: { label: string; required?: boolean; badge?: string }) {
  return (
    <label className={labelClass} style={{ fontFamily: "var(--font-sub)" }}>
      {label}
      {required && <span className="text-status-cancelled"> *</span>}
      {badge && (
        <span
          className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold text-royal bg-[#EEEAFB] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {badge}
        </span>
      )}
    </label>
  );
}

export function TextField({
  label,
  required,
  badge,
  ...rest
}: { label: string; required?: boolean; badge?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <input {...rest} className={controlClass} style={{ fontFamily: "var(--font-sub)" }} />
    </div>
  );
}

export function TextareaField({
  label,
  required,
  badge,
  ...rest
}: { label: string; required?: boolean; badge?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <textarea {...rest} className={`${controlClass} min-h-[80px] resize-y`} style={{ fontFamily: "var(--font-sub)" }} />
    </div>
  );
}

export function SelectField({
  label,
  required,
  badge,
  children,
  ...rest
}: { label: string; required?: boolean; badge?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <select {...rest} className={`${controlClass} cursor-pointer`} style={{ fontFamily: "var(--font-sub)" }}>
        {children}
      </select>
    </div>
  );
}
