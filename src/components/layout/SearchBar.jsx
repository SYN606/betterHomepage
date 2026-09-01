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

// Barrel import for all feature dependencies
import {
  useSearchEngine,
  DORK_CATEGORIES,
  analyzeInput,
} from "../../features";

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

  const { engineKey, setEngineKey, engine, allEngines } =
    useSearchEngine("duckduckgo");

  const activeEngineMeta = useMemo(() => {
    return ENGINE_ICONS[engineKey] || { Icon: FiSearch, color: "#ffffff" };
  }, [engineKey]);

  const { Icon, color } = activeEngineMeta;

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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

    setQuery(
      (prev) => prev.slice(0, position) + insert + prev.slice(position)
    );

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(position + insert.length, position + insert.length);
    });
  };

  return (
    <section className="mt-4 flex w-full flex-col items-center gap-4 px-4">
      {/* Floating Glass Search Box */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderColor: "var(--glass-border)",
          backdropFilter: "var(--glass-blur)",
          boxShadow: "var(--shadow-glass)",
        }}
        className={`
          relative flex w-full max-w-3xl items-center gap-3.5
          rounded-full border-[0.5px] px-4 py-2.5
          transition-all duration-300
          focus-within:border-white/30 focus-within:bg-white/5
          ${shake ? "animate-shake" : ""}
        `}
      >
        {/* Engine Switcher Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          title={engine?.name || "Search Engine"}
          className="flex h-9 items-center gap-2 rounded-full border-[0.5px] border-transparent bg-white/5 px-3.5 text-xs font-semibold text-text-primary transition hover:border-white/20 hover:bg-white/10 cursor-pointer"
        >
          <Icon className="text-base" style={{ color }} />
          <FiChevronDown className="text-text-muted" size={13} />
        </button>

        <FiSearch className="text-base text-text-muted" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
            if (e.key === "Escape") setMenuOpen(false);
          }}
          placeholder="Search the web, YouTube, Docs, or commands…"
          className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted md:text-base font-normal"
        />

        {/* Engine Selector Dropdown */}
        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              backgroundColor: "rgba(10, 14, 22, 0.75)",
              borderColor: "var(--glass-border)",
              backdropFilter: "var(--glass-blur)",
              boxShadow: "var(--shadow-glass)",
            }}
            className="absolute left-1/2 top-14 z-40 max-h-96 w-80 -translate-x-1/2 overflow-y-auto overflow-x-hidden rounded-3xl border-[0.5px] p-2 backdrop-blur-2xl transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                    flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition cursor-pointer
                    ${engineKey === item.key
                      ? "bg-white/10 text-text-primary"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                    }
                  `}
                >
                  <meta.Icon
                    className="text-base"
                    style={{ color: meta.color }}
                  />

                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="text-[10px] text-text-muted">
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Commands Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_COMMANDS.map((item) => (
          <button
            key={item}
            onClick={() => run(item)}
            style={{
              borderColor: "var(--glass-border)",
            }}
            className="rounded-full border-[0.5px] bg-white/2 py-1 text-xs font-medium text-text-muted transition hover:border-white/20 hover:bg-white/10 hover:text-text-primary cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Toggle Advanced Search */}
      <button
        onClick={() => setShowDorks((prev) => !prev)}
        className="text-xs font-medium text-text-muted transition hover:text-text-primary cursor-pointer"
      >
        {showDorks ? "Hide Advanced Search ▲" : "Advanced Search ▼"}
      </button>

      {/* Advanced Search Dorks Accordion */}
      {showDorks && (
        <div
          style={{
            backgroundColor: "rgba(10, 14, 22, 0.5)",
            borderColor: "var(--glass-border)",
            backdropFilter: "var(--glass-blur)",
          }}
          className="flex w-full max-w-3xl flex-col gap-4 max-h-96 overflow-y-auto overflow-x-hidden rounded-3xl border-[0.5px] p-4 text-left transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {DORK_CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-2">
              <h3 className="text-xs font-semibold text-text-secondary">
                {category.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {category.items.map((dork) => (
                  <button
                    key={dork.label}
                    onClick={() => insertDork(dork.value)}
                    style={{
                      borderColor: "var(--glass-border)",
                    }}
                    className="rounded-xl border-[0.5px] bg-white/3 px-3 py-1.5 text-xs text-text-secondary transition hover:border-white/20 hover:bg-white/10 hover:text-text-primary cursor-pointer text-left truncate"
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