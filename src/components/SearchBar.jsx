import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

/* ---------------- SEARCH ENGINES ---------------- */

const SEARCH_ENGINES = {
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

/* ---------------- DORKING OPTIONS ---------------- */

const DORKS = [
    { label: "site:", value: "site:" },
    { label: "intitle:", value: "intitle:" },
    { label: "filetype:", value: "filetype:" },
    { label: "\"exact\"", value: "\"\"" },
    { label: "-exclude", value: "-" }
];

/* ---------------- URL DETECTION ---------------- */

const isLikelyUrl = (input) => {
    const value = input.trim().toLowerCase();
    if (!value || value.includes(" ")) return false;

    if (/^(https?|ftp|file):\/\//.test(value)) return true;

    if (
        value.startsWith("localhost") ||
        /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(value)
    ) {
        return true;
    }

    if (/^[a-z0-9-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/.test(value)) {
        return true;
    }

    return false;
};

/* ---------------- COMPONENT ---------------- */

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [engineKey, setEngineKey] = useState("google");
    const [open, setOpen] = useState(false);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    /* Load saved engine */
    useEffect(() => {
        const saved = localStorage.getItem("searchEngineKey");
        if (saved && SEARCH_ENGINES[saved]) setEngineKey(saved);
    }, []);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* Search / open URL */
    const search = () => {
        const input = query.trim();
        if (!input) return;

        let targetUrl;

        if (isLikelyUrl(input)) {
            targetUrl = input.match(/^[a-z]+:\/\//)
                ? input
                : `https://${input}`;
        } else {
            targetUrl =
                SEARCH_ENGINES[engineKey].url + encodeURIComponent(input);
        }

        window.open(targetUrl, "_blank", "noopener,noreferrer");
        setQuery("");
        setOpen(false);
    };

    /* Insert dork */
    const insertDork = (value) => {
        let newValue = query;
        newValue += value === "\"\"" ? ' ""' : ` ${value}`;
        setQuery(newValue.trim());
        inputRef.current?.focus();
    };

    const currentEngine = SEARCH_ENGINES[engineKey];
    const favicon = `https://www.google.com/s2/favicons?domain=${currentEngine.domain}&sz=64`;

    return (
        <div className="w-full flex flex-col items-center mt-6 gap-3">

            {/* SEARCH BAR */}
            <div className="
        relative flex items-center
        w-[85%] max-w-4xl
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        rounded-full
        px-4 py-3
        gap-3
      ">
                {/* Engine selector */}
                <button
                    onClick={() => setOpen(!open)}
                    className="
            w-10 h-10
            rounded-full
            bg-white/10
            hover:bg-white/20
            flex items-center justify-center
          "
                    title={`Search with ${currentEngine.name}`}
                >
                    <img src={favicon} alt={currentEngine.name} className="w-5 h-5" />
                </button>

                <FiSearch className="text-white/60 text-xl" />

                <input
                    ref={inputRef}
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder={`Search ${currentEngine.name}...`}
                    className="w-full bg-transparent text-white text-lg outline-none"
                />

                {/* Dropdown */}
                {open && (
                    <div
                        ref={dropdownRef}
                        className="
              absolute left-4 top-14
              flex flex-wrap gap-2
              bg-white/10
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              p-2
              z-20
            "
                    >
                        {Object.entries(SEARCH_ENGINES).map(([key, engine]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setEngineKey(key);
                                    localStorage.setItem("searchEngineKey", key);
                                    setOpen(false);
                                }}
                                className="
                  w-10 h-10
                  rounded-xl
                  hover:bg-white/20
                  flex items-center justify-center
                "
                                title={engine.name}
                            >
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${engine.domain}&sz=64`}
                                    alt={engine.name}
                                    className="w-5 h-5"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* DORKING CHIPS */}
            <div className="flex flex-wrap gap-2 justify-center text-sm">
                {DORKS.map((dork) => (
                    <button
                        key={dork.label}
                        onClick={() => insertDork(dork.value)}
                        className="
              px-3 py-1.5
              rounded-full
              bg-white/5
              border border-white/10
              hover:bg-white/15
              text-white/80
            "
                    >
                        {dork.label}
                    </button>
                ))}
            </div>

        </div>
    );
}
