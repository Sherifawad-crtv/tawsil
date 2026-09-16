import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./Button";
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
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add Client
          </Button>
        </>
      }
    >
      <ClientForm value={form} onChange={setForm} />
    </Modal>
  );
}
