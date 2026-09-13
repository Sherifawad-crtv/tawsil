import { TextField } from "./FormField";
import FileUploadField from "./FileUploadField";

export interface ClientFormValue {
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
  registrationNumber: string;
}

export const EMPTY_CLIENT_FORM: ClientFormValue = {
  name: "",
  email: "",
  phone: "",
  taxNumber: "",
  registrationNumber: "",
};

/** Shared "new client" field set — used both by the standalone Add Client modal
 * and inline inside Order creation's Step 1 (New Client toggle), per spec. */
export default function ClientForm({ value, onChange }: { value: ClientFormValue; onChange: (value: ClientFormValue) => void }) {
  const set = (patch: Partial<ClientFormValue>) => onChange({ ...value, ...patch });
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <TextField label="Client Name" required value={value.name} onChange={(e) => set({ name: e.target.value })} />
      </div>
      <TextField label="Email" required type="email" value={value.email} onChange={(e) => set({ email: e.target.value })} />
      <TextField label="Phone" required value={value.phone} onChange={(e) => set({ phone: e.target.value })} />
      <TextField label="Tax Number" required value={value.taxNumber} onChange={(e) => set({ taxNumber: e.target.value })} />
      <TextField label="Registration Number" required value={value.registrationNumber} onChange={(e) => set({ registrationNumber: e.target.value })} />
      <FileUploadField label="Tax Number File" required />
      <FileUploadField label="Tax Registration File" required />
    </div>
  );
}
