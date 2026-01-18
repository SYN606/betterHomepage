import { useState, useEffect } from "react";
import { ClockWidget, WeatherWidget } from "./widgets";
import { FiClock, FiCloud } from "react-icons/fi";

export default function WidgetButtons() {
    const [showClock, setShowClock] = useState(true);
    const [showWeather, setShowWeather] = useState(true);
    const [pulse, setPulse] = useState(false);

    /* ---------------- LOAD SAVED STATES ---------------- */

    useEffect(() => {
        const savedClock = localStorage.getItem("showClock");
        const savedWeather = localStorage.getItem("showWeather");

        if (savedClock !== null) setShowClock(savedClock === "true");
        if (savedWeather !== null) setShowWeather(savedWeather === "true");
    }, []);

    const saveState = (key, value) => {
        localStorage.setItem(key, value.toString());
    };

    /* ---------------- MINUTE-ALIGNED PULSE ---------------- */

    useEffect(() => {
        const triggerPulse = () => {
            setPulse(true);
            setTimeout(() => setPulse(false), 1600);
        };

        const now = new Date();
        const delay = (60 - now.getSeconds()) * 1000;

        const timeout = setTimeout(() => {
            triggerPulse();
            const interval = setInterval(triggerPulse, 60000);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    /* ---------------- UI ---------------- */

    return (
        <div
            className={`
        absolute bottom-6 right-6 z-20
        flex items-center gap-4
        px-5 py-3
        rounded-2xl
        backdrop-blur-xl
        bg-black/40
        border border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.45)]
        transition-all
      `}
        >
            {/* WEATHER */}
            {showWeather && (
                <div className="opacity-90">
                    <WeatherWidget compact />
                </div>
            )}

            {/* DIVIDER */}
            {showWeather && showClock && (
                <div
                    className={`
            w-px h-7
            transition-all
            ${pulse ? "bg-white/40" : "bg-white/15"}
          `}
                />
            )}

            {/* CLOCK */}
            {showClock && (
                <div
                    className={`
            rounded-xl px-1
            transition
            ${pulse ? "ring-1 ring-white/30 bg-white/5" : ""}
          `}
                >
                    <ClockWidget compact />
                </div>
            )}

            {/* CONTROLS */}
            <div className="flex items-center gap-2 ml-1">
                {/* Clock toggle */}
                <button
                    onClick={() => {
                        const val = !showClock;
                        setShowClock(val);
                        saveState("showClock", val);
                    }}
                    aria-pressed={showClock}
                    title="Toggle Clock"
                    className={`
            w-7 h-7
            flex items-center justify-center
            rounded-lg
            text-white/70
            transition
            ${showClock ? "bg-white/15" : "bg-white/5"}
            hover:bg-white/20 hover:text-white
            active:scale-95
          `}
                >
                    <FiClock size={14} />
                </button>

                {/* Weather toggle */}
                <button
                    onClick={() => {
                        const val = !showWeather;
                        setShowWeather(val);
                        saveState("showWeather", val);
                    }}
                    aria-pressed={showWeather}
                    title="Toggle Weather"
                    className={`
            w-7 h-7
            flex items-center justify-center
            rounded-lg
            text-white/70
            transition
            ${showWeather ? "bg-white/15" : "bg-white/5"}
            hover:bg-white/20 hover:text-white
            active:scale-95
          `}
                >
                    <FiCloud size={14} />
                </button>
            </div>
        </div>
    );
}
