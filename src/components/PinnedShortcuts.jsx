import { useState, useEffect } from "react";

export default function PinnedShortcuts() {
    const [shortcuts, setShortcuts] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [current, setCurrent] = useState({ index: null, name: "", url: "", icon: "" });

    const getFavicon = (url) => {
        try {
            const u = new URL(url);
            return `${u.origin}/favicon.ico`;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem("pinnedShortcuts");
        if (saved) setShortcuts(JSON.parse(saved));
    }, []);

    const saveShortcuts = (data) => {
        setShortcuts(data);
        localStorage.setItem("pinnedShortcuts", JSON.stringify(data));
    };

    const openEditor = (index = null) => {
        if (index !== null) {
            setCurrent(shortcuts[index]);
            setCurrent({ index, name: shortcuts[index].name, url: shortcuts[index].url, icon: shortcuts[index].icon });
        } else {
            setCurrent({ index: null, name: "", url: "", icon: "" });
        }
        setShowEditor(true);
    };

    const handleSave = () => {
        if (!current.name.trim() || !current.url.trim()) return;
        const icon = getFavicon(current.url);
        let updated = [...shortcuts];

        if (current.index !== null) {
            updated[current.index] = { ...current, icon };
        } else {
            if (shortcuts.length >= 8) return;
            updated.push({ ...current, icon });
        }

        saveShortcuts(updated);
        setShowEditor(false);
    };

    const deleteShortcut = (index) => {
        const updated = shortcuts.filter((_, i) => i !== index);
        saveShortcuts(updated);
        setShowEditor(false);
    };

    return (
        <>
            {/* SIDEBAR */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
                <div
                    className="
                        w-20 min-h-[330px]
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        backdrop-blur-2xl
                        shadow-[0_0_25px_rgba(0,0,0,0.35)]
                        flex flex-col items-center gap-4
                        py-6
                    "
                >
                    {shortcuts.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => window.open(s.url, "_blank")}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                openEditor(i);
                            }}
                            className="
                                w-14 h-14 rounded-xl
                                bg-white/10
                                hover:bg-white/20
                                transition
                                flex items-center justify-center
                                overflow-hidden
                            "
                            title="Right-click to edit"
                        >
                            {s.icon ? (
                                <img
                                    src={s.icon}
                                    className="w-7 h-7 object-contain"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            ) : (
                                <span className="text-xs text-white">{s.name}</span>
                            )}
                        </button>
                    ))}

                    {shortcuts.length < 8 && (
                        <button
                            onClick={() => openEditor(null)}
                            className="
                                w-14 h-14 rounded-xl
                                bg-white/10 text-white text-xl
                                flex items-center justify-center
                                hover:bg-white/20 transition
                            "
                        >
                            +
                        </button>
                    )}
                </div>
            </div>

            {/* MODAL OUTSIDE SIDEBAR (fixes clipping) */}
            {showEditor && (
                <div
                    className="
                        fixed inset-0 z-9999
                        bg-black/50 backdrop-blur-md
                        flex items-center justify-center
                        p-4
                    "
                >
                    <div
                        className="
                            bg-black/70
                            border border-white/10
                            rounded-3xl
                            p-6 w-[90%] max-w-md
                            text-white
                            shadow-[0_0_35px_rgba(0,0,0,0.45)]
                            animate-scaleIn
                        "
                    >
                        <h2 className="text-2xl font-semibold mb-4">
                            {current.index !== null ? "Edit Shortcut" : "Add Shortcut"}
                        </h2>

                        <input
                            placeholder="Name"
                            value={current.name}
                            onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                            className="
                                w-full px-4 py-3 rounded-xl
                                bg-white/10 border border-white/20
                                outline-none mb-3
                            "
                        />

                        <input
                            placeholder="URL (https://...)"
                            value={current.url}
                            onChange={(e) => setCurrent({ ...current, url: e.target.value })}
                            className="
                                w-full px-4 py-3 rounded-xl
                                bg-white/10 border border-white/20
                                outline-none mb-5
                            "
                        />

                        <div className="flex justify-between items-center">
                            {current.index !== null && (
                                <button
                                    onClick={() => deleteShortcut(current.index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            )}

                            <div className="flex gap-4 ml-auto">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="
                                        px-5 py-2 rounded-xl
                                        bg-white/20 hover:bg-white/30
                                        transition
                                    "
                                >
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
