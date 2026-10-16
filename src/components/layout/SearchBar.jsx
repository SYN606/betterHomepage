import { createMemo, createSignal, onCleanup, onMount, Show, For } from "solid-js";
import {
  BingIcon,
  BraveIcon,
  ChevronDownIcon,
  DuckduckgoIcon,
  GeminiIcon,
  GithubIcon,
  GoogleIcon,
  MapsIcon,
  PerplexityIcon,
  RedditIcon,
  SearchIcon,
  StackoverflowIcon,
  WikipediaIcon,
  YoutubeIcon,
} from "../common/Icons";

import {
  useSearchEngine,
  DORK_CATEGORIES,
  analyzeInput,
} from "../../features";

const ENGINE_ICONS = {
  google: { Icon: GoogleIcon, color: "#4285F4" },
  duckduckgo: { Icon: DuckduckgoIcon, color: "#DE5833" },
  brave: { Icon: BraveIcon, color: "#FB542B" },
  bing: { Icon: BingIcon, color: "#008373" },
  wikipedia: { Icon: WikipediaIcon, color: "#FFFFFF" },
  youtube: { Icon: YoutubeIcon, color: "#FF0000" },
  github: { Icon: GithubIcon, color: "#FFFFFF" },
  reddit: { Icon: RedditIcon, color: "#FF4500" },
  stackoverflow: { Icon: StackoverflowIcon, color: "#F48024" },
  maps: { Icon: MapsIcon, color: "#34A853" },
  gemini: { Icon: GeminiIcon, color: "#8E44AD" },
  perplexity: { Icon: PerplexityIcon, color: "#22B8CF" },
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
  const [query, setQuery] = createSignal("");
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [showDorks, setShowDorks] = createSignal(false);
  const [shake, setShake] = createSignal(false);

  let inputRef;
  let menuRef;
  let engineBtnRef;

  const { engineKey, setEngineKey, engine, allEngines } =
    useSearchEngine("duckduckgo");

  const activeEngineMeta = createMemo(() => {
    return ENGINE_ICONS[engineKey()] || { Icon: SearchIcon, color: "#ffffff" };
  });

  onMount(() => {
    // Autofocus input on load for instant keyboard usability
    inputRef?.focus();

    const handleOutsideClick = (event) => {
      if (
        menuOpen() &&
        menuRef &&
        !menuRef.contains(event.target) &&
        engineBtnRef &&
        !engineBtnRef.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleOutsideClick);
    });
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 250);
  };

  const run = (manualQuery) => {
    const rawQuery = typeof manualQuery === "string" ? manualQuery : query();
    const finalQuery = rawQuery.trim();

    if (!finalQuery) {
      triggerShake();
      return;
    }

    const result = analyzeInput(finalQuery, engineKey());

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
    if (!inputRef) return;

    const position = inputRef.selectionStart || 0;
    const insert = value === '""' ? '""' : value;
    const currentQuery = query();

    const next =
      currentQuery.slice(0, position) + insert + currentQuery.slice(position);
    setQuery(next);

    requestAnimationFrame(() => {
      inputRef.focus();
      inputRef.setSelectionRange(
        position + insert.length,
        position + insert.length
      );
    });
  };

  return (
    <section class="mt-4 flex w-full flex-col items-center gap-4 px-4">
      {/* Search Input Container & Dropdown Wrapper */}
      <div class="relative flex w-full max-w-3xl flex-col items-center">
        {/* Floating Transparent Glass Search Box */}
        <div
          style={{
            "background-color": "rgba(255, 255, 255, 0.015)",
            "box-shadow": "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
          }}
          class={`
            flex w-full items-center gap-3.5
            rounded-full border border-white/10 px-4 py-2.5
            backdrop-blur-md transition-all duration-300
            focus-within:border-white/25 focus-within:bg-white/3 focus-within:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
            ${shake() ? "animate-shake" : ""}
          `}
        >
          {/* Engine Switcher Button */}
          <button
            ref={engineBtnRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            title={engine()?.name || "Search Engine"}
            class="flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/5 bg-white/4 px-3.5 text-xs font-semibold text-text-primary backdrop-blur-sm transition hover:border-white/15 hover:bg-white/8 cursor-pointer"
          >
            {(() => {
              const meta = activeEngineMeta();
              const CurrentIcon = meta.Icon;
              return <CurrentIcon class="w-4 h-4" style={{ color: meta.color }} />;
            })()}
            <ChevronDownIcon
              class="w-3.5 h-3.5 text-text-muted transition-transform duration-200"
              style={{
                transform: menuOpen() ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          <SearchIcon class="w-4 h-4 text-text-muted shrink-0 opacity-70" />

          <input
            ref={inputRef}
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") run();
              if (e.key === "Escape") setMenuOpen(false);
            }}
            placeholder="Search the web, YouTube, Docs, or commands…"
            class="flex-1 min-w-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/60 md:text-base font-normal"
          />
        </div>

        {/* Engine Selector Dropdown - Positioned Absolutely Below Main Container */}
        <Show when={menuOpen()}>
          <div
            ref={menuRef}
            style={{
              "background-color": "rgba(15, 20, 32, 0.75)",
              "box-shadow":
                "0 12px 40px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
            class="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-80 w-80 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 p-2 backdrop-blur-2xl transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <For each={allEngines()}>
              {(item) => {
                const meta = ENGINE_ICONS[item.key] || {
                  Icon: SearchIcon,
                  color: "#ffffff",
                };
                const ItemIcon = meta.Icon;
                const isSelected = () => engineKey() === item.key;

                return (
                  <button
                    onClick={() => {
                      setEngineKey(item.key);
                      setMenuOpen(false);
                    }}
                    class={`
                      flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition cursor-pointer border
                      ${
                        isSelected()
                          ? "border-white/15 bg-white/10 text-text-primary shadow-sm"
                          : "border-transparent text-text-secondary hover:border-white/5 hover:bg-white/4 hover:text-text-primary"
                      }
                    `}
                  >
                    <div
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5"
                      style={{
                        "border-color": isSelected()
                          ? `${meta.color}40`
                          : undefined,
                      }}
                    >
                      <ItemIcon
                        class="w-4 h-4"
                        style={{ color: meta.color }}
                      />
                    </div>

                    <div class="flex flex-col min-w-0">
                      <span class="text-xs font-semibold leading-tight truncate">
                        {item.name}
                      </span>
                      <span class="text-[10px] text-text-muted/80 leading-tight truncate">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </Show>
      </div>

      {/* Quick Commands Chips */}
      <div class="flex flex-wrap justify-center gap-2">
        <For each={QUICK_COMMANDS}>
          {(item) => (
            <button
              onClick={() => run(item)}
              class="rounded-full border border-white/5 bg-white/1.5 px-3.5 py-1 text-xs font-medium text-text-muted backdrop-blur-sm transition hover:border-white/15 hover:bg-white/6 hover:text-text-primary cursor-pointer"
            >
              {item}
            </button>
          )}
        </For>
      </div>

      {/* Toggle Advanced Search */}
      <button
        onClick={() => setShowDorks((prev) => !prev)}
        class="text-xs font-medium text-text-muted/80 transition hover:text-text-primary cursor-pointer mt-1"
      >
        {showDorks() ? "Hide Advanced Search ▲" : "Advanced Search ▼"}
      </button>

      {/* Advanced Search Dorks Accordion */}
      <Show when={showDorks()}>
        <div
          style={{
            "background-color": "rgba(15, 20, 32, 0.45)",
            "box-shadow":
              "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
          }}
          class="flex w-full max-w-3xl flex-col gap-4 max-h-96 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 p-4 text-left backdrop-blur-xl transition-all [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <For each={DORK_CATEGORIES}>
            {(category) => (
              <div class="space-y-2">
                <h3 class="font-semibold text-text-secondary/90 tracking-wide uppercase text-[10px]">
                  {category.title}
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <For each={category.items}>
                    {(dork) => (
                      <button
                        onClick={() => insertDork(dork.value)}
                        class="rounded-xl border border-white/5 bg-white/2 px-3 py-1.5 text-xs text-text-secondary transition hover:border-white/15 hover:bg-white/[0.07] hover:text-text-primary cursor-pointer text-left truncate backdrop-blur-sm"
                      >
                        {dork.label}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </section>
  );
}