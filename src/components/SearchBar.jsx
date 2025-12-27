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

const ENGINE_KEYS = Object.keys(SEARCH_ENGINES);

/* ---------------- DORKS (CURATED) ---------------- */

const DORKS = [
    { label: "site:", value: "site:" },
    { label: "intitle:", value: "intitle:" },
    { label: "inurl:", value: "inurl:" },
    { label: "filetype:", value: "filetype:" },
    { label: "ext:", value: "ext:" },
    { label: "\"exact\"", value: "\"\"" },
    { label: "-exclude", value: "-" },
    { label: "define:", value: "define:" },
    { label: "after:", value: "after:" },
    { label: "before:", value: "before:" }
];

/* ---------------- URL DETECTION ---------------- */

const isLikelyUrl = (input) => {
    const v = input.trim().toLowerCase();
    if (!v || v.includes(" ")) return false;
    if (/^(https?|ftp):\/\//.test(v)) return true;
    if (v.startsWith("localhost")) return true;
    return /^[a-z0-9-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/.test(v);
};

/* ---------------- COMPONENT ---------------- */

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [engineKey, setEngineKey] = useState("google");
    const [open, setOpen] = useState(false);
    const [shake, setShake] = useState(false);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    /* Load saved engine */
    useEffect(() => {
        const saved = localStorage.getItem("searchEngineKey");
        if (saved && SEARCH_ENGINES[saved]) {
            setEngineKey(saved);
        }
    }, []);

    /* Outside click — only when dropdown is open */
    useEffect(() => {
        if (!open) return;

        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    /* Keyboard shortcuts */
    const handleKey = (e) => {
        if (e.ctrlKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            e.preventDefault();
            const idx = ENGINE_KEYS.indexOf(engineKey);
            const next =
                e.key === "ArrowUp"
                    ? (idx - 1 + ENGINE_KEYS.length) % ENGINE_KEYS.length
                    : (idx + 1) % ENGINE_KEYS.length;

            setEngineKey(ENGINE_KEYS[next]);
            localStorage.setItem("searchEngineKey", ENGINE_KEYS[next]);
        }

        if (e.key === "Escape") setOpen(false);
        if (e.key === "Enter") search();
    };

    /* Search / open URL */
    const search = () => {
        const q = query.trim();
        if (!q) {
            setShake(true);
            setTimeout(() => setShake(false), 300);
            return;
        }

        const url = isLikelyUrl(q)
            ? q.match(/^[a-z]+:\/\//) ? q : `https://${q}`
            : SEARCH_ENGINES[engineKey].url + encodeURIComponent(q);

        window.open(url, "_blank", "noopener,noreferrer");
        setQuery("");
        setOpen(false);
    };

    /* Insert dork at cursor */
    const insertDork = (value) => {
        const el = inputRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const insert = value === "\"\"" ? '""' : value;

        const updated =
            query.slice(0, start) + insert + query.slice(end);

        setQuery(updated);

        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(
                start + insert.length,
                start + insert.length
            );
        });
    };

    const engine = SEARCH_ENGINES[engineKey];
    const favicon = `https://www.google.com/s2/favicons?domain=${engine.domain}&sz=64`;

    return (
        <div className="w-full flex flex-col items-center gap-3 mt-6">

            {/* SEARCH BAR */}
            <div
                className={`
                    relative flex items-center gap-3
                    w-[85%] max-w-4xl
                    px-5 py-3
                    rounded-full
                    backdrop-blur-xl
                    bg-white/5
                    border border-white/10
                    transition
                    ${shake ? "animate-shake" : ""}
                    focus-within:border-white/30
                    focus-within:bg-white/10
                `}
            >
                {/* Engine selector */}
                <button
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    title={`Search with ${engine.name}`}
                    className="
                        w-10 h-10
                        rounded-full
                        bg-white/10
                        hover:bg-white/20
                        flex items-center justify-center
                    "
                >
                    <img src={favicon} alt={engine.name} className="w-5 h-5" />
                </button>

                <FiSearch className="text-white/50 text-xl" />

                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Search ${engine.name} or paste a URL`}
                    aria-label="Search"
                    className="
                        w-full
                        bg-transparent
                        outline-none
                        text-white text-lg
                        placeholder-white/40
                    "
                />

                {/* ENGINE DROPDOWN */}
                {open && (
                    <div
                        ref={dropdownRef}
                        className="
                            absolute left-1/2 top-16
                            -translate-x-1/2
                            grid grid-cols-3 gap-3
                            p-4
                            bg-black/70
                            backdrop-blur-2xl
                            border border-white/10
                            rounded-3xl
                            shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                            z-30
                        "
                    >
                        {ENGINE_KEYS.map((key) => {
                            const e = SEARCH_ENGINES[key];
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setEngineKey(key);
                                        localStorage.setItem("searchEngineKey", key);
                                        setOpen(false);
                                    }}
                                    className={`
                                        flex flex-col items-center gap-1
                                        px-3 py-2 rounded-xl
                                        transition
                                        ${engineKey === key
                                            ? "bg-white/20"
                                            : "hover:bg-white/10"}
                                    `}
                                >
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${e.domain}&sz=64`}
                                        alt={e.name}
                                        className="w-6 h-6"
                                    />
                                    <span className="text-xs text-white/80">
                                        {e.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* DORK CHIPS */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
                {DORKS.map((d) => (
                    <button
                        key={d.label}
                        onClick={() => insertDork(d.value)}
                        className="
                            px-3 py-1.5
                            rounded-full
                            bg-white/5
                            border border-white/10
                            hover:bg-white/15
                            text-white/80
                        "
                    >
                        {d.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
