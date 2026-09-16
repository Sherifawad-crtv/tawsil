import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Select, type SelectOption } from "./Select";
import { FIELD_CLASS, FIELD_LABEL_CLASS } from "../lib/fieldClass";

const labelClass = FIELD_LABEL_CLASS;
const controlClass = FIELD_CLASS;

function FieldLabel({ label, required, badge }: { label: string; required?: boolean; badge?: string }) {
  return (
    <label className={labelClass} style={{ fontFamily: "var(--font-sub)" }}>
      {label}
      {required && <span className="text-status-cancelled"> *</span>}
      {badge && (
        <span
          className="ml-2 px-1.5 py-0.5 rounded-md text-caption-2-semibold text-royal bg-[#EEEAFB] uppercase tracking-wide"
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
      <textarea {...rest} className={`${controlClass} h-auto min-h-[88px] py-2.5 resize-y`} style={{ fontFamily: "var(--font-sub)" }} />
    </div>
  );
}

/** Label + BoardUI's Select (react-aria), replacing the native <select>. */
export function SelectField({
  label,
  required,
  badge,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  required?: boolean;
  badge?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <Select
        aria-label={label}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        variant="field"
      />
    </div>
  );
}
