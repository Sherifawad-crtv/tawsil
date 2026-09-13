import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import ClientForm, { EMPTY_CLIENT_FORM } from "./ClientForm";
import { useDataStore } from "../lib/store";

export default function AddClientModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { addClient } = useDataStore();
  const [form, setForm] = useState(EMPTY_CLIENT_FORM);
  const canSubmit = form.name && form.email && form.phone && form.taxNumber && form.registrationNumber;

  function handleSubmit() {
    const id = `cli-new-${Date.now()}`;
    addClient({ id, ...form, active: true, createdAt: new Date().toISOString().slice(0, 10) });
    onClose();
    navigate(`/clients/${id}`);
  }

  return (
    <Modal
      title="Add Client"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-1.5 rounded-[var(--radius-control)] border border-border text-sm font-semibold text-navy cursor-pointer hover:bg-grey-light" style={{ fontFamily: "var(--font-sub)" }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-1.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            Add Client
          </button>
        </div>
      }
    >
      <ClientForm value={form} onChange={setForm} />
    </Modal>
  );
}
