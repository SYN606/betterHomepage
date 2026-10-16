import { createEffect, createSignal, onMount } from "solid-js";
import { SEARCH_ENGINES, ENGINE_KEYS } from "../utils/searchEngines";

// Precomputed static array of all engines to avoid recreating arrays on every render
const ALL_ENGINES = ENGINE_KEYS.map((key) => ({
  key,
  ...SEARCH_ENGINES[key],
}));

export default function useSearchEngine(defaultKey = "duckduckgo") {
  const getSafeDefault = () => {
    if (SEARCH_ENGINES[defaultKey]) return defaultKey;
    return "duckduckgo";
  };

  const [engineKey, setEngineKey] = createSignal(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("searchEngineKey") &&
      SEARCH_ENGINES[localStorage.getItem("searchEngineKey")]
      ? localStorage.getItem("searchEngineKey")
      : getSafeDefault()
  );

  // Initialize from LocalStorage
  onMount(() => {
    try {
      const savedEngine = localStorage.getItem("searchEngineKey");
      if (savedEngine && SEARCH_ENGINES[savedEngine]) {
        setEngineKey(savedEngine);
      }
    } catch {
      setEngineKey(getSafeDefault());
    }
  });

  // Persist engine selection
  createEffect(() => {
    const key = engineKey();
    try {
      localStorage.setItem("searchEngineKey", key);
    } catch {
      // Storage access safety
    }
  });

  return {
    engineKey,
    setEngineKey,
    engine: () => SEARCH_ENGINES[engineKey()] || SEARCH_ENGINES["duckduckgo"],
    allEngines: () => ALL_ENGINES,
  };
}