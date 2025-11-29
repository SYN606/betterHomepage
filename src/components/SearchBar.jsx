import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

const SEARCH_ENGINES = {
    google: { name: "Google", url: "https://www.google.com/search?q=" },
    duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
    bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
    brave: { name: "Brave", url: "https://search.brave.com/search?q=" },
    youtube: { name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
};

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [engineKey, setEngineKey] = useState("google");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("searchEngineKey");
        if (saved && SEARCH_ENGINES[saved]) setEngineKey(saved);
    }, []);

    const search = () => {
        if (!query.trim()) return;
        const url = SEARCH_ENGINES[engineKey].url + encodeURIComponent(query);
        window.open(url, "_blank");
    };

    const changeEngine = (key) => {
        setEngineKey(key);
        localStorage.setItem("searchEngineKey", key);
        setOpen(false);
    };

    return (
        <div className="w-full flex flex-col items-center gap-3 mt-6">

            {/* SEARCH BAR */}
            <div
                className="
                    flex items-center
                    w-[85%] max-w-4xl
                    bg-white/5
                    border border-white/10
                    backdrop-blur-xl
                    rounded-full
                    px-6 py-2.5
                    shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]
                    hover:bg-white/10
                    transition-all
                    gap-4
                "
            >
                <FiSearch className="text-white/60 text-xl" />

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder="Search..."
                    className="w-full bg-transparent text-white text-lg outline-none placeholder-white/40"
                />

                <button
                    onClick={search}
                    className="
                        px-4 py-1.5
                        rounded-full
                        text-white
                        border border-white/20
                        bg-white/10
                        hover:bg-white/20
                        backdrop-blur-xl
                        transition-all
                        shadow-md
                    "
                >
                    Go
                </button>
            </div>

            {/* CUSTOM DROPDOWN */}
            <div className="relative w-[85%] max-w-4xl flex justify-start">

                {/* Trigger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="
                        w-48
                        bg-white/10 
                        border border-white/10
                        text-white 
                        rounded-2xl 
                        px-4 py-2 
                        backdrop-blur-xl
                        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                        hover:bg-white/20
                        transition
                        flex items-center justify-between
                    "
                >
                    {SEARCH_ENGINES[engineKey].name}
                    <FiChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu */}
                {open && (
                    <div
                        className="
                            absolute left-0 top-14
                            w-48
                            bg-white/10
                            backdrop-blur-xl
                            border border-white/10
                            rounded-2xl
                            shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                            text-white
                            overflow-hidden
                            animate-scaleIn
                            z-20
                        "
                    >
                        {Object.entries(SEARCH_ENGINES).map(([key, engine]) => (
                            <button
                                key={key}
                                onClick={() => changeEngine(key)}
                                className="
                                    w-full text-left px-4 py-2
                                    hover:bg-white/20
                                    transition
                                "
                            >
                                {engine.name}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
