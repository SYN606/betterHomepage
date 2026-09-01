import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiRefreshCw, FiUpload } from "react-icons/fi";

export default function BackgroundManager() {
  const [showMenu, setShowMenu] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [currentMode, setCurrentMode] = useState("default");
  const uploadRef = useRef(null);

  // Monitor active mode state
  useEffect(() => {
    const updateModeState = () => {
      const activeMode =
        document.documentElement.getAttribute("data-theme") || "default";
      setCurrentMode(activeMode);
    };

    updateModeState();

    const observer = new MutationObserver(updateModeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const savedBg = localStorage.getItem("bgImage");
    const savedTime = localStorage.getItem("bgTimestamp");
    const savedProvider = localStorage.getItem("bgProvider") || "picsum";

    if (savedBg) setBackgroundUrl(savedBg);

    const now = Date.now();
    const refreshInterval = 30 * 60 * 1000;

    if (savedProvider === "upload") return;

    if (!savedBg || !savedTime || now - Number(savedTime) >= refreshInterval) {
      fetchRandomWallpaper();
    }
  }, []);

  const fetchRandomWallpaper = async () => {
    try {
      const response = await fetch(
        `https://picsum.photos/1920/1080?random=${Date.now()}`
      );
      setBackgroundUrl(response.url);
      localStorage.setItem("bgImage", response.url);
      localStorage.setItem("bgProvider", "picsum");
      localStorage.setItem("bgTimestamp", Date.now().toString());
    } catch (error) {
      console.error("Failed to load wallpaper:", error);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setBackgroundUrl(base64);
      localStorage.setItem("bgImage", base64);
      localStorage.setItem("bgProvider", "upload");
      setShowMenu(false);
    };
    reader.readAsDataURL(file);
  };

  // Only render Image layer when mode is set to "image"
  if (currentMode !== "image") {
    return null;
  }

  return (
    <>
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center brightness-[0.55] blur-[2px] transition-all duration-700"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[2px]" />

      {/* Popover Glass Menu */}
      {showMenu && (
        <div
          style={{
            backgroundColor: "rgba(10, 14, 22, 0.65)",
            borderColor: "var(--glass-border)",
            backdropFilter: "var(--glass-blur)",
            boxShadow: "var(--shadow-glass)",
          }}
          className="fixed bottom-20 left-6 z-30 flex min-w-64 flex-col gap-1.5 rounded-3xl border-[0.5px] p-2.5 text-text-primary backdrop-blur-2xl transition-all"
        >
          <button
            onClick={() => {
              fetchRandomWallpaper();
              setShowMenu(false);
            }}
            className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-text-primary transition-all hover:bg-white/10 cursor-pointer"
          >
            <FiRefreshCw size={15} className="text-primary" />
            Refresh Wallpaper
          </button>
          <button
            onClick={() => uploadRef.current?.click()}
            className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-text-primary transition-all hover:bg-white/10 cursor-pointer"
          >
            <FiUpload size={15} className="text-primary" />
            Upload Custom Image
          </button>
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Floating Glass Action Button */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        title="Change Wallpaper"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderColor: "var(--glass-border)",
          backdropFilter: "var(--glass-blur)",
        }}
        className="fixed bottom-6 left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border-[0.5px] text-text-primary transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10 cursor-pointer"
      >
        <FiEdit2 size={16} />
      </button>
    </>
  );
}