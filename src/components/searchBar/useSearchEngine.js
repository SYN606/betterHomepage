import { useEffect, useMemo, useState } from "react";
import {
    SEARCH_ENGINES,
    ENGINE_KEYS,
    FAVORITE_ENGINES,
    ENGINE_CATEGORIES,
} from "./searchEngines";

export default function useSearchEngine(defaultKey = "google") {
    const getSafeDefault = () => {
        if (SEARCH_ENGINES[defaultKey]) return defaultKey;
        return "google";
    };

    const [engineKey, setEngineKey] = useState(getSafeDefault());
    const [recentEngines, setRecentEngines] = useState([]);

    useEffect(() => {
        try {
            const savedEngine = localStorage.getItem("searchEngineKey");
            const savedRecent = localStorage.getItem("recentSearchEngines");

            if (savedEngine && SEARCH_ENGINES[savedEngine]) {
                setEngineKey(savedEngine);
            }

            if (savedRecent) {
                const parsed = JSON.parse(savedRecent);
                if (Array.isArray(parsed)) {
                    setRecentEngines(
                        parsed.filter((key) => SEARCH_ENGINES[key])
                    );
                }
            }
        } catch {
            setEngineKey(getSafeDefault());
            setRecentEngines([]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("searchEngineKey", engineKey);

            const updatedRecent = [
                engineKey,
                ...recentEngines.filter((key) => key !== engineKey),
            ].slice(0, 5);

            setRecentEngines(updatedRecent);

            localStorage.setItem(
                "recentSearchEngines",
                JSON.stringify(updatedRecent)
            );
        } catch {
            // silent fallback for extension safety
        }
    }, [engineKey]);

    const resetToDefault = () => {
        setEngineKey(getSafeDefault());
    };

    const favoriteEngines = useMemo(() => {
        return FAVORITE_ENGINES.map((key) => ({
            key,
            ...SEARCH_ENGINES[key],
        }));
    }, []);

    const allEngines = useMemo(() => {
        return ENGINE_KEYS.map((key) => ({
            key,
            ...SEARCH_ENGINES[key],
        }));
    }, []);

    const categorizedEngines = useMemo(() => {
        return ENGINE_CATEGORIES.map((category) => ({
            category,
            engines: ENGINE_KEYS.filter(
                (key) => SEARCH_ENGINES[key].category === category
            ).map((key) => ({
                key,
                ...SEARCH_ENGINES[key],
            })),
        })).filter((group) => group.engines.length > 0);
    }, []);

    return {
        engineKey,
        setEngineKey,
        engine: SEARCH_ENGINES[engineKey],

        allEngines,
        favoriteEngines,
        categorizedEngines,
        recentEngines,

        resetToDefault,
    };
}
