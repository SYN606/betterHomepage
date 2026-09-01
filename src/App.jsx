import { useEffect, useState } from "react";
import {
  CybermindWatermark,
  GoogleServices,
  HeroTitle,
  OnboardingModal,
  PinnedShortcuts,
  SearchBar,
  ThemeManager,
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
    <main className="relative min-h-screen w-full overflow-hidden text-text-primary">
      {/* Dynamic Background & Combined Theme System */}
      <ThemeManager />
      <CybermindWatermark />

      {/* Modals */}
      {showOnboarding && <OnboardingModal onClose={closeOnboarding} />}

      {/* Navigation Docks & Widgets */}
      <PinnedShortcuts />

      <div className="fixed top-6 right-6 z-20">
        <GoogleServices />
      </div>

      {/* Hero Content Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl space-y-6 text-center">
          <HeroTitle />
          <SearchBar />
        </div>
      </section>
    </main>
  );
}