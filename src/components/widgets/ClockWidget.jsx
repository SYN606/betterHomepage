import { useState, useEffect } from "react";

export default function ClockWidget({ compact = false }) {
    const [time, setTime] = useState("");
    const [is24Hour, setIs24Hour] = useState(true);
    const [pulse, setPulse] = useState(false);
    const [lastMinute, setLastMinute] = useState(null);

    // Load saved format preference
    useEffect(() => {
        const saved = localStorage.getItem("clockFormat");
        if (saved) setIs24Hour(saved === "24");
    }, []);

    // Update time
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const currentMinute = now.getMinutes();

            let hours = now.getHours();
            let minutes = currentMinute.toString().padStart(2, "0");
            let suffix = "";

            if (currentMinute !== lastMinute) {
                setLastMinute(currentMinute);
                setPulse(true);
                setTimeout(() => setPulse(false), 900);
            }

            if (!is24Hour) {
                suffix = hours >= 12 ? " PM" : " AM";
                hours = hours % 12 || 12;
            }

            hours = hours.toString().padStart(2, "0");
            setTime(`${hours}:${minutes}${suffix}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, [is24Hour, lastMinute]);

    const toggleFormat = () => {
        const next = !is24Hour;
        setIs24Hour(next);
        localStorage.setItem("clockFormat", next ? "24" : "12");
    };

    return (
        <div
            onClick={toggleFormat}
            title="Click to switch 12h / 24h format"
            className={`
        rounded-xl backdrop-blur-xl bg-white/10
        border border-white/10
        shadow-[0_0_15px_rgba(0,0,0,0.25)]
        text-white select-none cursor-pointer
        transition-all hover:bg-white/20
        ${pulse ? "clock-pulse" : ""}
        ${compact ? "px-4 py-2 text-base" : "px-5 py-3 text-xl"}
      `}
        >
            {time}
        </div>
    );
}
