import "../styles/fonts.css";
import { useState } from "react";
import { TruckSelectorMap } from "./components/TruckSelectorMap";
import BottomNav from "./components/BottomNav";
import type { NavScreen } from "./components/BottomNav";
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

      {/* Bottom tab bar - hidden during booking and the full-screen order details drill-in */}
      {screen !== "booking" && screen !== "order-details" && (
        <BottomNav activeScreen={screen} onNavigate={handleNavigate} />
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