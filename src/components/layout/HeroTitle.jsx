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
        "Fresh perspectives",
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
        "Steady pace",
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
        "Reflect & unwind",
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
        "Midnight thoughts",
    ],
};

export default function HeroTitle() {
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const [greeting, setGreeting] = useState("");
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

        let selected = localStorage.getItem(storageKey);

        if (force || !selected) {
            const options = GREETINGS[currentPeriod];
            selected = options[Math.floor(Math.random() * options.length)];
            localStorage.setItem(storageKey, selected);
        }

        setGreeting(selected);
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

    // Display only greeting if no name is provided
    const greetingText = name?.trim() ? `${greeting}, ${name.trim()}` : greeting;

    return (
        <section className="flex w-full flex-col items-center justify-center gap-3 px-4 text-center select-none">
            {/* Dynamic Digital Clock */}
            <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs md:text-sm font-semibold tracking-[0.25em] text-text-muted uppercase drop-shadow-md"
            >
                {time}
            </div>

            {/* Liquid Glass Greeting Box / Name Input */}
            {editing ? (
                <input
                    autoFocus
                    value={name}
                    placeholder="Enter your name"
                    onChange={(e) => saveName(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") {
                            setEditing(false);
                        }
                    }}
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderColor: "var(--glass-border-hover)",
                        backdropFilter: "var(--glass-blur)",
                        fontFamily: "var(--font-display)",
                    }}
                    className="w-full max-w-[640px] rounded-full border-[0.5px] px-8 py-3.5 text-center text-2xl md:text-3xl font-semibold text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 focus:border-white/30"
                />
            ) : (
                <div
                    onClick={() => setEditing(true)}
                    title="Click to set or change your name"
                    style={{
                        backgroundColor: "transparent",
                        borderColor: "var(--glass-border)",
                        backdropFilter: "var(--glass-blur)",
                        fontFamily: "var(--font-display)",
                    }}
                    className="w-full max-w-[640px] cursor-pointer rounded-full border-[0.5px] px-8 py-3.5 text-center text-2xl md:text-3xl font-semibold text-text-primary transition-all duration-300 hover:scale-[1.01] hover:border-white/30 hover:bg-white/5"
                >
                    {greetingText}
                </div>
            )}

            {/* Subtitle Motivator */}
            <p className="max-w-xl text-xs md:text-sm font-normal text-text-secondary leading-relaxed drop-shadow-sm">
                Stay focused. Small progress still moves you forward.
            </p>
        </section>
    );
}