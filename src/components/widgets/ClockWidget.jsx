import { useState, useEffect, useRef } from "react";
import "../../css/clockWidget.css";

export default function ClockWidget({ compact = false }) {
    const [time, setTime] = useState("");
    const [is24Hour, setIs24Hour] = useState(true);
    const [pulse, setPulse] = useState(false);

    const minuteRef = useRef(null);
    const intervalRef = useRef(null);

    /* ---------------- LOAD FORMAT ---------------- */

    useEffect(() => {
        const saved = localStorage.getItem("clockFormat");
        if (saved) setIs24Hour(saved === "24");
    }, []);

    /* ---------------- CLOCK UPDATE ---------------- */

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const minute = now.getMinutes();

            if (minute !== minuteRef.current) {
                minuteRef.current = minute;
                setPulse(true);
                setTimeout(() => setPulse(false), 650);
            }

            let hours = now.getHours();
            let suffix = "";

            if (!is24Hour) {
                suffix = hours >= 12 ? " PM" : " AM";
                hours = hours % 12 || 12;
            }

            const formatted =
                `${hours.toString().padStart(2, "0")}:` +
                `${minute.toString().padStart(2, "0")}${suffix}`;

            setTime(formatted);
        };

        // Initial render
        updateClock();

        // Align to next minute
        const now = new Date();
        const msToNextMinute =
            (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        const timeout = setTimeout(() => {
            updateClock();
            intervalRef.current = setInterval(updateClock, 60_000);
        }, msToNextMinute);

        return () => {
            clearTimeout(timeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [is24Hour]);

    /* ---------------- TOGGLE FORMAT ---------------- */

    const toggleFormat = () => {
        const next = !is24Hour;
        setIs24Hour(next);
        localStorage.setItem("clockFormat", next ? "24" : "12");
    };

    /* ---------------- UI ---------------- */

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={toggleFormat}
            onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && toggleFormat()
            }
            title="Toggle time format"
            className={`
                clock-widget
                ${pulse ? "clock-pulse" : ""}
                ${compact ? "clock-compact" : "clock-normal"}
            `}
        >
            <span className="clock-time">{time}</span>
        </div>
    );
}
