import { useEffect, useState } from "react";

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
        "Slow and steady",
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
        "On track",
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
        "Soft focus",
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
        "After hours",
    ],
};

const FONT_BY_PERIOD = {
    morning: "font-[Poppins]",
    afternoon: "font-[Inter]",
    evening: "font-[Playfair_Display]",
    night: "font-[Inter]",
};

export default function HeroTitle() {
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [period, setPeriod] = useState("morning");
    const [time, setTime] = useState("");

    function getPeriod() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";

        return "night";
    }

    function todayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    function getFormattedTime() {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function updateGreeting(force = false) {
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
    }

    function saveName(value) {
        setName(value);
        localStorage.setItem("heroName", value);
    }

    useEffect(() => {
        const savedName = localStorage.getItem("heroName");

        if (savedName) {
            setName(savedName);
        }

        setTime(getFormattedTime());
        updateGreeting(true);

        const clockInterval = setInterval(() => {
            setTime(getFormattedTime());
        }, 1000);

        const greetingInterval = setInterval(() => {
            updateGreeting(false);
        }, 15 * 60 * 1000);

        return () => {
            clearInterval(clockInterval);
            clearInterval(greetingInterval);
        };
    }, []);

    const displayName = name?.trim() ? name : "Friend";

    return (
        <section className="flex w-full flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="text-base md:text-lg font-medium tracking-[0.18em] text-white/85 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                {time}
            </div>

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
            w-full max-w-[700px]
            rounded-3xl
            border border-white/10
            bg-black/30
            px-8 py-4
            text-center
            text-2xl md:text-4xl
            font-semibold
            text-white
            placeholder:text-white/40
            backdrop-blur-2xl
            outline-none
            shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            transition-all
            focus:bg-black/35
            focus:border-white/20
            ${FONT_BY_PERIOD[period]}
          `}
                />
            ) : (
                <div
                    onClick={() => setEditing(true)}
                    title="Click to set your name"
                    className={`
            w-full max-w-[700px]
            cursor-text
            select-none
            rounded-3xl
            border border-white/10
            bg-black/30
            px-8 py-4
            text-center
            text-2xl md:text-4xl
            font-semibold
            text-white
            backdrop-blur-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            transition-all duration-300
            hover:scale-[1.01]
            hover:bg-black/35
            ${FONT_BY_PERIOD[period]}
          `}
                >
                    {`${greeting}, ${displayName}`}
                </div>
            )}

            <p className="max-w-2xl text-sm md:text-base text-white/75 leading-relaxed">
                Stay focused. Small progress still moves you forward.
            </p>
        </section>
    );
}
