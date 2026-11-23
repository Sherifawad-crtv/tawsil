import { useState } from "react";
import AccountTypeScreen from "./AccountTypeScreen";
import IndividualSignup from "./IndividualSignup";
import BusinessSignup from "./BusinessSignup";
import IntroWalkthrough, { type IntroStep } from "./IntroWalkthrough";
import LocalShippingRounded from "../icons/LocalShippingRounded";
import GavelRounded from "../icons/GavelRounded";
import RouteRounded from "../icons/RouteRounded";
import { useAuth } from "../../lib/AuthContext";
import { hasSeenIntro, markIntroSeen } from "../../lib/introSeen";
import type { AccountType } from "../../lib/authTypes";

const icon = (Icon: typeof LocalShippingRounded) => <Icon sx={{ fontSize: 26, color: "#1253FA" }} />;

const INTRO: IntroStep[] = [
  {
    icon: icon(LocalShippingRounded),
    title: "Book a truck in minutes",
    body: "Set your pickup and drop-offs, pick the truck that fits your load, and book on demand or as a rental.",
  },
  {
    icon: icon(GavelRounded),
    title: "Choose the offer you like",
    body: "Set your fare and nearby drivers send offers. You pick the one that suits you.",
  },
  {
    icon: icon(RouteRounded),
    title: "Follow every trip",
    body: "Track your truck on the map, then find past trips and their receipts in Activity.",
  },
];

type Choice = { kind: "type"; type: AccountType } | { kind: "guest" };

/** Gates the whole app until someone finishes signup or continues as a guest - see App.tsx. Welcome, then the three-step intro (first launch only), then the form or guest. */
export default function OnboardingFlow() {
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [pendingIntro, setPendingIntro] = useState<Choice | null>(null);
  const { continueAsGuest } = useAuth();

  function proceed(choice: Choice) {
    if (choice.kind === "guest") continueAsGuest();
    else setAccountType(choice.type);
  }

  // Whatever they pick on the welcome screen waits for the intro the first time.
  function choose(choice: Choice) {
    if (hasSeenIntro()) proceed(choice);
    else setPendingIntro(choice);
  }

  if (pendingIntro) {
    return (
      <IntroWalkthrough
        steps={INTRO}
        onDone={() => {
          markIntroSeen();
          const choice = pendingIntro;
          setPendingIntro(null);
          proceed(choice);
        }}
      />
    );
  }

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
  return <AccountTypeScreen onChoose={(type) => choose({ kind: "type", type })} onContinueAsGuest={() => choose({ kind: "guest" })} />;
}
