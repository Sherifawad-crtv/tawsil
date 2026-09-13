import { SelectField } from "./FormField";
import { CONTRACTORS } from "../lib/entities";

export default function ContractorPicker({ value, onChange, required }: { value: string; onChange: (id: string) => void; required?: boolean }) {
  return (
    <SelectField label="Contractor" required={required} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">— None selected —</option>
      {CONTRACTORS.filter((c) => c.active).map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </SelectField>
  );
}
