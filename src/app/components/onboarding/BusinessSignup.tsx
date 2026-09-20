import { useState } from "react";
import ScreenShell from "./ScreenShell";
import AuthTextField from "./AuthTextField";
import FileUploadRow from "./FileUploadRow";
import { StepDots, BackButton, StepHeader, PrimaryButton } from "./StepChrome";
import { useAuth } from "../../lib/AuthContext";

const TOTAL_STEPS = 4;

interface FormState {
  businessName: string;
  phone: string;
  email: string;
  taxNumber: string;
  registrationNumber: string;
  taxNumberFileName: string;
  registrationFileName: string;
}

function emptyState(): FormState {
  return { businessName: "", phone: "", email: "", taxNumber: "", registrationNumber: "", taxNumberFileName: "", registrationFileName: "" };
}

export default function BusinessSignup({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const { signUpBusiness } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyState);

  function backOrExit() {
    if (step > 1) setStep(step - 1);
    else onBack();
  }

  function finish() {
    signUpBusiness({
      businessName: form.businessName,
      phone: form.phone,
      email: form.email,
      taxNumber: form.taxNumber,
      registrationNumber: form.registrationNumber,
      taxNumberFileName: form.taxNumberFileName || undefined,
      registrationFileName: form.registrationFileName || undefined,
    });
    onComplete();
  }

  const canContinueStep1 = form.businessName.trim().length > 1 && form.phone.trim().length >= 6;
  const canContinueStep2 = form.email.trim().length > 3 && form.taxNumber.trim().length > 0 && form.registrationNumber.trim().length > 0;
  // Documents are collected like the dashboard's own Add Client form does,
  // but not required to proceed there either - same leniency here.
  const canContinueStep3 = true;

  return (
    <ScreenShell>
      <div className="pt-2 flex-shrink-0">
        <BackButton onClick={backOrExit} />
        <StepDots step={step} total={TOTAL_STEPS} />
      </div>

      <div className="flex-1 flex flex-col">
        {step === 1 && (
          <>
            <StepHeader title="Tell us about your business" subtitle="This is how you'll appear to drivers and contractors." />
            <div className="flex flex-col gap-4 flex-1">
              <AuthTextField
                label="Business name"
                type="text"
                autoFocus
                placeholder="Khan Logistics LLC"
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
              />
              <AuthTextField
                label="Business phone"
                type="tel"
                inputMode="tel"
                placeholder="+20 100 123 4567"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <PrimaryButton label="Continue" onClick={() => setStep(2)} disabled={!canContinueStep1} />
          </>
        )}

        {step === 2 && (
          <>
            <StepHeader title="Contact & tax details" subtitle="The same information our sales team collects for every business client." />
            <div className="flex flex-col gap-4 flex-1">
              <AuthTextField
                label="Business email"
                type="email"
                autoFocus
                placeholder="ops@khanlogistics.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <AuthTextField
                label="Tax number"
                type="text"
                placeholder="TAX-000000"
                value={form.taxNumber}
                onChange={(e) => setForm((f) => ({ ...f, taxNumber: e.target.value }))}
              />
              <AuthTextField
                label="Registration number"
                type="text"
                placeholder="REG-000000"
                value={form.registrationNumber}
                onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))}
              />
            </div>
            <PrimaryButton label="Continue" onClick={() => setStep(3)} disabled={!canContinueStep2} />
          </>
        )}

        {step === 3 && (
          <>
            <StepHeader title="Supporting documents" subtitle="Tax and registration certificates - you can add these later too." />
            <div className="flex flex-col gap-3 flex-1">
              <FileUploadRow
                label="Tax number certificate"
                hint="PDF - upload your tax registration document"
                fileName={form.taxNumberFileName || undefined}
                onSelect={(name) => setForm((f) => ({ ...f, taxNumberFileName: name }))}
              />
              <FileUploadRow
                label="Registration certificate"
                hint="PDF - upload your business registration document"
                fileName={form.registrationFileName || undefined}
                onSelect={(name) => setForm((f) => ({ ...f, registrationFileName: name }))}
              />
            </div>
            <PrimaryButton label="Continue" onClick={() => setStep(4)} disabled={!canContinueStep3} />
          </>
        )}

        {step === 4 && (
          <>
            <StepHeader title="Review & confirm" subtitle="Make sure everything looks right before we set up your account." />
            <div className="flex flex-col gap-3 flex-1">
              <div className="rounded-2xl p-4" style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <ReviewRow label="Business name" value={form.businessName} />
                <ReviewRow label="Phone" value={form.phone} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Tax number" value={form.taxNumber} />
                <ReviewRow label="Registration number" value={form.registrationNumber} />
                <ReviewRow label="Tax certificate" value={form.taxNumberFileName || "Not added"} />
                <ReviewRow label="Registration certificate" value={form.registrationFileName || "Not added"} last />
              </div>
            </div>
            <PrimaryButton label="Confirm & Get Started" onClick={finish} />
          </>
        )}
      </div>
    </ScreenShell>
  );
}

function ReviewRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-2.5"
      style={last ? undefined : { borderBottom: "1px solid #F0F0EE" }}
    >
      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>{label}</span>
      <span className="truncate text-right" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033", maxWidth: "60%" }}>
        {value}
      </span>
    </div>
  );
}
