import { useState } from "react";
import AccountTypeScreen from "./AccountTypeScreen";
import IndividualSignup from "./IndividualSignup";
import BusinessSignup from "./BusinessSignup";
import { useAuth } from "../../lib/AuthContext";
import type { AccountType } from "../../lib/authTypes";

/** Gates the whole app until someone finishes signup or continues as a guest - see App.tsx. */
export default function OnboardingFlow() {
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const { continueAsGuest } = useAuth();

  // Signup itself writes the user into AuthContext (signUpIndividual /
  // signUpBusiness); App.tsx re-renders past this flow the moment that
  // context has a user, so neither branch needs an onComplete callback
  // beyond letting that write happen. continueAsGuest works the same way.
  if (accountType === "individual") {
    return <IndividualSignup onBack={() => setAccountType(null)} onComplete={() => {}} />;
  }
  if (accountType === "business") {
    return <BusinessSignup onBack={() => setAccountType(null)} onComplete={() => {}} />;
  }
  return <AccountTypeScreen onChoose={setAccountType} onContinueAsGuest={continueAsGuest} />;
}
