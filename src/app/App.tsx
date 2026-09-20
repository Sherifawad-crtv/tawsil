import "../styles/fonts.css";
import { useState } from "react";
import { TruckSelectorMap } from "./components/TruckSelectorMap";
import SideNav, { MenuButton } from "./components/SideNav";
import type { NavScreen } from "./components/SideNav";
import HomeScreen from "./components/HomeScreen";
import ActivityScreen from "./components/ActivityScreen";
import InsightsScreen from "./components/InsightsScreen";
import ProfileScreen from "./components/ProfileScreen";
import OrderDetailsScreen from "./components/OrderDetailsScreen";
import MobileOnlyGate from "./components/MobileOnlyGate";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import AddEmailModal from "./components/onboarding/AddEmailModal";
import { useIsMobileViewport } from "./hooks/useIsMobileViewport";
import { useAuth } from "./lib/AuthContext";

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [screen, setScreen] = useState<NavScreen | "booking" | "order-details">("home");
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailPromptDismissed, setEmailPromptDismissed] = useState(false);
  const isMobileViewport = useIsMobileViewport();
  const { user, updateEmail } = useAuth();

  // Individual signups skip email entirely - the one time it's actually
  // needed is the first real action, booking a truck, not before. Once
  // they've seen the prompt (added it or skipped it) it doesn't nag again
  // for the rest of the session.
  const needsEmailPrompt = user?.type === "individual" && !user.email && !emailPromptDismissed;

  const handleStartBooking = () => {
    if (needsEmailPrompt) {
      setShowEmailPrompt(true);
      return;
    }
    setScreen("booking");
  };
  const handleNavigate = (s: NavScreen) => setScreen(s);

  if (!isMobileViewport) {
    return <MobileOnlyGate />;
  }

  // Nothing else in this app is reachable until signup completes - it's the
  // starting point, not a screen you can navigate past.
  if (!user) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: "#F5F5F3" }}>
      {/* Side Nav */}
      <SideNav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        activeScreen={screen === "booking" || screen === "order-details" ? "home" : screen}
        onNavigate={handleNavigate}
      />

      {/* Menu button - hidden during booking flow */}
      {screen !== "booking" && (
        <MenuButton onClick={() => setNavOpen(true)} />
      )}

      {/* Screens */}
      {screen === "home" && (
        <HomeScreen
          onStartBooking={handleStartBooking}
          onViewActivity={() => setScreen("activity")}
          onOpenOrder={() => setScreen("order-details")}
        />
      )}
      {screen === "order-details" && (
        <OrderDetailsScreen onBack={() => setScreen("home")} />
      )}
      {screen === "activity" && <ActivityScreen />}
      {screen === "insights" && <InsightsScreen />}
      {screen === "profile" && <ProfileScreen />}
      {screen === "booking" && (
        <TruckSelectorMap onBack={() => setScreen("home")} />
      )}

      {showEmailPrompt && (
        <AddEmailModal
          onSave={(email) => {
            updateEmail(email);
            setShowEmailPrompt(false);
            setEmailPromptDismissed(true);
            setScreen("booking");
          }}
          onSkip={() => {
            setShowEmailPrompt(false);
            setEmailPromptDismissed(true);
            setScreen("booking");
          }}
        />
      )}
    </div>
  );
}