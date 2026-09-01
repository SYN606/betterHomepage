import { useEffect, useState } from "react";
import { HiSparkles, HiSun } from "react-icons/hi2";
import { TbSparkles, TbPlant } from "react-icons/tb";
import { FiImage } from "react-icons/fi";

const MODES = [
  { id: "default", name: "Onyx", type: "theme", icon: HiSparkles },
  { id: "amethyst", name: "Amethyst", type: "theme", icon: TbSparkles },
  { id: "emerald", name: "Emerald", type: "theme", icon: TbPlant },
  { id: "solar", name: "Solar", type: "theme", icon: HiSun },
  { id: "image", name: "Wallpaper", type: "image", icon: FiImage },
];

export function ThemeButton() {
  const [modeIndex, setModeIndex] = useState(() => {
    const saved = localStorage.getItem("activeMode");
    const foundIndex = MODES.findIndex((m) => m.id === saved);
    return foundIndex !== -1 ? foundIndex : 0;
  });

  const currentMode = MODES[modeIndex];
  const Icon = currentMode.icon;

  useEffect(() => {
    if (currentMode.type === "image") {
      document.documentElement.setAttribute("data-theme", "image");
    } else if (currentMode.id === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", currentMode.id);
    }

    localStorage.setItem("activeMode", currentMode.id);
  }, [modeIndex, currentMode]);

  const cycleMode = () => {
    setModeIndex((prev) => (prev + 1) % MODES.length);
  };

  return (
    <button
      onClick={cycleMode}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderColor: "var(--glass-border)",
        backdropFilter: "var(--glass-blur)",
      }}
      className="group flex items-center gap-2 rounded-full border-[0.5px] px-3.5 py-1.5 text-xs font-semibold text-text-primary transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10 active:scale-95 cursor-pointer"
      aria-label="Switch Theme or Background Mode"
    >
      <Icon className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:rotate-12" />
      <span>{currentMode.name}</span>
    </button>
  );
}