import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiImage, FiRefreshCw, FiUpload } from "react-icons/fi";

export default function BackgroundManager() {
    const [showMenu, setShowMenu] = useState(false);
    const [provider, setProvider] = useState("picsum");
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const uploadRef = useRef(null);

    useEffect(() => {
        const savedProvider = localStorage.getItem("bgProvider") || "picsum";
        const savedBg = localStorage.getItem("bgImage");
        const savedTime = localStorage.getItem("bgTimestamp");

        setProvider(savedProvider);

        if (savedBg) {
            setBackgroundUrl(savedBg);
        }

        const now = Date.now();
        const refreshInterval = 30 * 60 * 1000;

        // Never auto refresh uploaded images
        if (savedProvider === "upload") return;

        // First load or refresh expired
        if (
            !savedBg ||
            !savedTime ||
            now - Number(savedTime) >= refreshInterval
        ) {
            fetchRandomWallpaper();
        }
    }, []);

    const fetchRandomWallpaper = async () => {
        try {
            const response = await fetch(
                `https://picsum.photos/1920/1080?random=${Date.now()}`
            );

            const imageUrl = response.url;

            setBackgroundUrl(imageUrl);
            setProvider("picsum");

            localStorage.setItem("bgImage", imageUrl);
            localStorage.setItem("bgProvider", "picsum");
            localStorage.setItem("bgTimestamp", Date.now().toString());
        } catch (error) {
            console.error("Failed to load wallpaper:", error);
        }
    };

    const selectProvider = async (value) => {
        setProvider(value);
        localStorage.setItem("bgProvider", value);

        if (value === "picsum") {
            await fetchRandomWallpaper();
        }

        setShowMenu(false);
    };

    const refreshWallpaper = async () => {
        await fetchRandomWallpaper();
        setShowMenu(false);
    };

    const handleUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result;

            setBackgroundUrl(base64);
            setProvider("upload");

            localStorage.setItem("bgImage", base64);
            localStorage.setItem("bgProvider", "upload");
            localStorage.removeItem("bgTimestamp");

            setShowMenu(false);
        };

        reader.readAsDataURL(file);
    };

    return (
        <>
            {/* Background Image */}
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center brightness-[0.55] blur-[2px] transition-all duration-700"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            />

            {/* Subtle readability overlay */}
            <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-[3px]" />

            {/* Background Menu */}
            {showMenu && (
                <div className="absolute bottom-20 left-6 z-30 flex min-w-[280px] flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 text-white shadow-2xl backdrop-blur-2xl">
                    <button
                        onClick={() => selectProvider("picsum")}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10"
                    >
                        <FiImage size={18} />
                        Random HD Wallpaper
                    </button>

                    <button
                        onClick={refreshWallpaper}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10"
                    >
                        <FiRefreshCw size={18} />
                        Refresh Wallpaper
                    </button>

                    <button
                        onClick={() => uploadRef.current?.click()}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10"
                    >
                        <FiUpload size={18} />
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

            {/* Settings Button */}
            <button
                onClick={() => setShowMenu((prev) => !prev)}
                title="Change Background"
                className="absolute bottom-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-xl backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/15"
            >
                <FiEdit2 size={20} />
            </button>
        </>
    );
}
