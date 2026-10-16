import { createSignal, onMount, Show, For } from "solid-js";
import { EditIcon, PlusIcon, TrashIcon, XIcon } from "../common/Icons";
import { normalizeUrl } from "../../features";

function ShortcutIcon(props) {
  const [failed, setFailed] = createSignal(false);
  return (
    <Show
      when={props.icon && !failed()}
      fallback={
        <span class="text-[11px] font-semibold text-text-primary uppercase select-none">
          {props.name?.charAt(0) || "?"}
        </span>
      }
    >
      <img
        src={props.icon}
        alt={props.name}
        class="h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110"
        onError={() => setFailed(true)}
      />
    </Show>
  );
}

const MAX_SHORTCUTS = 8;

const DEFAULT_SHORTCUTS = [
  { name: "Google", url: "https://google.com" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Gmail", url: "https://mail.google.com" },
];

export default function PinnedShortcuts() {
  const [shortcuts, setShortcuts] = createSignal([]);
  const [showEditor, setShowEditor] = createSignal(false);
  const [error, setError] = createSignal("");
  const [current, setCurrent] = createSignal({
    index: null,
    name: "",
    url: "",
    icon: "",
  });

  function getFavicon(url) {
    try {
      const parsed = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch {
      return "";
    }
  }

  const saveShortcuts = (data) => {
    setShortcuts(data);
    localStorage.setItem("pinnedShortcuts", JSON.stringify(data));
  };

  onMount(() => {
    const saved = localStorage.getItem("pinnedShortcuts");

    if (saved) {
      try {
        setShortcuts(JSON.parse(saved));
        return;
      } catch {
        // Fallback to default
      }
    }

    const starter = DEFAULT_SHORTCUTS.map((item) => ({
      ...item,
      icon: getFavicon(item.url),
    }));

    saveShortcuts(starter);
  });



  const openEditor = (index = null) => {
    setError("");

    if (index !== null) {
      const item = shortcuts()[index];
      setCurrent({ index, ...item });
    } else {
      setCurrent({ index: null, name: "", url: "", icon: "" });
    }

    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setError("");
  };

  const handleSave = () => {
    const cur = current();
    if (!cur.name.trim() || !cur.url.trim()) {
      setError("Please fill both name and website fields.");
      return;
    }

    const url = normalizeUrl(cur.url);
    const icon = getFavicon(url);
    const currentList = shortcuts();

    const duplicate = currentList.some(
      (item, index) => item.url === url && cur.index !== index
    );

    if (duplicate) {
      setError("This shortcut already exists.");
      return;
    }

    let updated = [...currentList];

    if (cur.index !== null) {
      updated[cur.index] = {
        name: cur.name.trim(),
        url,
        icon,
      };
    } else {
      if (currentList.length >= MAX_SHORTCUTS) {
        setError(`Maximum ${MAX_SHORTCUTS} shortcuts allowed.`);
        return;
      }

      updated.push({
        name: cur.name.trim(),
        url,
        icon,
      });
    }

    saveShortcuts(updated);
    closeEditor();
  };

  const deleteShortcut = (index) => {
    const updated = shortcuts().filter((_, i) => i !== index);
    saveShortcuts(updated);
    closeEditor();
  };

  return (
    <>
      {/* Floating Transparent Dock Sidebar */}
      <div class="fixed left-5 top-1/2 z-20 -translate-y-1/2">
        <div
          style={{
            "background-color": "transparent",
            "border-color": "var(--glass-border)",
            "backdrop-filter": "var(--glass-blur)",
          }}
          class="flex flex-col items-center gap-2.5 rounded-full border-[0.5px] p-2 transition-all duration-300 hover:border-white/20"
        >
          <For each={shortcuts()}>
            {(shortcut, index) => (
              <div class="group relative">
                <button
                  onClick={() =>
                    window.open(shortcut.url, "_blank", "noopener,noreferrer")
                  }
                  style={{
                    "background-color": "rgba(255, 255, 255, 0.02)",
                    "border-color": "var(--glass-border)",
                  }}
                  class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-[0.5px] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/10 hover:border-white/30 cursor-pointer"
                  title={shortcut.name}
                >
                  <ShortcutIcon icon={shortcut.icon} name={shortcut.name} />
                </button>

                {/* Quick Edit Pin */}
                <button
                  onClick={() => openEditor(index())}
                  style={{
                    "background-color": "rgba(0, 0, 0, 0.6)",
                    "border-color": "var(--glass-border-hover)",
                  }}
                  class="absolute -right-1 -top-1 hidden h-4.5 w-4.5 items-center justify-center rounded-full border-[0.5px] text-text-primary backdrop-blur-md transition-transform duration-200 hover:scale-110 group-hover:flex cursor-pointer"
                  title="Edit shortcut"
                >
                  <EditIcon class="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </For>

          {/* Add Shortcut Action */}
          <Show when={shortcuts().length < MAX_SHORTCUTS}>
            <button
              onClick={() => openEditor()}
              style={{
                "border-color": "var(--glass-border)",
              }}
              class="flex h-11 w-11 items-center justify-center rounded-full border-[0.5px] border-dashed text-text-muted transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-white/30 hover:bg-white/5 hover:text-text-primary cursor-pointer"
              title="Add shortcut"
            >
              <PlusIcon class="w-4 h-4" />
            </button>
          </Show>
        </div>
      </div>

      {/* Glassmorphic Modal Editor */}
      <Show when={showEditor()}>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              "background-color": "rgba(10, 14, 22, 0.65)",
              "border-color": "var(--glass-border)",
              "backdrop-filter": "var(--glass-blur)",
            }}
            class="w-full max-w-sm rounded-3xl border-[0.5px] p-6 text-text-primary shadow-2xl backdrop-blur-2xl transition-all"
          >
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-base font-semibold tracking-tight text-text-primary">
                {current().index !== null ? "Edit Shortcut" : "Add Shortcut"}
              </h2>

              <button
                onClick={closeEditor}
                class="rounded-full p-1 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary cursor-pointer"
              >
                <XIcon class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-3">
              <input
                placeholder="Shortcut Name"
                value={current().name}
                onInput={(e) =>
                  setCurrent((prev) => ({ ...prev, name: e.currentTarget.value }))
                }
                style={{
                  "background-color": "rgba(255, 255, 255, 0.03)",
                  "border-color": "var(--glass-border)",
                }}
                class="w-full rounded-2xl border-[0.5px] px-4 py-2 text-xs text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-white/30"
              />

              <input
                placeholder="Website URL (e.g. github.com)"
                value={current().url}
                onInput={(e) =>
                  setCurrent((prev) => ({ ...prev, url: e.currentTarget.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") closeEditor();
                }}
                style={{
                  "background-color": "rgba(255, 255, 255, 0.03)",
                  "border-color": "var(--glass-border)",
                }}
                class="w-full rounded-2xl border-[0.5px] px-4 py-2 text-xs text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-white/30"
              />
            </div>

            <Show when={error()}>
              <p class="mt-3 text-xs font-medium text-danger">{error()}</p>
            </Show>

            <div class="mt-6 flex items-center justify-between">
              <Show
                when={current().index !== null}
                fallback={<div />}
              >
                <button
                  onClick={() => deleteShortcut(current().index)}
                  class="flex items-center gap-1.5 text-xs font-medium text-danger transition-colors hover:opacity-80 cursor-pointer"
                >
                  <TrashIcon class="w-3.5 h-3.5" />
                  Delete
                </button>
              </Show>

              <div class="flex items-center gap-2">
                <button
                  onClick={closeEditor}
                  class="rounded-xl px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  style={{
                    "background-color": "rgba(255, 255, 255, 0.08)",
                    "border-color": "var(--glass-border-hover)",
                  }}
                  class="rounded-xl border-[0.5px] px-4 py-1.5 text-xs font-semibold text-text-primary transition-all duration-200 hover:bg-white/15 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}