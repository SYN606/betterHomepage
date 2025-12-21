import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    WiDaySunny,
    WiDayCloudy,
    WiCloudy,
    WiFog,
    WiRain,
    WiSnow,
    WiStormShowers,
} from "react-icons/wi";

export default function WeatherWidget({ compact = false }) {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState("New Delhi");
    const [coords, setCoords] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

    /* ---------------- ICON MAP ---------------- */

    const iconSize = compact ? 22 : 32;

    const iconMap = {
        0: <WiDaySunny size={iconSize} />,
        1: <WiDaySunny size={iconSize} />,
        2: <WiDayCloudy size={iconSize} />,
        3: <WiCloudy size={iconSize} />,
        45: <WiFog size={iconSize} />,
        48: <WiFog size={iconSize} />,
        51: <WiRain size={iconSize} />,
        61: <WiRain size={iconSize} />,
        63: <WiRain size={iconSize} />,
        65: <WiRain size={iconSize} />,
        71: <WiSnow size={iconSize} />,
        80: <WiRain size={iconSize} />,
        95: <WiStormShowers size={iconSize} />,
        99: <WiStormShowers size={iconSize} />,
    };

    /* ---------------- HELPERS ---------------- */

    const formatName = (name) =>
        name
            .toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    /* ---------------- LOAD SAVED LOCATION ---------------- */

    useEffect(() => {
        const saved = localStorage.getItem("weatherLocation");
        if (saved) {
            setLocation(saved);
            fetchCoordinates(saved);
        }
    }, []);

    /* ---------------- API CALLS ---------------- */

    const fetchCoordinates = async (city) => {
        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    city
                )}&count=1`
            );

            const data = await res.json();
            if (!data.results?.length) return;

            const { latitude, longitude } = data.results[0];
            setCoords({ latitude, longitude });
        } catch (err) {
            console.error("Geocoding error:", err);
        }
    };

    const fetchWeather = async () => {
        if (!coords) return;

        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
            );

            const data = await res.json();
            if (!data.current_weather) return;

            setWeather({
                temp: Math.round(data.current_weather.temperature),
                code: data.current_weather.weathercode,
            });
        } catch (err) {
            console.error("Weather error:", err);
        }
    };

    /* ---------------- AUTO REFRESH WEATHER ---------------- */

    useEffect(() => {
        if (!coords) return;

        fetchWeather();
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [coords]);

    /* ---------------- SAVE LOCATION ---------------- */

    const saveLocation = async () => {
        if (!location.trim()) return;

        const normalized = formatName(location);
        setLocation(normalized);
        localStorage.setItem("weatherLocation", normalized);

        await fetchCoordinates(normalized);
        setShowEditor(false);
    };

    /* ---------------- ESC CLOSE ---------------- */

    useEffect(() => {
        const esc = (e) => e.key === "Escape" && setShowEditor(false);
        document.addEventListener("keydown", esc);
        return () => document.removeEventListener("keydown", esc);
    }, []);

    /* ---------------- UI ---------------- */

    const boxCls = `
    flex items-center gap-3
    text-white select-none
    rounded-2xl backdrop-blur-xl bg-white/10
    border border-white/15
    shadow-[0_0_20px_rgba(0,0,0,0.25)]
    transition cursor-pointer hover:bg-white/20
    ${compact ? "px-4 py-2 text-base" : "px-5 py-3 text-lg"}
  `;

    return (
        <>
            {/* WEATHER DISPLAY */}
            <div
                className={boxCls}
                onClick={() => setShowEditor(true)}
                title="Click to change city"
            >
                {!weather ? (
                    "Loading..."
                ) : (
                    <>
                        {iconMap[weather.code] || <WiCloudy size={iconSize} />}
                        <span>{weather.temp}°C</span>
                        {!compact && (
                            <span className="text-white/70">
                                {formatName(location)}
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* MODAL (PORTAL) */}
            {showEditor &&
                createPortal(
                    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-md">
                        <div
                            className="
                bg-[#0B0B0B]/85
                backdrop-blur-2xl
                border border-white/10
                rounded-3xl
                p-6 w-80
                text-white
                shadow-[0_0_40px_rgba(0,0,0,0.6)]
                animate-fadeIn
              "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-semibold mb-4">Set City</h2>

                            <input
                                autoFocus
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="
                  w-full px-4 py-2 mb-4
                  rounded-xl
                  bg-white/10 border border-white/20
                  outline-none text-white
                "
                                placeholder="Enter city"
                            />

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveLocation}
                                    className="
                    px-4 py-2 rounded-xl
                    bg-white/20 hover:bg-white/30
                    transition
                  "
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById("modal-root")
                )}
        </>
    );
}
