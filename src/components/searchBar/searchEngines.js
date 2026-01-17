export const SEARCH_ENGINES = {
    google: {
        name: "Google",
        url: "https://www.google.com/search?q=",
        domain: "google.com"
    },
    duckduckgo: {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=",
        domain: "duckduckgo.com"
    },
    brave: {
        name: "Brave",
        url: "https://search.brave.com/search?q=",
        domain: "brave.com"
    },
    bing: {
        name: "Bing",
        url: "https://www.bing.com/search?q=",
        domain: "bing.com"
    },
    wikipedia: {
        name: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Special:Search?search=",
        domain: "wikipedia.org"
    },
    youtube: {
        name: "YouTube",
        url: "https://www.youtube.com/results?search_query=",
        domain: "youtube.com"
    }
};

export const ENGINE_KEYS = Object.keys(SEARCH_ENGINES);
