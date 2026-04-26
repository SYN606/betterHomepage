import { useEffect, useState } from "react";
import {
  HeroTitle,
  SearchBar,
  WidgetButtons,
  PinnedShortcuts,
  OnboardingModal,
  BackgroundManager,
  GoogleServices,
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
    <main className="relative min-h-screen w-full overflow-hidden bg-bg text-text">
      <BackgroundManager />

      {showOnboarding && (
        <OnboardingModal onClose={closeOnboarding} />
      )}

      <PinnedShortcuts />

      <div className="absolute top-6 right-6 z-20">
        <GoogleServices />
      </div>

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl space-y-6 text-center">
          <HeroTitle />
          <SearchBar />
        </div>
      </section>

      <div className="absolute bottom-6 right-6 z-20">
        <WidgetButtons />
      </div>
    </main>
  );
}
