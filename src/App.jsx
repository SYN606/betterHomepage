import { useEffect, useState } from "react";
import {
  HeroTitle,
  SearchBar,
  WidgetButtons,
  PinnedShortcuts,
  OnboardingModal,
  BackgroundManager,
  TodoHamburger
} from "./components";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("hasOnboarded");
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem("hasOnboarded", "true");
    setShowOnboarding(false);
  };

  return (
    <div
      className="
        w-full h-screen
        relative
        overflow-hidden
        flex items-center justify-center
      "
    >
      {/* Background */}
      <BackgroundManager />

      {/* First-run onboarding */}
      {showOnboarding && (
        <OnboardingModal onClose={closeOnboarding} />
      )}

      {/* Left pinned shortcuts */}
      <PinnedShortcuts />

      {/* Top-right Todo */}
      <TodoHamburger />

      {/* Center content */}
      <div className="flex flex-col gap-6 z-10 w-full">
        <HeroTitle />
        <SearchBar />
      </div>

      {/* Bottom-right widgets */}
      <WidgetButtons />
    </div>
  );
}
