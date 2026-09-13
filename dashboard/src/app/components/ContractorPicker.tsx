import { SelectField } from "./FormField";
import { CONTRACTORS } from "../lib/entities";

export default function ContractorPicker({ value, onChange, required }: { value: string; onChange: (id: string) => void; required?: boolean }) {
  return (
    <SelectField
      label="Contractor"
      required={required}
      value={value}
      onChange={onChange}
      placeholder="— None selected —"
      options={CONTRACTORS.filter((c) => c.active).map((c) => ({ value: c.id, label: c.name }))}
    />
  );
}
