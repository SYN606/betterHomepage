import { useState, useEffect } from "react";

export default function PinnedShortcuts() {
    const [shortcuts, setShortcuts] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [current, setCurrent] = useState({ index: null, name: "", url: "", icon: "" });

    /* Load */
    useEffect(() => {
        const saved = localStorage.getItem("pinnedShortcuts");
        if (saved) setShortcuts(JSON.parse(saved));
    }, []);

    const saveShortcuts = (data) => {
        setShortcuts(data);
        localStorage.setItem("pinnedShortcuts", JSON.stringify(data));
    };

    const normalizeUrl = (input) => {
        const value = input.trim();
        if (/^[a-zA-Z]+:\/\//.test(value)) return value;
        if (value.startsWith("localhost") || /^\d{1,3}(\.\d{1,3}){3}/.test(value)) {
            return `http://${value}`;
        }
        return `https://${value}`;
    };

    const getFavicon = (url) => {
        try {
            const u = new URL(url);
            return `${u.origin}/favicon.ico`;
        } catch {
            return null;
        }
    };

    const openEditor = (index = null) => {
        if (index !== null) {
            setCurrent({ index, ...shortcuts[index] });
        } else {
            setCurrent({ index: null, name: "", url: "", icon: "" });
        }
        setShowEditor(true);
    };

    const handleSave = () => {
        if (!current.name.trim() || !current.url.trim()) return;

        const url = normalizeUrl(current.url);
        const icon = getFavicon(url);

        let updated = [...shortcuts];

        if (current.index !== null) {
            updated[current.index] = { ...current, url, icon };
        } else {
            if (shortcuts.length >= 8) return;
            updated.push({ name: current.name, url, icon });
        }

        saveShortcuts(updated);
        setShowEditor(false);
    };

    const deleteShortcut = (index) => {
        saveShortcuts(shortcuts.filter((_, i) => i !== index));
        setShowEditor(false);
    };

    return (
        <>
            {/* SIDEBAR */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                <div
                    className="
            w-16 min-h-[300px]
            rounded-2xl
            border border-white/8
            bg-black/25
            backdrop-blur-xl
            flex flex-col items-center gap-3 py-4
          "
                >
                    {shortcuts.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => window.open(s.url, "_blank", "noopener")}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                openEditor(i);
                            }}
                            className="
                w-11 h-11 rounded-lg
                bg-white/5
                hover:bg-white/10
                transition
                flex items-center justify-center
                overflow-hidden
              "
                            title="Right-click to edit"
                        >
                            {s.icon ? (
                                <img
                                    src={s.icon}
                                    className="w-6 h-6 object-contain opacity-90"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            ) : (
                                <span className="text-[10px] text-white/80">{s.name}</span>
                            )}
                        </button>
                    ))}

                    {shortcuts.length < 8 && (
                        <button
                            onClick={() => openEditor(null)}
                            className="
                w-11 h-11 rounded-lg
                bg-white/5
                text-white/50
                text-lg
                flex items-center justify-center
                hover:bg-white/10
                transition
              "
                            title="Add shortcut"
                        >
                            +
                        </button>
                    )}
                </div>
            </div>

            {/* EDITOR MODAL */}
            {showEditor && (
                <div
                    className="
            fixed inset-0 z-50
            bg-black/40 backdrop-blur-sm
            flex items-center justify-center p-4
          "
                >
                    <div
                        className="
              bg-black/75
              border border-white/10
              rounded-2xl
              p-6 w-[90%] max-w-md
              text-white
              animate-scaleIn
            "
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {current.index !== null ? "Edit Shortcut" : "Add Shortcut"}
                        </h2>

                        <input
                            placeholder="Name"
                            value={current.name}
                            onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                            className="
                w-full px-4 py-2.5 rounded-lg
                bg-white/5 border border-white/10
                outline-none mb-3
                text-sm
              "
                        />

                        <input
                            placeholder="Website"
                            value={current.url}
                            onChange={(e) => setCurrent({ ...current, url: e.target.value })}
                            className="
                w-full px-4 py-2.5 rounded-lg
                bg-white/5 border border-white/10
                outline-none mb-5
                text-sm
              "
                        />

                        <div className="flex justify-between items-center">
                            {current.index !== null && (
                                <button
                                    onClick={() => deleteShortcut(current.index)}
                                    className="text-red-400 text-sm hover:text-red-300"
                                >
                                    Delete
                                </button>
                            )}

                            <div className="flex gap-3 ml-auto">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="text-white/50 text-sm hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition text-sm">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
