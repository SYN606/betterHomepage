import { useState, useEffect, useMemo } from "react";

export default function HeroTitle() {
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [fontClass, setFontClass] = useState("");

    // --- Greeting variations ---
    const greetings = useMemo(() => ({
        morning: [
            "Good Morning",
            "Rise and shine",
            "Fresh start",
            "A new day begins"
        ],
        afternoon: [
            "Good Afternoon",
            "Keep going",
            "Hope your day’s going well",
            "Stay sharp"
        ],
        evening: [
            "Good Evening",
            "Time to unwind",
            "Almost done for today",
            "Slow things down"
        ],
        night: [
            "Good Night",
            "Late night grind",
            "Still awake?",
            "Quiet hours"
        ]
    }), []);

    // --- Font styles by time ---
    const fontsByTime = {
        morning: "font-[Poppins]",
        afternoon: "font-[Inter]",
        evening: "font-[Playfair_Display]",
        night: "font-[JetBrains_Mono]"
    };

    useEffect(() => {
        const savedName = localStorage.getItem("heroTitle");
        if (savedName && savedName.trim()) {
            setName(savedName);
        }

        updateGreeting();
        const interval = setInterval(updateGreeting, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // --- Greeting logic ---
    const updateGreeting = () => {
        const hour = new Date().getHours();
        let period = "morning";

        if (hour >= 12 && hour < 17) period = "afternoon";
        else if (hour >= 17 && hour < 21) period = "evening";
        else if (hour >= 21 || hour < 5) period = "night";

        const options = greetings[period];
        const randomGreeting = options[Math.floor(Math.random() * options.length)];

        setGreeting(randomGreeting);
        setFontClass(fontsByTime[period]);
    };

    // --- Save name ---
    const saveName = (value) => {
        setName(value);
        localStorage.setItem("heroTitle", value);
    };

    return (
        <div className="flex justify-center mt-14 w-full">
            {editing ? (
                <input
                    autoFocus
                    value={name}
                    placeholder="Your name"
                    onChange={(e) => saveName(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") {
                            setEditing(false);
                        }
                    }}
                    className={`
            px-10 py-4
            rounded-3xl
            border border-white/10
            text-white text-4xl font-semibold text-center
            outline-none
            bg-black/20 backdrop-blur-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            transition-all
            min-w-[250px] max-w-[90%]
            ${fontClass}
          `}
                />
            ) : (
                <div
                    onClick={() => setEditing(true)}
                    title="Click to edit your name"
                    className={`
            px-10 py-4
            rounded-3xl
            border border-white/10
            text-white text-4xl font-semibold text-center
            backdrop-blur-xl bg-black/20
            shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            cursor-text select-none
            transition-all
            hover:bg-black/30 hover:scale-[1.02]
            animate-fadeIn
            min-w-[250px] max-w-[90%]
            ${fontClass}
          `}
                >
                    {name ? `${greeting}, ${name}` : greeting}
                </div>
            )}
        </div>
    );
}
