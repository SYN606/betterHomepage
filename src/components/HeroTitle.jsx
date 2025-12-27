import { useState, useEffect } from "react";

const GREETINGS = {
    morning: [
        "Good Morning",
        "A fresh start",
        "New day, new focus",
        "Let’s begin",
        "Morning calm",
        "Time to get started",
        "Another day ahead",
        "Early focus",
        "Slow and steady"
    ],

    afternoon: [
        "Good Afternoon",
        "Stay focused",
        "Making progress",
        "Keep going",
        "Midday momentum",
        "Still time left",
        "Focused hours",
        "Keep the flow",
        "On track"
    ],

    evening: [
        "Good Evening",
        "Time to slow down",
        "Wrapping up",
        "Evening calm",
        "Almost done",
        "Gentle pace",
        "End of the day",
        "Take it easy",
        "Soft focus"
    ],

    night: [
        "Quiet hours",
        "Focus mode",
        "Working late?",
        "Good Night",
        "Late hours",
        "Night focus",
        "Still here",
        "Silent time",
        "After hours"
    ]
};


const FONT_BY_PERIOD = {
    morning: "font-[Poppins]",
    afternoon: "font-[Inter]",
    evening: "font-[Playfair_Display]",
    night: "font-[JetBrains_Mono]"
};

export default function HeroTitle() {
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [period, setPeriod] = useState("morning");

    // Helpers
    const getPeriod = () => {
        const h = new Date().getHours();
        if (h >= 5 && h < 12) return "morning";
        if (h >= 12 && h < 17) return "afternoon";
        if (h >= 17 && h < 21) return "evening";
        return "night";
    };

    const todayKey = () => new Date().toISOString().slice(0, 10);

    // Init
    useEffect(() => {
        const savedName = localStorage.getItem("heroName");
        if (savedName) setName(savedName);

        updateGreeting(true);

        const interval = setInterval(() => {
            updateGreeting(false);
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Stable greeting logic
    const updateGreeting = (force = false) => {
        const currentPeriod = getPeriod();
        const storageKey = `hero-greeting-${todayKey()}-${currentPeriod}`;

        if (!force && currentPeriod === period) return;

        let selected = localStorage.getItem(storageKey);

        if (!selected) {
            const options = GREETINGS[currentPeriod];
            selected = options[Math.floor(Math.random() * options.length)];
            localStorage.setItem(storageKey, selected);
        }

        setGreeting(selected);
        setPeriod(currentPeriod);
    };

    // Save name
    const saveName = (val) => {
        setName(val);
        localStorage.setItem("heroName", val);
    };

    // UI
    return (
        <div className="flex justify-center mt-14 w-full">
            {editing ? (
                <input
                    autoFocus
                    value={name}
                    placeholder="Your name"
                    onChange={(e) => saveName(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === "Escape") &&
                        setEditing(false)
                    }
                    className={`
                        px-10 py-4
                        rounded-3xl
                        text-white text-4xl font-semibold text-center
                        bg-black/20 backdrop-blur-xl
                        border border-white/10
                        outline-none
                        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                        min-w-[250px] max-w-[90%]
                        ${FONT_BY_PERIOD[period]}
                    `}
                />
            ) : (
                <div
                    onClick={() => setEditing(true)}
                    title="Click to set your name"
                    className={`
                        px-10 py-4
                        rounded-3xl
                        text-white text-4xl font-semibold text-center
                        bg-black/20 backdrop-blur-xl
                        border border-white/10
                        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                        cursor-text select-none
                        transition-all
                        hover:bg-black/30 hover:scale-[1.02]
                        animate-fadeIn
                        min-w-[250px] max-w-[90%]
                        ${FONT_BY_PERIOD[period]}
                    `}
                >
                    {name ? `${greeting}, ${name}` : greeting}
                </div>
            )}
        </div>
    );
}
