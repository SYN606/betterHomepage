import { useEffect, useState, useRef } from "react";
import { FiEdit2, FiImage, FiUpload } from "react-icons/fi";

export default function BackgroundManager() {
    const [showMenu, setShowMenu] = useState(false);
    const [provider, setProvider] = useState("picsum");
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const uploadRef = useRef(null);

    // Load saved settings
    useEffect(() => {
        const savedProvider = localStorage.getItem("bgProvider");
        const savedBg = localStorage.getItem("bgImage");
        const savedTime = localStorage.getItem("bgTimestamp");

        if (savedProvider) setProvider(savedProvider);
        if (savedBg) setBackgroundUrl(savedBg);

        const now = Date.now();
        const thirtyMin = 30 * 60 * 1000;

        // CASE 1 → Upload mode = NEVER auto-refresh
        if (savedProvider === "upload") return;

        // CASE 2 → No timestamp (first time ever)
        if (!savedTime) {
            fetchRandomWallpaper();
            return;
        }

        // CASE 3 → Check if 30 min passed
        if (now - parseInt(savedTime) >= thirtyMin) {
            fetchRandomWallpaper();
        }
        console.log(backgroundUrl)
    }, [backgroundUrl]);

    // Fetch wallpaper from Picsum Photos
    const fetchRandomWallpaper = async () => {
        try {
            const image = await fetch(`https://picsum.photos/1920/1080?random`)
            setBackgroundUrl(image.url);
            localStorage.setItem("bgImage", image.url);
            localStorage.setItem("bgTimestamp", Date.now().toString());
        } catch (err) {
            console.error("Failed to load wallpaper:", err);
        }
    };

    // User selects provider (picsum or upload)
    const selectProvider = async (value) => {
        setProvider(value);
        localStorage.setItem("bgProvider", value);

        if (value === "picsum") {
            await fetchRandomWallpaper(); // FORCE change only when user switches to picsum
        }

        setShowMenu(false);
    };

    // Upload image handler
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;

            setBackgroundUrl(base64);
            localStorage.setItem("bgImage", base64);
            localStorage.setItem("bgProvider", "upload");

            setProvider("upload");
            setShowMenu(false);
        };

        reader.readAsDataURL(file);
    };

    return (
        <>
            {/* BACKGROUND IMAGE */}
            <div
                className="
                    absolute inset-0
                    bg-cover bg-center
                    blur-[8px]
                    brightness-[0.6]
                    -z-10
                    opacity-100
                    transition-all duration-700
                "
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            />

            {/* DARK OVERLAY */}
            <div
                className="
                    absolute inset-0
                    bg-black/40
                    -z-10
                "
            />

            {/* POPUP MENU */}
            {showMenu && (
                <div
                    className="
                        absolute bottom-20 left-6
                        p-4
                        flex flex-col gap-3
                        text-white
                        z-30
                        rounded-3xl
                        bg-black/40
                        backdrop-blur-2xl
                        border border-black/30   /* FIXED! DARK BORDER */
                        shadow-[0_8px_32px_rgba(0,0,0,0.6)]
                        animate-scaleIn
                    "
                >
                    {/* RANDOM WALLPAPER */}
                    <button
                        onClick={() => selectProvider("picsum")}
                        className="
                            flex items-center gap-3
                            bg-white/5 hover:bg-white/20
                            transition
                            px-4 py-2 rounded-xl
                        "
                    >
                        <FiImage /> Random HD Wallpaper
                    </button>

                    {/* UPLOAD */}
                    <button
                        onClick={() => uploadRef.current.click()}
                        className="
                            flex items-center gap-3
                            bg-white/5 hover:bg-white/20
                            transition
                            px-4 py-2 rounded-xl
                        "
                    >
                        <FiUpload /> Upload Image
                    </button>

                    {/* Hidden file input */}
                    <input
                        ref={uploadRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </div>
            )}

            {/* SETTINGS BUTTON */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="
                    absolute bottom-6 left-6
                    w-12 h-12
                    rounded-2xl
                    bg-black/40
                    border border-black/30   /* FIXED! */
                    backdrop-blur-xl
                    shadow-lg
                    flex items-center justify-center
                    text-white
                    hover:scale-110 hover:bg-black/50
                    transition-all
                    z-20
                "
                title="Change Background"
            >
                <FiEdit2 size={22} />
            </button>
        </>
    );
}
