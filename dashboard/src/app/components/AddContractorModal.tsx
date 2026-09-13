import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import { TextField } from "./FormField";
import FileUploadField from "./FileUploadField";
import { useDataStore } from "../lib/store";

export default function AddContractorModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { addContractor } = useDataStore();
  const [form, setForm] = useState({ name: "", nationalId: "", email: "", phone: "", firstName: "", lastName: "" });
  const canSubmit = form.name && form.nationalId && form.email && form.phone && form.firstName && form.lastName;

  function handleSubmit() {
    const id = `con-new-${Date.now()}`;
    addContractor({ id, ...form, active: true });
    onClose();
    navigate(`/contractors/${id}`);
  }

  return (
    <Modal
      title="Add Contractor"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-[var(--radius-control)] border border-border text-sm font-semibold text-navy cursor-pointer hover:bg-grey-light" style={{ fontFamily: "var(--font-sub)" }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            Add Contractor
          </button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <TextField label="Contractor Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <TextField label="National ID" required value={form.nationalId} onChange={(e) => setForm((f) => ({ ...f, nationalId: e.target.value }))} />
        <TextField label="Email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <TextField label="Phone" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <TextField label="First Name" required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
        <TextField label="Last Name" required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
        <FileUploadField label="National ID File" />
        <FileUploadField label="Tax Registration File" />
        <FileUploadField label="Company Registration File" />
      </div>
    </Modal>
  );
}
