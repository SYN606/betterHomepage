import { createEffect, createSignal, onCleanup, onMount, Show, For } from "solid-js";
import {
  SparklesIcon,
  SunIcon,
  PlantIcon,
  ImageIcon,
  RefreshIcon,
  UploadIcon,
} from "../common/Icons";

const THEMES = [
  { id: "default", name: "Onyx", icon: SparklesIcon },
  { id: "amethyst", name: "Amethyst", icon: SparklesIcon },
  { id: "emerald", name: "Emerald", icon: PlantIcon },
  { id: "solar", name: "Solar", icon: SunIcon },
  { id: "image", name: "Wallpaper", icon: ImageIcon },
];

export default function ThemeManager() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeTheme, setActiveTheme] = createSignal(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("activeMode") || "default"
      : "default"
  );
  const [backgroundUrl, setBackgroundUrl] = createSignal("");

  let uploadRef;
  let menuRef;
  let triggerBtnRef;

  // Apply Theme to DOM and LocalStorage
  createEffect(() => {
    const current = activeTheme();
    if (typeof document !== "undefined") {
      if (current === "image") {
        document.documentElement.setAttribute("data-theme", "image");
      } else if (current === "default") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", current);
      }
      localStorage.setItem("activeMode", current);
    }
  });

  const fetchRandomWallpaper = async () => {
    try {
      const response = await fetch(
        `https://picsum.photos/1920/1080?random=${Date.now()}`
      );
      setBackgroundUrl(response.url);
      localStorage.setItem("bgImage", response.url);
      localStorage.setItem("bgProvider", "picsum");
      localStorage.setItem("bgTimestamp", Date.now().toString());
    } catch (err) {
      console.error("Failed to load wallpaper:", err);
    }
  };

  // Load / Fetch Wallpaper when active theme is 'image'
  createEffect(() => {
    if (activeTheme() === "image") {
      const savedBg = localStorage.getItem("bgImage");
      const savedTime = localStorage.getItem("bgTimestamp");
      const savedProvider = localStorage.getItem("bgProvider") || "picsum";

      if (savedBg) setBackgroundUrl(savedBg);

      const refreshInterval = 30 * 60 * 1000;
      const now = Date.now();

      if (
        savedProvider !== "upload" &&
        (!savedBg || !savedTime || now - Number(savedTime) >= refreshInterval)
      ) {
        fetchRandomWallpaper();
      }
    }
  });

  // Close Popover on Outside Click
  onMount(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen() &&
        menuRef &&
        !menuRef.contains(e.target) &&
        triggerBtnRef &&
        !triggerBtnRef.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    onCleanup(() => document.removeEventListener("mousedown", handleOutsideClick));
  });

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setBackgroundUrl(base64);
      localStorage.setItem("bgImage", base64);
      localStorage.setItem("bgProvider", "upload");
    };
    reader.readAsDataURL(file);
  };

  const getActiveIcon = () => {
    const found = THEMES.find((t) => t.id === activeTheme());
    return found ? found.icon : SparklesIcon;
  };

  return (
    <>
      {/* Background Image Layer (Active only when 'image' mode is selected) */}
      <Show when={activeTheme() === "image"}>
        <div
          class="fixed inset-0 -z-10 bg-cover bg-center brightness-[0.55] blur-[2px] transition-all duration-700"
          style={{ "background-image": `url(${backgroundUrl()})` }}
        />
        <div class="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[2px]" />
      </Show>

      {/* Floating Theme Switcher & Menu */}
      <div class="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
        <Show when={isOpen()}>
          <div
            ref={menuRef}
            style={{
              "background-color": "rgba(10, 14, 22, 0.75)",
              "border-color": "var(--glass-border)",
              "backdrop-filter": "var(--glass-blur)",
              "box-shadow": "var(--shadow-glass)",
            }}
            class="flex w-56 flex-col gap-1 rounded-3xl border-[0.5px] p-2 text-text-primary backdrop-blur-2xl transition-all"
          >
            <div class="px-3 py-1 text-[10px] font-semibold tracking-wider text-text-muted uppercase">
              Themes
            </div>

            <For each={THEMES}>
              {(theme) => {
                const Icon = theme.icon;
                const isSelected = () => activeTheme() === theme.id;
                return (
                  <button
                    onClick={() => setActiveTheme(theme.id)}
                    class={`flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected()
                        ? "bg-white/15 text-text-primary"
                        : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                    }`}
                  >
                    <Icon class="h-4 w-4 text-primary" />
                    <span>{theme.name}</span>
                  </button>
                );
              }}
            </For>

            {/* Sub-menu for Wallpaper Controls */}
            <Show when={activeTheme() === "image"}>
              <div class="mt-1 border-t border-white/10 pt-1.5 px-3 py-1 text-[10px] font-semibold tracking-wider text-text-muted uppercase">
                Wallpaper Actions
              </div>
              <button
                onClick={fetchRandomWallpaper}
                class="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all cursor-pointer"
              >
                <RefreshIcon class="h-4 w-4 text-primary" />
                <span>Refresh Image</span>
              </button>
              <button
                onClick={() => uploadRef?.click()}
                class="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all cursor-pointer"
              >
                <UploadIcon class="h-4 w-4 text-primary" />
                <span>Upload Custom</span>
              </button>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                class="hidden"
              />
            </Show>
          </div>
        </Show>

        {/* Trigger Button */}
        <button
          ref={triggerBtnRef}
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            "background-color": "rgba(255, 255, 255, 0.03)",
            "border-color": "var(--glass-border)",
            "backdrop-filter": "var(--glass-blur)",
          }}
          class="group flex items-center gap-2.5 rounded-full border-[0.5px] px-4 py-2 text-xs font-semibold text-text-primary backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10 active:scale-95 cursor-pointer"
        >
          {(() => {
            const ActiveIcon = getActiveIcon();
            return (
              <ActiveIcon class="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
            );
          })()}
          <span class="capitalize">{activeTheme()}</span>
        </button>
      </div>
    </>
  );
}