// Config & Definitions
export { DORK_CATEGORIES } from "./config/dorks";

// Search Logic & Intelligence
export { analyzeInput } from "./config/searchBrain";

// Input & Parsing Utilities
export {
  COMMAND_PREFIXES,
  isCommandInput,
  isLikelyUrl,
  normalizeUrl,
} from "./utils/inputUtils";

export {
  SEARCH_ENGINES,
  ENGINE_KEYS,
} from "./utils/searchEngines";

// Theme State
export {
  activeTheme,
  setActiveTheme,
  backgroundUrl,
  setBackgroundUrl,
  fetchRandomWallpaper,
} from "./utils/themeState";

// Custom Hooks
export { default as useSearchEngine } from "./hooks/useSearchEngine";