import { useState, useEffect, useCallback } from "react";
import { SEARCH_ENGINES, ENGINE_KEYS } from "./searchEngines";

export default function useSearchEngine(defaultKey = "google") {
    const [engineKey, setEngineKey] = useState(defaultKey);

    /* Load saved engine */
    useEffect(() => {
        const saved = localStorage.getItem("searchEngineKey");
        if (saved && SEARCH_ENGINES[saved]) {
            setEngineKey(saved);
        }
    }, []);

    /* Persist engine */
    useEffect(() => {
        localStorage.setItem("searchEngineKey", engineKey);
    }, [engineKey]);

    /* Cycle engines (Ctrl + ↑ / ↓) */
    const cycleEngine = useCallback((direction) => {
        const idx = ENGINE_KEYS.indexOf(engineKey);
        if (idx === -1) return;

        const next =
            direction === "up"
                ? (idx - 1 + ENGINE_KEYS.length) % ENGINE_KEYS.length
                : (idx + 1) % ENGINE_KEYS.length;

        setEngineKey(ENGINE_KEYS[next]);
    }, [engineKey]);

    return {
        engineKey,
        setEngineKey,
        engine: SEARCH_ENGINES[engineKey],
        cycleEngine
    };
}
