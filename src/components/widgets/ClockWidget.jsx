import { useState, useEffect, useRef } from "react";
import "../../css/clockWidget.css";

export default function ClockWidget({ compact = false }) {
    const [time, setTime] = useState("");
    const [is24Hour, setIs24Hour] = useState(true);
    const [pulse, setPulse] = useState(false);

    const lastMinuteRef = useRef(null);

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

            let hours = now.getHours();
            let suffix = "";

            if (minute !== lastMinuteRef.current) {
                lastMinuteRef.current = minute;
                setPulse(true);
                setTimeout(() => setPulse(false), 650);
            }

            if (!is24Hour) {
                suffix = hours >= 12 ? " PM" : " AM";
                hours = hours % 12 || 12;
            }

            const formatted =
                `${hours.toString().padStart(2, "0")}:` +
                `${minute.toString().padStart(2, "0")}${suffix}`;

            setTime(formatted);
        };

        updateClock();

        const now = new Date();
        const delay = (60 - now.getSeconds()) * 1000;

        const timeout = setTimeout(() => {
            updateClock();
            const interval = setInterval(updateClock, 60_000);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
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
            onClick={toggleFormat}
            title="Toggle 12h / 24h format"
            className={`
        clock-widget
        ${pulse ? "clock-pulse" : ""}
        ${compact ? "clock-compact" : "clock-normal"}
      `}
        >
            <span className="clock-time">{time}</span>

            <span className="clock-format">
                {is24Hour ? "24H" : "12H"}
            </span>
        </div>
    );
}
