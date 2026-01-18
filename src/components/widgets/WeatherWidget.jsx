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
import "../../css/weatherWidget.css";

export default function WeatherWidget({ compact = false }) {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [glow, setGlow] = useState(false);

    /* ---------------- ICON MAP ---------------- */

    const iconSize = compact ? 26 : 36;

    const iconMap = {
        0: WiDaySunny,
        1: WiDaySunny,
        2: WiDayCloudy,
        3: WiCloudy,
        45: WiFog,
        48: WiFog,
        51: WiRain,
        61: WiRain,
        63: WiRain,
        65: WiRain,
        71: WiSnow,
        80: WiRain,
        95: WiStormShowers,
        99: WiStormShowers,
    };

    const Icon =
        weather && iconMap[weather.code]
            ? iconMap[weather.code]
            : WiCloudy;

    /* ---------------- HELPERS ---------------- */

    const formatName = (name) =>
        name
            .toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    /* ---------------- INITIAL LOCATION ---------------- */

    useEffect(() => {
        const saved = localStorage.getItem("weatherLocation");
        if (saved) {
            setLocation(saved);
            fetchCoordinates(saved);
        } else {
            fetchFromIP();
        }
    }, []);

    /* ---------------- GEO ---------------- */

    const fetchFromIP = async () => {
        try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            if (!data.city) return;

            const city = formatName(data.city);
            localStorage.setItem("weatherLocation", city);
            setLocation(city);
            fetchCoordinates(city);
        } catch {
            /* silent fail */
        }
    };

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
        } catch { }
    };

    /* ---------------- WEATHER ---------------- */

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
                wind: Math.round(data.current_weather.windspeed),
                windDir: Math.round(data.current_weather.winddirection),
                code: data.current_weather.weathercode,
            });

            setGlow(true);
            setTimeout(() => setGlow(false), 1000);
        } catch { }
    };

    useEffect(() => {
        if (!coords) return;
        fetchWeather();
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [coords]);

    /* ---------------- SAVE LOCATION ---------------- */

    const saveLocation = async () => {
        if (!location?.trim()) return;

        const normalized = formatName(location);
        localStorage.setItem("weatherLocation", normalized);
        setLocation(normalized);

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

    return (
        <>
            {/* WEATHER CARD */}
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowEditor(true);
                }}
                className={`
          relative
          flex items-center gap-3
          px-3 py-2
          rounded-xl
          backdrop-blur-xl
          bg-white/6
          border border-white/12
          text-white
          cursor-pointer
          transition-all
          hover:bg-white/12
          ${glow ? "weather-glow" : ""}
        `}
            >
                <Icon size={iconSize} className="opacity-90" />

                <div className="flex flex-col leading-tight">
                    <span className="text-base font-medium">
                        {weather ? `${weather.temp}°C` : "—"}
                    </span>

                    {!compact && (
                        <span className="text-[11px] text-white/60 tracking-wide">
                            {location || "Detecting location"}
                        </span>
                    )}
                </div>

                {/* HOVER PANEL */}
                {hovered && weather && (
                    <div
                        className="
              absolute bottom-full right-0 mb-2
              w-44
              rounded-xl
              bg-black/90 backdrop-blur-xl
              border border-white/10
              text-white/85
              shadow-xl
              z-30
              animate-fadeIn
            "
                    >
                        <div className="px-3 pt-2 pb-1 text-xs font-medium text-white">
                            Weather
                        </div>

                        <div className="px-3 pb-2 space-y-1 text-[11px]">
                            <div className="flex justify-between">
                                <span className="text-white/60">Temp</span>
                                <span>{weather.temp}°C</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/60">Wind</span>
                                <span>{weather.wind} km/h</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-white/60">Direction</span>
                                <span>{weather.windDir}°</span>
                            </div>

                            <div className="pt-1 text-white/40 text-[10px]">
                                {location}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {showEditor &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                        onClick={() => setShowEditor(false)}
                    >
                        <div
                            className="
                bg-[#0B0B0B]/90
                border border-white/10
                rounded-2xl
                p-6 w-80
                text-white
                shadow-[0_0_40px_rgba(0,0,0,0.6)]
              "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-base font-semibold mb-4">
                                Set Weather Location
                            </h2>

                            <input
                                autoFocus
                                value={location || ""}
                                onChange={(e) => setLocation(e.target.value)}
                                className="
                  w-full px-4 py-2 mb-4
                  rounded-lg
                  bg-white/10 border border-white/20
                  outline-none
                "
                                placeholder="Enter city"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveLocation}
                                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30"
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
