import { useState, useEffect } from "react";

export default function PinnedShortcuts() {
    const [shortcuts, setShortcuts] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [current, setCurrent] = useState({ index: null, name: "", url: "" });

    // Create favicon URL from site URL
    const getFavicon = (url) => {
        try {
            const u = new URL(url);
            return `${u.origin}/favicon.ico`; // e.g. https://github.com/favicon.ico
        } catch {
            return null;
        }
    };

    // Load shortcuts from storage
    useEffect(() => {
        const saved = localStorage.getItem("pinnedShortcuts");
        if (saved) setShortcuts(JSON.parse(saved));
    }, []);

    // Save to storage
    const saveShortcuts = (data) => {
        setShortcuts(data);
        localStorage.setItem("pinnedShortcuts", JSON.stringify(data));
    };

    // Open the editor
    const openEditor = (index = null) => {
        if (index !== null) {
            setCurrent({
                index,
                name: shortcuts[index].name,
                url: shortcuts[index].url,
            });
        } else {
            setCurrent({ index: null, name: "", url: "" });
        }
        setShowEditor(true);
    };

    // Save changes
    const handleSave = () => {
        if (!current.name.trim() || !current.url.trim()) return;

        const icon = getFavicon(current.url);
        let updated = [...shortcuts];

        if (current.index !== null) {
            // EDIT existing
            updated[current.index] = {
                name: current.name,
                url: current.url,
                icon,
            };
        } else {
            // ADD new
            if (shortcuts.length >= 8) return;
            updated.push({
                name: current.name,
                url: current.url,
                icon,
            });
        }

        saveShortcuts(updated);
        setShowEditor(false);
    };

    // Delete shortcut
    const deleteShortcut = (index) => {
        let updated = shortcuts.filter((_, i) => i !== index);
        saveShortcuts(updated);
    };

    return (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <div
                className="
                    w-20
                    min-h-[300px]
                    rounded-3xl
                    border border-white/20
                    backdrop-blur-xl
                    flex flex-col items-center justify-start
                    py-6 gap-4
                "
            >
                {/* Existing shortcuts */}
                {shortcuts.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => window.open(s.url, "_blank")}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            openEditor(i);
                        }}
                        className="
                            w-14 h-14
                            rounded-xl
                            bg-white/10
                            text-white
                            text-sm
                            flex items-center justify-center
                            hover:bg-white/20
                            transition
                            px-2 text-center
                            overflow-hidden
                        "
                        title="Right-click to edit"
                    >
                        {s.icon ? (
                            <img
                                src={s.icon}
                                className="w-7 h-7 object-contain"
                                onError={(e) => {
                                    // if favicon fails, hide image so button still looks clean
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            s.name
                        )}
                    </button>
                ))}

                {/* Add new shortcut */}
                {shortcuts.length < 8 && (
                    <button
                        onClick={() => openEditor(null)}
                        className="
                            w-14 h-14
                            rounded-xl
                            bg-white/10
                            text-white
                            text-xl
                            flex items-center justify-center
                            hover:bg-white/20
                            transition
                        "
                        title="Add Shortcut"
                    >
                        +
                    </button>
                )}
            </div>

            {/* Shortcut Editor Popup */}
            {showEditor && (
                <div
                    className="
                        fixed inset-y-0 left-25
                        bg-black/40
                        flex items-center justify-center
                    "
                >
                    <div
                        className="
                            bg-black/70
                            border border-white/20
                            rounded-3xl
                            p-6
                            w-80
                            text-white
                        "
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {current.index !== null ? "Edit Shortcut" : "Add Shortcut"}
                        </h2>

                        <input
                            placeholder="Name"
                            value={current.name}
                            onChange={(e) =>
                                setCurrent({ ...current, name: e.target.value })
                            }
                            className="
                                w-full px-4 py-2 rounded-xl
                                bg-white/10 border border-white/20
                                outline-none mb-3
                            "
                        />

                        <input
                            placeholder="URL (https://...)"
                            value={current.url}
                            onChange={(e) =>
                                setCurrent({ ...current, url: e.target.value })
                            }
                            className="
                                w-full px-4 py-2 rounded-xl
                                bg-white/10 border border-white/20
                                outline-none mb-4
                            "
                        />

                        <div className="flex justify-between">
                            {current.index !== null && (
                                <button
                                    onClick={() => {
                                        deleteShortcut(current.index);
                                        setShowEditor(false);
                                    }}
                                    className="text-red-400"
                                >
                                    Delete
                                </button>
                            )}

                            <div className="flex gap-3 ml-auto">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="text-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="
                                        px-4 py-1
                                        rounded-xl
                                        bg-white/20
                                        hover:bg-white/30
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
        </div>
    );
}
