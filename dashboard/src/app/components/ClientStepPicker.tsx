import { CLIENTS } from "../lib/entities";
import { SelectField } from "./FormField";
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
      <div className="inline-flex rounded-[var(--radius-control)] border border-border p-1 bg-grey-light w-fit">
        {(["existing", "new"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange({ ...value, mode })}
            className={`px-4 py-1.5 rounded-[10px] text-sm font-medium cursor-pointer transition-colors ${
              value.mode === mode ? "bg-white text-navy shadow-sm" : "text-muted"
            }`}
            style={{ fontFamily: "var(--font-sub)" }}
          >
            {mode === "existing" ? "Existing Client" : "New Client"}
          </button>
        ))}
      </div>

      {value.mode === "existing" ? (
        <SelectField
          label="Client"
          required
          value={value.existingClientId}
          onChange={(e) => onChange({ ...value, existingClientId: e.target.value })}
        >
          <option value="">— Select a client —</option>
          {CLIENTS.filter((c) => c.active).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
      ) : (
        <ClientForm value={value.newClient} onChange={(newClient) => onChange({ ...value, newClient })} />
      )}
    </div>
  );
}
