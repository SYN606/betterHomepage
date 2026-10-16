import { createSignal, createEffect } from "solid-js";

const getInitialTheme = () => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("activeMode") || "default";
  }
  return "default";
};

export const [activeTheme, setActiveTheme] = createSignal(getInitialTheme());
export const [backgroundUrl, setBackgroundUrl] = createSignal(
  typeof localStorage !== "undefined" ? localStorage.getItem("bgImage") || "" : ""
);

// Synchronize theme with DOM and localStorage
if (typeof window !== "undefined") {
  createEffect(() => {
    const current = activeTheme();
    try {
      if (current === "image") {
        document.documentElement.setAttribute("data-theme", "image");
      } else if (current === "default") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", current);
      }
      localStorage.setItem("activeMode", current);
    } catch {
      // Storage access safety
    }
  });
}

export const fetchRandomWallpaper = async () => {
  try {
    const response = await fetch(
      `https://picsum.photos/1920/1080?random=${Date.now()}`
    );
    setBackgroundUrl(response.url);
    try {
      localStorage.setItem("bgImage", response.url);
      localStorage.setItem("bgProvider", "picsum");
      localStorage.setItem("bgTimestamp", Date.now().toString());
    } catch {
      // Quota safety
    }
  } catch (err) {
    console.error("Failed to load wallpaper:", err);
  }
};
