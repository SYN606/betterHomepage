import { useState, useEffect } from "react";
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

    // -------------------------
    // Weather icon mapper
    // -------------------------
    const iconMap = {
        0: <WiDaySunny size={compact ? 22 : 32} />,
        1: <WiDaySunny size={compact ? 22 : 32} />,
        2: <WiDayCloudy size={compact ? 22 : 32} />,
        3: <WiCloudy size={compact ? 22 : 32} />,
        45: <WiFog size={compact ? 22 : 32} />,
        48: <WiFog size={compact ? 22 : 32} />,
        51: <WiRain size={compact ? 22 : 32} />,
        61: <WiRain size={compact ? 22 : 32} />,
        63: <WiRain size={compact ? 22 : 32} />,
        65: <WiRain size={compact ? 22 : 32} />,
        71: <WiSnow size={compact ? 22 : 32} />,
        80: <WiRain size={compact ? 22 : 32} />,
        95: <WiStormShowers size={compact ? 22 : 32} />,
        99: <WiStormShowers size={compact ? 22 : 32} />,
    };

    // Capitalize city name for display
    const formatName = (name) =>
        name
            .toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    // Load saved location
    useEffect(() => {
        const saved = localStorage.getItem("weatherLocation");
        if (saved) setLocation(saved);
    }, []);

    // Get coordinates from text
    const fetchCoordinates = async (city) => {
        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    city.toLowerCase()
                )}&count=1`
            );

            const data = await res.json();
            if (!data.results || data.results.length === 0) return;

            const { latitude, longitude } = data.results[0];
            setCoords({ latitude, longitude });
        } catch (error) {
            console.log("Geocoding error:", error);
        }
    };

    // Fetch weather using coordinates
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
        } catch (error) {
            console.log("Weather error:", error);
        }
    };

    // When city changes → get coords
    useEffect(() => {
        fetchCoordinates(location);
    }, [location]);

    // When coords change → get weather
    useEffect(() => {
        fetchWeather();
    }, [coords]);

    const saveLocation = () => {
        if (!location.trim()) return;

        const normalized = formatName(location);
        setLocation(normalized);

        localStorage.setItem("weatherLocation", normalized);
        setShowEditor(false);
    };

    // Box design
    const boxCls = `
        flex items-center gap-3
        text-white select-none
        rounded-2xl backdrop-blur-xl bg-white/10
        border border-white/15
        shadow-[0_0_20px_rgba(0,0,0,0.25)]
        transition cursor-pointer
        hover:bg-white/20
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
                        {iconMap[weather.code] || <WiCloudy size={compact ? 22 : 32} />}
                        <span>{weather.temp}°C</span>
                        {!compact && (
                            <span className="text-white/70">{formatName(location)}</span>
                        )}
                    </>
                )}
            </div>

            {showEditor && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]"
                >
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
                absolute
                top-1/2 left-1/2                 /* REAL CENTER */
                -translate-x-1/2 -translate-y-1/2
            "
                    >
                        <h2 className="text-xl font-semibold mb-4">Set City</h2>

                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="
                    w-full px-4 py-2
                    rounded-xl
                    bg-white/10 border border-white/20
                    outline-none
                    mb-4 text-white
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
                </div>
            )}
        </>
    );
}
