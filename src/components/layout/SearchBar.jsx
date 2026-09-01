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
  const engineBtnRef = useRef(null);

  const { engineKey, setEngineKey, engine, allEngines } =
    useSearchEngine("duckduckgo");

  const activeEngineMeta = useMemo(() => {
    return ENGINE_ICONS[engineKey] || { Icon: FiSearch, color: "#ffffff" };
  }, [engineKey]);

  const { Icon, color } = activeEngineMeta;

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        engineBtnRef.current &&
        !engineBtnRef.current.contains(event.target)
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
      {/* Search Input Container & Dropdown Wrapper */}
      <div className="relative flex w-full max-w-3xl flex-col items-center">
        {/* Floating Transparent Glass Search Box */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.015)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
          }}
          className={`
            flex w-full items-center gap-3.5
            rounded-full border border-white/10 px-4 py-2.5
            backdrop-blur-md transition-all duration-300
            focus-within:border-white/25 focus-within:bg-white/3s-within:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
            ${shake ? "animate-shake" : ""}
          `}
        >
          {/* Engine Switcher Button */}
          <button
            ref={engineBtnRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            title={engine?.name || "Search Engine"}
            className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/5 bg-white/4 px-3.5 text-xs font-semibold text-text-primary backdrop-blur-sm transition hover:border-white/15 hover:bg-white/8 cursor-pointer"
          >
            <Icon className="text-base" style={{ color }} />
            <FiChevronDown
              className="text-text-muted transition-transform duration-200"
              size={13}
              style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          <FiSearch className="text-base text-text-muted shrink-0 opacity-70" />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") run();
              if (e.key === "Escape") setMenuOpen(false);
            }}
            placeholder="Search the web, YouTube, Docs, or commands…"
            className="flex-1 min-w-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/60 md:text-base font-normal"
          />
        </div>

        {/* Engine Selector Dropdown - Positioned Absolutely Below Main Container */}
        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              backgroundColor: "rgba(15, 20, 32, 0.75)",
              boxShadow:
                "0 12px 40px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-80 w-80 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 p-2 backdrop-blur-2xl transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {allEngines.map((item) => {
              const meta = ENGINE_ICONS[item.key] || {
                Icon: FiSearch,
                color: "#ffffff",
              };

              const isSelected = engineKey === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setEngineKey(item.key);
                    setMenuOpen(false);
                  }}
                  className={`
                    flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition cursor-pointer border
                    ${isSelected
                      ? "border-white/15 bg-white/10 text-text-primary shadow-sm"
                      : "border-transparent text-text-secondary hover:border-white/5 hover:bg-white/4 hover:text-text-primary"
                    }
                  `}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5"
                    style={{
                      borderColor: isSelected ? `${meta.color}40` : undefined,
                    }}
                  >
                    <meta.Icon
                      className="text-base"
                      style={{ color: meta.color }}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold leading-tight truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-text-muted/80 leading-tight truncate">
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
            className="rounded-full border border-white/5 bg-white/1.5 px-3.5 py-1 text-xs font-medium text-text-muted backdrop-blur-sm transition hover:border-white/15 hover:bg-white/6 hover:text-text-primary cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Toggle Advanced Search */}
      <button
        onClick={() => setShowDorks((prev) => !prev)}
        className="text-xs font-medium text-text-muted/80 transition hover:text-text-primary cursor-pointer mt-1"
      >
        {showDorks ? "Hide Advanced Search ▲" : "Advanced Search ▼"}
      </button>

      {/* Advanced Search Dorks Accordion */}
      {showDorks && (
        <div
          style={{
            backgroundColor: "rgba(15, 20, 32, 0.45)",
            boxShadow:
              "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
          }}
          className="flex w-full max-w-3xl flex-col gap-4 max-h-96 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 p-4 text-left backdrop-blur-xl transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {DORK_CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-2">
              <h3 className="text-xs font-semibold text-text-secondary/90 tracking-wide uppercase text-[10px]">
                {category.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {category.items.map((dork) => (
                  <button
                    key={dork.label}
                    onClick={() => insertDork(dork.value)}
                    className="rounded-xl border border-white/5 bg-white/2 px-3 py-1.5 text-xs text-text-secondary transition hover:border-white/15 hover:bg-white/[0.07] hover:text-text-primary cursor-pointer text-left truncate backdrop-blur-sm"
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