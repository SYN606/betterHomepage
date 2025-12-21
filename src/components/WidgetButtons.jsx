import { useState, useEffect } from "react";
import { ClockWidget, WeatherWidget } from "./widgets";
import { FiClock, FiCloud } from "react-icons/fi";

export default function WidgetButtons() {
    const [showClock, setShowClock] = useState(true);
    const [showWeather, setShowWeather] = useState(true);
    const [glow, setGlow] = useState(false);

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

    /* ---------------- MINUTE CHANGE GLOW ---------------- */

    useEffect(() => {
        let lastMinute = new Date().getMinutes();

        const interval = setInterval(() => {
            const currentMinute = new Date().getMinutes();

            if (currentMinute !== lastMinute) {
                lastMinute = currentMinute;

                setGlow(true);
                setTimeout(() => setGlow(false), 2200);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /* ---------------- UI ---------------- */

    return (
        <div
            className={`
        absolute bottom-6 right-6
        flex items-center gap-4
        px-5 py-3
        rounded-2xl
        backdrop-blur-2xl
        bg-white/5
        border border-white/10
        shadow-[0_0_25px_rgba(0,0,0,0.35)]
        z-20
        animate-fadeIn
        transition-all
        ${glow ? "rgb-border-glow" : ""}
      `}
        >
            {/* Weather */}
            {showWeather && <WeatherWidget compact />}

            {/* Divider */}
            {showWeather && showClock && (
                <div className="w-px h-7 bg-white/15 rounded-full" />
            )}

            {/* Clock */}
            {showClock && <ClockWidget compact />}

            {/* Toggles */}
            <div className="flex items-center gap-2 ml-1">
                {/* Clock toggle */}
                <button
                    onClick={() => {
                        const val = !showClock;
                        setShowClock(val);
                        saveState("showClock", val);
                    }}
                    className={`
            w-7 h-7
            flex items-center justify-center
            rounded-lg
            text-white
            transition-all
            ${showClock ? "bg-white/20" : "bg-white/5"}
            hover:bg-white/20
            active:scale-95
          `}
                    title="Toggle Clock"
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
                    className={`
            w-7 h-7
            flex items-center justify-center
            rounded-lg
            text-white
            transition-all
            ${showWeather ? "bg-white/20" : "bg-white/5"}
            hover:bg-white/20
            active:scale-95
          `}
                    title="Toggle Weather"
                >
                    <FiCloud size={14} />
                </button>
            </div>
        </div>
    );
}
