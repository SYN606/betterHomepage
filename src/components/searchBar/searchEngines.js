export const SEARCH_ENGINES = {
    google: {
        name: "Google",
        description: "Fast general web search",
        url: "https://www.google.com/search?q=",
        domain: "google.com",
        category: "web",
        color: "#4285F4",
        icon: "google",
        favorite: true,
    },

    duckduckgo: {
        name: "DuckDuckGo",
        description: "Privacy-first search engine",
        url: "https://duckduckgo.com/?q=",
        domain: "duckduckgo.com",
        category: "privacy",
        color: "#DE5833",
        icon: "duckduckgo",
        favorite: true,
    },

    brave: {
        name: "Brave",
        description: "Independent private search",
        url: "https://search.brave.com/search?q=",
        domain: "search.brave.com",
        category: "privacy",
        color: "#FB542B",
        icon: "brave",
        favorite: false,
    },

    bing: {
        name: "Bing",
        description: "Microsoft web search",
        url: "https://www.bing.com/search?q=",
        domain: "bing.com",
        category: "web",
        color: "#008373",
        icon: "bing",
        favorite: false,
    },

    wikipedia: {
        name: "Wikipedia",
        description: "Knowledge and reference search",
        url: "https://en.wikipedia.org/wiki/Special:Search?search=",
        domain: "wikipedia.org",
        category: "knowledge",
        color: "#FFFFFF",
        icon: "wikipedia",
        favorite: true,
    },

    youtube: {
        name: "YouTube",
        description: "Video search and discovery",
        url: "https://www.youtube.com/results?search_query=",
        domain: "youtube.com",
        category: "video",
        color: "#FF0000",
        icon: "youtube",
        favorite: true,
    },

    github: {
        name: "GitHub",
        description: "Code, repositories, and developers",
        url: "https://github.com/search?q=",
        domain: "github.com",
        category: "developer",
        color: "#FFFFFF",
        icon: "github",
        favorite: true,
    },

    reddit: {
        name: "Reddit",
        description: "Community discussions and answers",
        url: "https://www.reddit.com/search/?q=",
        domain: "reddit.com",
        category: "community",
        color: "#FF4500",
        icon: "reddit",
        favorite: false,
    },

    stackoverflow: {
        name: "Stack Overflow",
        description: "Developer questions and solutions",
        url: "https://stackoverflow.com/search?q=",
        domain: "stackoverflow.com",
        category: "developer",
        color: "#F48024",
        icon: "stackoverflow",
        favorite: false,
    },

    maps: {
        name: "Google Maps",
        description: "Places, routes, and navigation",
        url: "https://www.google.com/maps/search/",
        domain: "maps.google.com",
        category: "navigation",
        color: "#34A853",
        icon: "maps",
        favorite: false,
    },

    gemini: {
        name: "Gemini",
        description: "Ask AI and explore answers",
        url: "https://gemini.google.com/app",
        domain: "gemini.google.com",
        category: "ai",
        color: "#8E44AD",
        icon: "gemini",
        favorite: false,
    },
};

export const ENGINE_KEYS = Object.keys(SEARCH_ENGINES);

export const FAVORITE_ENGINES = ENGINE_KEYS.filter(
    (key) => SEARCH_ENGINES[key].favorite
);

export const ENGINE_CATEGORIES = [
    "web",
    "privacy",
    "knowledge",
    "video",
    "developer",
    "community",
    "navigation",
    "ai",
];
