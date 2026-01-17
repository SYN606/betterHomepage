import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import {
  SiGoogle,
  SiDuckduckgo,
  SiBrave,
  SiWikipedia,
  SiYoutube
} from "react-icons/si";

import useSearchEngine from "./useSearchEngine";
import { SEARCH_ENGINES, ENGINE_KEYS } from "./searchEngines";
import { DORKS } from "./dorks";
import { analyzeInput } from "./searchBrain";

/* --------------------------------
   ENGINE ICONS (brand colors)
--------------------------------- */

const ENGINE_ICONS = {
  google: { Icon: SiGoogle, color: "#4285F4" },
  duckduckgo: { Icon: SiDuckduckgo, color: "#DE5833" },
  brave: { Icon: SiBrave, color: "#FB542B" },
  bing: { Icon: FiSearch, color: "#008373" },
  wikipedia: { Icon: SiWikipedia, color: "#FFFFFF" },
  youtube: { Icon: SiYoutube, color: "#FF0000" }
};

/* --------------------------------
   SEARCH BAR
--------------------------------- */

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const { engineKey, setEngineKey, engine, cycleEngine } =
    useSearchEngine("duckduckgo");

  const { Icon, color } = ENGINE_ICONS[engineKey];

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* Keyboard shortcuts */
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "ArrowUp") {
      e.preventDefault();
      cycleEngine("up");
    }
    if (e.ctrlKey && e.key === "ArrowDown") {
      e.preventDefault();
      cycleEngine("down");
    }
    if (e.key === "Escape") setMenuOpen(false);
    if (e.key === "Enter") run();
  };

  /* Execute search */
  const run = () => {
    const result = analyzeInput(query, engineKey);

    if (!result) {
      setShake(true);
      setTimeout(() => setShake(false), 200);
      return;
    }

    if (result.url) {
      window.open(result.url, "_blank", "noopener");
    }

    if (result.urls) {
      result.urls.forEach((u) =>
        window.open(u, "_blank", "noopener")
      );
    }

    setQuery("");
    setMenuOpen(false);
  };

  /* Insert dork */
  const insertDork = (value) => {
    const el = inputRef.current;
    if (!el) return;

    const pos = el.selectionStart;
    const insert = value === "\"\"" ? '""' : value;

    setQuery(q => q.slice(0, pos) + insert + q.slice(pos));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos + insert.length, pos + insert.length);
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 mt-6">

      {/* SEARCH BAR */}
      <div
        className={`
          relative flex items-center gap-4
          w-[85%] max-w-4xl
          px-5 py-3
          rounded-full
          bg-black/40
          backdrop-blur-md
          border border-white/15
          ${shake ? "animate-shake" : ""}
          focus-within:border-white/30
        `}
      >
        {/* Engine selector */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          title={engine.name}
          className="
            w-9 h-9
            rounded-full
            flex items-center justify-center
            bg-white/10 hover:bg-white/20
            transition
          "
        >
          <Icon style={{ color }} className="text-xl" />
        </button>

        <FiSearch className="text-white/50 text-lg" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search, paste target, or drop a CVE"
          className="
            w-full bg-transparent outline-none
            text-white text-lg
            placeholder-white/40
          "
        />

        {/* ENGINE MENU */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="
              absolute left-1/2 top-16 -translate-x-1/2
              w-64
              bg-neutral-900
              border border-white/15
              rounded-xl
              shadow-2xl
              overflow-hidden
              z-30
            "
          >
            {ENGINE_KEYS.map((k) => {
              const e = SEARCH_ENGINES[k];
              const icon = ENGINE_ICONS[k];

              return (
                <button
                  key={k}
                  onClick={() => {
                    setEngineKey(k);
                    setMenuOpen(false);
                  }}
                  className={`
                    w-full px-4 py-3
                    flex items-center gap-3
                    text-sm
                    transition
                    ${engineKey === k
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10"}
                  `}
                >
                  <icon.Icon
                    className="text-lg"
                    style={{ color: icon.color }}
                  />
                  <span className="flex-1 text-left">
                    {e.name}
                  </span>
                  {engineKey === k && (
                    <span className="text-xs text-white/40">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* DORKS */}
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {DORKS.map(d => (
          <button
            key={d.label}
            onClick={() => insertDork(d.value)}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 transition"
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
