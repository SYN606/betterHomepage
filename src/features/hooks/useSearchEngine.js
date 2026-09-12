import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import {
  SEARCH_ENGINES,
  ENGINE_KEYS,
  FAVORITE_ENGINES,
  ENGINE_CATEGORIES,
} from "../utils/searchEngines";

export default function useSearchEngine(defaultKey = "google") {
  const getSafeDefault = () => {
    if (SEARCH_ENGINES[defaultKey]) return defaultKey;
    return "google";
  };

  const [engineKey, setEngineKey] = createSignal(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("searchEngineKey") &&
      SEARCH_ENGINES[localStorage.getItem("searchEngineKey")]
      ? localStorage.getItem("searchEngineKey")
      : getSafeDefault()
  );
  const [recentEngines, setRecentEngines] = createSignal([]);

  // Initialize from LocalStorage
  onMount(() => {
    try {
      const savedEngine = localStorage.getItem("searchEngineKey");
      const savedRecent = localStorage.getItem("recentSearchEngines");

      if (savedEngine && SEARCH_ENGINES[savedEngine]) {
        setEngineKey(savedEngine);
      }

      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed)) {
          setRecentEngines(parsed.filter((key) => SEARCH_ENGINES[key]));
        }
      }
    } catch {
      setEngineKey(getSafeDefault());
      setRecentEngines([]);
    }
  });

  // Update Storage & Track Recent Engines on Selection Change
  createEffect(() => {
    const key = engineKey();
    try {
      localStorage.setItem("searchEngineKey", key);

      setRecentEngines((prev) => {
        const updatedRecent = [
          key,
          ...prev.filter((k) => k !== key),
        ].slice(0, 5);

        localStorage.setItem(
          "recentSearchEngines",
          JSON.stringify(updatedRecent)
        );

        return updatedRecent;
      });
    } catch {
      // Silent fallback for extension safety
    }
  });

  const resetToDefault = () => {
    setEngineKey(getSafeDefault());
  };

  const favoriteEngines = createMemo(() => {
    return (FAVORITE_ENGINES || []).map((key) => ({
      key,
      ...SEARCH_ENGINES[key],
    }));
  });

  const allEngines = createMemo(() => {
    return ENGINE_KEYS.map((key) => ({
      key,
      ...SEARCH_ENGINES[key],
    }));
  });

  const categorizedEngines = createMemo(() => {
    return (ENGINE_CATEGORIES || [])
      .map((category) => ({
        category,
        engines: ENGINE_KEYS.filter(
          (key) => SEARCH_ENGINES[key]?.category === category
        ).map((key) => ({
          key,
          ...SEARCH_ENGINES[key],
        })),
      }))
      .filter((group) => group.engines.length > 0);
  });

  return {
    engineKey,
    setEngineKey,
    engine: () => SEARCH_ENGINES[engineKey()] || SEARCH_ENGINES["google"],

    allEngines,
    favoriteEngines,
    categorizedEngines,
    recentEngines,

    resetToDefault,
  };
}