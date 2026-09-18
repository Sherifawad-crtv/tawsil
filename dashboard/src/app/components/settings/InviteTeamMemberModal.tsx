import { useState } from "react";
import Modal from "../Modal";
import { TextField } from "../FormField";
import { Select } from "../Select";
import { Button } from "../Button";
import { useDataStore } from "../../lib/store";
import { ROLES } from "../../lib/RoleContext";
import type { Role } from "../../lib/types";

export default function InviteTeamMemberModal({ onClose }: { onClose: () => void }) {
  const { inviteTeamMember } = useDataStore();
  const [form, setForm] = useState<{ name: string; email: string; role: Role }>({
    name: "",
    email: "",
    role: "Sales",
  });
  const canSubmit = form.name.trim() && form.email.trim();

  function handleSubmit() {
    inviteTeamMember(form);
    onClose();
  }

  return (
    <Modal
      title="Invite a team member"
      subtitle="They'll get the access this role has as soon as they sign in - there's no separate approval step in this data."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Send invite
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="Full name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <TextField
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <div>
          <label className="block text-body-2-semibold text-navy mb-1.5" style={{ fontFamily: "var(--font-sub)" }}>
            Role
          </label>
          <Select
            aria-label="Role"
            variant="field"
            className="w-full"
            value={form.role}
            onChange={(v) => setForm((f) => ({ ...f, role: v as Role }))}
            options={ROLES.map((r) => ({ value: r, label: r }))}
          />
        </div>
      </div>
    </Modal>
  );
}
