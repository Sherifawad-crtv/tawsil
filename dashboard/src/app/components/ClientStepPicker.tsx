import { CLIENTS } from "../lib/entities";
import { SelectField } from "./FormField";
import SegmentedControl from "./SegmentedControl";
import ClientForm, { EMPTY_CLIENT_FORM, type ClientFormValue } from "./ClientForm";

export interface ClientSelection {
  mode: "existing" | "new";
  existingClientId: string;
  newClient: ClientFormValue;
}

export const EMPTY_CLIENT_SELECTION: ClientSelection = {
  mode: "existing",
  existingClientId: "",
  newClient: EMPTY_CLIENT_FORM,
};

export default function ClientStepPicker({ value, onChange }: { value: ClientSelection; onChange: (value: ClientSelection) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        aria-label="Client mode"
        className="w-fit"
        value={value.mode}
        onChange={(mode) => onChange({ ...value, mode })}
        options={[
          { value: "existing", label: "Existing Client" },
          { value: "new", label: "New Client" },
        ]}
      />

      {value.mode === "existing" ? (
        <SelectField
          label="Client"
          required
          value={value.existingClientId}
          onChange={(existingClientId) => onChange({ ...value, existingClientId })}
          placeholder="— Select a client —"
          options={CLIENTS.filter((c) => c.active).map((c) => ({ value: c.id, label: c.name }))}
        />
      ) : (
        <ClientForm value={value.newClient} onChange={(newClient) => onChange({ ...value, newClient })} />
      )}
    </div>
  );
}
