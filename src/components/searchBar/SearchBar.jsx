import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import {
  SiGoogle,
  SiDuckduckgo,
  SiBrave,
  SiWikipedia,
  SiYoutube,
  SiGithub,
  SiReddit,
  SiStackoverflow,
} from "react-icons/si";

import useSearchEngine from "./useSearchEngine";
import { DORK_CATEGORIES } from "./dorks";
import { analyzeInput } from "./searchBrain";

const ENGINE_ICONS = {
  google: { Icon: SiGoogle, color: "#4285F4" },
  duckduckgo: { Icon: SiDuckduckgo, color: "#DE5833" },
  brave: { Icon: SiBrave, color: "#FB542B" },
  bing: { Icon: FiSearch, color: "#008373" },
  wikipedia: { Icon: SiWikipedia, color: "#FFFFFF" },
  youtube: { Icon: SiYoutube, color: "#FF0000" },
  github: { Icon: SiGithub, color: "#FFFFFF" },
  reddit: { Icon: SiReddit, color: "#FF4500" },
  stackoverflow: { Icon: SiStackoverflow, color: "#F48024" },
  maps: { Icon: FiSearch, color: "#34A853" },
  gemini: { Icon: FiSearch, color: "#8E44AD" },
};

const QUICK_COMMANDS = [
  "yt react tutorial",
  "wiki linux",
  "map delhi",
  "gh react",
  "calc 22*7",
  "gm inbox",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDorks, setShowDorks] = useState(false);
  const [shake, setShake] = useState(false);


  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const {
    engineKey,
    setEngineKey,
    engine,
    allEngines,
  } = useSearchEngine("duckduckgo");

  const activeEngineMeta = useMemo(() => {
    return ENGINE_ICONS[engineKey] || { Icon: FiSearch, color: "#ffffff" };
  }, [engineKey]);

  const { Icon, color } = activeEngineMeta;



  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);



  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 250);
  };

  const run = (manualQuery = query) => {
    const finalQuery = manualQuery.trim();

    if (!finalQuery) {
      triggerShake();
      return;
    }

    const result = analyzeInput(finalQuery, engineKey);

    if (!result) {
      triggerShake();
      return;
    }

    if (result.url) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }

    if (result.urls) {
      result.urls.forEach((url) => {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    setQuery("");
    setMenuOpen(false);
  };

  const insertDork = (value) => {
    const el = inputRef.current;
    if (!el) return;

    const position = el.selectionStart || 0;
    const insert = value === '""' ? '""' : value;

    setQuery((prev) =>
      prev.slice(0, position) + insert + prev.slice(position)
    );

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        position + insert.length,
        position + insert.length
      );
    });
  };

  return (
    <section className="mt-6 flex w-full flex-col items-center gap-5 px-4">
      <div
        className={`
          relative flex w-full max-w-5xl items-center gap-4
          rounded-full border border-white/15
          bg-black/35 px-5 py-3
          backdrop-blur-2xl
          shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          transition-all duration-300
          focus-within:border-white/30
          focus-within:bg-black/45
          ${shake ? "animate-shake" : ""}
        `}
      >
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          title={engine.name}
          className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 transition hover:bg-white/15"
        >
          <Icon className="text-lg" style={{ color }} />
          <FiChevronDown className="text-white/60" size={14} />
        </button>

        <FiSearch className="text-lg text-white/50" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
            if (e.key === "Escape") setMenuOpen(false);
          }}
          placeholder="Search the web, YouTube, Docs, or anything…"
          className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/40 md:text-lg"
        />

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute left-1/2 top-16 z-30 max-h-[420px] w-[340px] -translate-x-1/2 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/15 bg-black/75 shadow-2xl backdrop-blur-2xl"
          >
            {allEngines.map((item) => {
              const meta = ENGINE_ICONS[item.key] || {
                Icon: FiSearch,
                color: "#ffffff",
              };

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setEngineKey(item.key);
                    setMenuOpen(false);
                  }}
                  className={`
                    flex w-full items-center gap-3 px-4 py-3 text-left transition
                    ${engineKey === item.key
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10"
                    }
                  `}
                >
                  <meta.Icon
                    className="text-lg"
                    style={{ color: meta.color }}
                  />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-white/45">
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>



      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_COMMANDS.map((item) => (
          <button
            key={item}
            onClick={() => setQuery(item)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/12"
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowDorks((prev) => !prev)}
        className="text-sm text-white/60 transition hover:text-white"
      >
        {showDorks ? "Hide Advanced Search ▲" : "Advanced Search ▼"}
      </button>

      {showDorks && (
        <div className="flex w-full max-w-5xl flex-col gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-2xl max-h-[420px] overflow-y-auto overflow-x-hidden">
          {DORK_CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">
                {category.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {category.items.map((dork) => (
                  <button
                    key={dork.label}
                    onClick={() => insertDork(dork.value)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/15"
                  >
                    {dork.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
