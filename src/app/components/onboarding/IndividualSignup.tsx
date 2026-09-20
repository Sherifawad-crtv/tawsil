import { useState } from "react";
import ScreenShell from "./ScreenShell";
import AuthTextField from "./AuthTextField";
import OtpInput from "./OtpInput";
import { StepDots, BackButton, StepHeader, PrimaryButton, GhostButton, CTAFooter, CTA_FOOTER_CLEARANCE } from "./StepChrome";
import { useAuth } from "../../lib/AuthContext";

const TOTAL_STEPS = 3;
const MOCK_OTP = "123456";

export default function IndividualSignup({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const { signUpIndividual } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [name, setName] = useState("");

  function backOrExit() {
    if (step > 1) setStep(step - 1);
    else onBack();
  }

  function sendCode() {
    setCode("");
    setCodeError("");
    setStep(2);
  }

  function verifyCode() {
    // No SMS backend anywhere in this app - every screen's data is mocked,
    // so the "sent" code is just a fixed constant the user can always enter.
    if (code !== MOCK_OTP) {
      setCodeError(`That code didn't match - try ${MOCK_OTP} (this is a demo, no SMS is actually sent).`);
      return;
    }
    setCodeError("");
    setStep(3);
  }

  function finish() {
    signUpIndividual({ phone, name });
    onComplete();
  }

  return (
    <ScreenShell>
      <div className="pt-2 flex-shrink-0">
        <BackButton onClick={backOrExit} />
        <StepDots step={step} total={TOTAL_STEPS} />
      </div>

      <div className="flex-1 flex flex-col" style={{ paddingBottom: CTA_FOOTER_CLEARANCE }}>
        {step === 1 && (
          <>
            <StepHeader title="What's your number?" subtitle="We'll text you a code to verify it's you." />
            <div className="flex flex-col gap-4 flex-1">
              <AuthTextField
                label="Mobile number"
                type="tel"
                inputMode="tel"
                autoFocus
                placeholder="+20 100 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <CTAFooter>
              <PrimaryButton label="Send Code" onClick={sendCode} disabled={phone.trim().length < 6} />
            </CTAFooter>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeader title="Enter the code" subtitle={`We sent a 6-digit code to ${phone}.`} />
            <div className="flex flex-col gap-4 flex-1">
              <OtpInput value={code} onChange={(v) => { setCode(v); setCodeError(""); }} />
              {codeError && (
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#DC2626" }}>{codeError}</p>
              )}
              <GhostButton label="Didn't get it? Send again" onClick={sendCode} />
            </div>
            <CTAFooter>
              <PrimaryButton label="Verify" onClick={verifyCode} disabled={code.length < 6} />
            </CTAFooter>
          </>
        )}

        {step === 3 && (
          <>
            <StepHeader title="What should we call you?" subtitle="Just your name - that's everything we need to start." />
            <div className="flex flex-col gap-4 flex-1">
              <AuthTextField
                label="Full name"
                type="text"
                autoFocus
                placeholder="Ahmed Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <CTAFooter>
              <PrimaryButton label="Get Started" onClick={finish} disabled={name.trim().length < 2} />
            </CTAFooter>
          </>
        )}
      </div>
    </ScreenShell>
  );
}
