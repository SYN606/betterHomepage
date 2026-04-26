import { useEffect, useRef, useState } from "react";
import {
    FiChevronUp,
    FiCloud,
    FiGrid,
} from "react-icons/fi";
import { WeatherWidget } from "./widgets";

const DEFAULT_WIDGETS = {
    weather: true,
};

export default function WidgetButtons() {
    const [showPanel, setShowPanel] = useState(true);
    const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
    const [pulse, setPulse] = useState(false);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem("widgetVisibility");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setWidgets({
                    weather: parsed.weather ?? true,
                });
            } catch {
                setWidgets(DEFAULT_WIDGETS);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("widgetVisibility", JSON.stringify(widgets));
    }, [widgets]);

    useEffect(() => {
        const triggerPulse = () => {
            setPulse(true);

            setTimeout(() => {
                setPulse(false);
            }, 900);
        };

        const now = new Date();
        const delay = (60 - now.getSeconds()) * 1000;

        timeoutRef.current = setTimeout(() => {
            triggerPulse();
            intervalRef.current = setInterval(triggerPulse, 60000);
        }, delay);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const toggleWidget = () => {
        setWidgets((prev) => ({
            ...prev,
            weather: !prev.weather,
        }));
    };

    return (
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-3">
            {showPanel && (
                <div className="w-[220px] rounded-3xl border border-white/10 bg-black/45 p-4 text-white shadow-2xl backdrop-blur-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                                Widget Hub
                            </p>
                            <h3 className="text-sm font-medium text-white/90">
                                Quick Controls
                            </h3>
                        </div>

                        <button
                            onClick={() => setShowPanel(false)}
                            className="rounded-xl bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                            title="Collapse"
                        >
                            <FiChevronUp size={16} />
                        </button>
                    </div>

                    {widgets.weather ? (
                        <div className="space-y-3">
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                                <WeatherWidget compact />
                            </div>

                            <div
                                className={`h-px w-full transition-all duration-500 ${pulse ? "bg-white/30" : "bg-white/10"
                                    }`}
                            />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center text-sm text-white/60">
                            No widgets enabled
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-2">
                        <button
                            onClick={toggleWidget}
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition ${widgets.weather
                                    ? "bg-white/15 text-white"
                                    : "bg-white/5 text-white/60"
                                } hover:bg-white/20`}
                            title="Toggle Weather"
                        >
                            <FiCloud size={15} />
                            Weather
                        </button>
                    </div>
                </div>
            )}

            {!showPanel && (
                <button
                    onClick={() => setShowPanel(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/45 text-white shadow-xl backdrop-blur-xl transition hover:scale-105 hover:bg-black/55"
                    title="Open Widget Hub"
                >
                    <FiGrid size={20} />
                </button>
            )}
        </div>
    );
}
