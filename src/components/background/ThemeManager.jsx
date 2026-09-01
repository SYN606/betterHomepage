import { useEffect, useRef, useState } from "react";
import { HiSparkles, HiSun } from "react-icons/hi2";
import { TbSparkles, TbPlant } from "react-icons/tb";
import { FiImage, FiRefreshCw, FiUpload } from "react-icons/fi";

const THEMES = [
    { id: "default", name: "Onyx", icon: HiSparkles },
    { id: "amethyst", name: "Amethyst", icon: TbSparkles },
    { id: "emerald", name: "Emerald", icon: TbPlant },
    { id: "solar", name: "Solar", icon: HiSun },
    { id: "image", name: "Wallpaper", icon: FiImage },
];

export default function ThemeManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState(() => {
        return localStorage.getItem("activeMode") || "default";
    });
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const uploadRef = useRef(null);
    const menuRef = useRef(null);

    // Apply Theme to DOM
    useEffect(() => {
        if (activeTheme === "image") {
            document.documentElement.setAttribute("data-theme", "image");
        } else if (activeTheme === "default") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", activeTheme);
        }
        localStorage.setItem("activeMode", activeTheme);
    }, [activeTheme]);

    // Load / Fetch Wallpaper when active theme is 'image'
    useEffect(() => {
        const savedBg = localStorage.getItem("bgImage");
        const savedTime = localStorage.getItem("bgTimestamp");
        const savedProvider = localStorage.getItem("bgProvider") || "picsum";

        if (savedBg) setBackgroundUrl(savedBg);

        const refreshInterval = 30 * 60 * 1000;
        const now = Date.now();

        if (
            activeTheme === "image" &&
            savedProvider !== "upload" &&
            (!savedBg || !savedTime || now - Number(savedTime) >= refreshInterval)
        ) {
            fetchRandomWallpaper();
        }
    }, [activeTheme]);

    // Close Popover on Outside Click
    useEffect(() => {
        if (!isOpen) return;
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

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

    const ActiveIcon = THEMES.find((t) => t.id === activeTheme)?.icon || HiSparkles;

    return (
        <>
            {/* Background Image Layer (Active only when 'image' mode is selected) */}
            {activeTheme === "image" && (
                <>
                    <div
                        className="fixed inset-0 -z-10 bg-cover bg-center brightness-[0.55] blur-[2px] transition-all duration-700"
                        style={{ backgroundImage: `url(${backgroundUrl})` }}
                    />
                    <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[2px]" />
                </>
            )}

            {/* Floating Theme Switcher & Menu */}
            <div ref={menuRef} className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
                {isOpen && (
                    <div
                        style={{
                            backgroundColor: "rgba(10, 14, 22, 0.75)",
                            borderColor: "var(--glass-border)",
                            backdropFilter: "var(--glass-blur)",
                            boxShadow: "var(--shadow-glass)",
                        }}
                        className="flex w-56 flex-col gap-1 rounded-3xl border-[0.5px] p-2 text-text-primary backdrop-blur-2xl transition-all"
                    >
                        <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-text-muted uppercase">
                            Themes
                        </div>

                        {THEMES.map((theme) => {
                            const Icon = theme.icon;
                            const isSelected = activeTheme === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => setActiveTheme(theme.id)}
                                    className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${isSelected
                                            ? "bg-white/15 text-text-primary"
                                            : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                                        }`}
                                >
                                    <Icon className="h-4 w-4 text-primary" />
                                    <span>{theme.name}</span>
                                </button>
                            );
                        })}

                        {/* Sub-menu for Wallpaper Controls */}
                        {activeTheme === "image" && (
                            <>
                                <div className="mt-1 border-t border-white/10 pt-1.5 px-3 py-1 text-[10px] font-semibold tracking-wider text-text-muted uppercase">
                                    Wallpaper Actions
                                </div>
                                <button
                                    onClick={fetchRandomWallpaper}
                                    className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all cursor-pointer"
                                >
                                    <FiRefreshCw className="h-4 w-4 text-primary" />
                                    <span>Refresh Image</span>
                                </button>
                                <button
                                    onClick={() => uploadRef.current?.click()}
                                    className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all cursor-pointer"
                                >
                                    <FiUpload className="h-4 w-4 text-primary" />
                                    <span>Upload Custom</span>
                                </button>
                                <input
                                    ref={uploadRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>
                )}

                {/* Trigger Button */}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderColor: "var(--glass-border)",
                        backdropFilter: "var(--glass-blur)",
                    }}
                    className="group flex items-center gap-2.5 rounded-full border-[0.5px] px-4 py-2 text-xs font-semibold text-text-primary backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10 active:scale-95 cursor-pointer"
                >
                    <ActiveIcon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    <span className="capitalize">{activeTheme}</span>
                </button>
            </div>
        </>
    );
}