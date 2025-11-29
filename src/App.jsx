import { HeroTitle, SearchBar, WidgetButtons, PinnedShortcuts } from "./components";
import BackgroundManager from "./components/BackgroundManager";

export default function App() {
  return (
    <div
      className="
        w-full h-screen
        relative
        overflow-hidden
        flex items-center justify-center
      "
    >
      {/* Fullscreen background */}
      <BackgroundManager />

      {/* Left shortcuts */}
      <PinnedShortcuts />

      {/* CENTER CONTENT (now full width) */}
      <div className="flex flex-col gap-6 z-10 w-full">
        <HeroTitle />
        <SearchBar />
      </div>

      {/* Bottom-right widgets */}
      <WidgetButtons />
    </div>
  );
}
