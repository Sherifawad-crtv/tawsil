import { useState } from "react";
import { UserIcon, LetterIcon, PhoneIcon, CaseIcon, CheckCircleIcon } from "@solar-icons/react/linear";
import { TextField } from "../FormField";
import { Button } from "../Button";
import { SettingsCard, SettingsSectionLabel } from "./SettingsRows";
import { useDataStore } from "../../lib/store";
import { initials } from "../../lib/format";

/**
 * The signed-in operator's own profile. There's no auth in this data model,
 * so this edits the one CurrentUser record in the store - the same record
 * the sidebar's account card reads, so saving here is a real, visible
 * change, not a form that goes nowhere.
 */
export default function AccountTab() {
  const { currentUser, updateCurrentUser } = useDataStore();
  const [form, setForm] = useState(currentUser);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const dirty = JSON.stringify(form) !== JSON.stringify(currentUser);

  function handleSave() {
    updateCurrentUser(form);
    setSavedAt(Date.now());
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0 text-title-2-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {initials(form.name || "?")}
        </div>
        <div className="min-w-0">
          <p className="text-title-3-semibold text-navy truncate" style={{ fontFamily: "var(--font-heading)" }}>
            {currentUser.name}
          </p>
          <p className="text-body-2-regular text-muted truncate">{currentUser.title}</p>
        </div>
      </div>

      <SettingsSectionLabel>Profile</SettingsSectionLabel>
      <SettingsCard className="p-4">
        <div className="grid sm:grid-cols-2 gap-4 py-2">
          <TextField
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
      </SettingsCard>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={!dirty}>
          Save changes
        </Button>
        {!dirty && savedAt && (
          <span className="flex items-center gap-1.5 text-caption-1-regular text-status-completed">
            <CheckCircleIcon size={14} /> Saved
          </span>
        )}
      </div>

      <SettingsSectionLabel className="mt-2">At a glance</SettingsSectionLabel>
      <SettingsCard>
        <Row icon={UserIcon} label="Full name" value={currentUser.name} />
        <Row icon={CaseIcon} label="Title" value={currentUser.title} />
        <Row icon={LetterIcon} label="Email" value={currentUser.email} mono />
        <Row icon={PhoneIcon} label="Phone" value={currentUser.phone} mono />
      </SettingsCard>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono = false }: { icon: typeof UserIcon; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 min-h-[52px] py-2.5 pr-4 border-b border-border last:border-b-0">
      <Icon size={15} className="text-muted flex-shrink-0" />
      <span className="text-caption-1-regular text-muted w-20 flex-shrink-0">{label}</span>
      <span
        className="text-body-2-regular text-navy truncate"
        style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-sub)" }}
      >
        {value}
      </span>
    </div>
  );
}
