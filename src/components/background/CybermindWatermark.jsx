import { Show } from "solid-js";
import { activeTheme } from "../../features/utils/themeState";

export default function CybermindWatermark() {
  return (
    <Show when={activeTheme() !== "image"}>
      <div class="pointer-events-none fixed inset-0 -z-10 flex flex-col items-center justify-center overflow-hidden select-none">
        {/* Subtle Radial Backlight */}
        <div
          style={{
            background:
              "radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)",
          }}
          class="absolute h-[500px] w-[500px] rounded-full opacity-30 blur-3xl transition-all duration-700"
        />

        {/* Japanese Kanji with Breathing Animation */}
        <div
          style={{
            color: "var(--color-primary)",
            "font-family": "'Space Grotesk', sans-serif",
          }}
          class="animate-watermark-breath text-[10rem] font-black tracking-widest transition-all duration-700 md:text-[16rem] lg:text-[20rem]"
        >
          サイバーマインド
        </div>

        {/* English Label */}
        <div
          style={{
            color: "var(--color-primary)",
            "font-family": "var(--font-mono)",
            "letter-spacing": "0.5em",
          }}
          class="-mt-10 text-xs font-bold uppercase opacity-20 transition-all duration-700 md:text-sm"
        >
          cybermind
        </div>
      </div>
    </Show>
  );
}