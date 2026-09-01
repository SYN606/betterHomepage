import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";

const MAX_SHORTCUTS = 8;

const DEFAULT_SHORTCUTS = [
    { name: "Google", url: "https://google.com" },
    { name: "YouTube", url: "https://youtube.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Gmail", url: "https://mail.google.com" },
];

export default function PinnedShortcuts() {
    const [shortcuts, setShortcuts] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [error, setError] = useState("");
    const [current, setCurrent] = useState({
        index: null,
        name: "",
        url: "",
        icon: "",
    });

    useEffect(() => {
        const saved = localStorage.getItem("pinnedShortcuts");

        if (saved) {
            setShortcuts(JSON.parse(saved));
            return;
        }

        const starter = DEFAULT_SHORTCUTS.map((item) => ({
            ...item,
            icon: getFavicon(item.url),
        }));

        saveShortcuts(starter);
    }, []);

    const saveShortcuts = (data) => {
        setShortcuts(data);
        localStorage.setItem("pinnedShortcuts", JSON.stringify(data));
    };

    const normalizeUrl = (input) => {
        const value = input.trim();

        if (/^[a-zA-Z]+:\/\//.test(value)) {
            return value;
        }

        if (
            value.startsWith("localhost") ||
            /^\d{1,3}(\.\d{1,3}){3}/.test(value)
        ) {
            return `http://${value}`;
        }

        return `https://${value}`;
    };

    function getFavicon(url) {
        try {
            const parsed = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
        } catch {
            return "";
        }
    }

    const openEditor = (index = null) => {
        setError("");

        if (index !== null) {
            setCurrent({ index, ...shortcuts[index] });
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
        if (!current.name.trim() || !current.url.trim()) {
            setError("Please fill both name and website fields.");
            return;
        }

        const url = normalizeUrl(current.url);
        const icon = getFavicon(url);

        const duplicate = shortcuts.some(
            (item, index) => item.url === url && current.index !== index
        );

        if (duplicate) {
            setError("This shortcut already exists.");
            return;
        }

        let updated = [...shortcuts];

        if (current.index !== null) {
            updated[current.index] = {
                name: current.name.trim(),
                url,
                icon,
            };
        } else {
            if (shortcuts.length >= MAX_SHORTCUTS) {
                setError(`Maximum ${MAX_SHORTCUTS} shortcuts allowed.`);
                return;
            }

            updated.push({
                name: current.name.trim(),
                url,
                icon,
            });
        }

        saveShortcuts(updated);
        closeEditor();
    };

    const deleteShortcut = (index) => {
        const updated = shortcuts.filter((_, i) => i !== index);
        saveShortcuts(updated);
        closeEditor();
    };

    return (
        <>
            {/* Floating Transparent Dock Sidebar */}
            <div className="fixed left-5 top-1/2 z-20 -translate-y-1/2">
                <div
                    style={{
                        backgroundColor: "transparent",
                        borderColor: "var(--glass-border)",
                        backdropFilter: "var(--glass-blur)",
                    }}
                    className="flex flex-col items-center gap-2.5 rounded-full border-[0.5px] p-2 transition-all duration-300 hover:border-white/20"
                >
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="group relative">
                            <button
                                onClick={() =>
                                    window.open(shortcut.url, "_blank", "noopener,noreferrer")
                                }
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                                    borderColor: "var(--glass-border)",
                                }}
                                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-[0.5px] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/10 hover:border-white/30 cursor-pointer"
                                title={shortcut.name}
                            >
                                {shortcut.icon ? (
                                    <img
                                        src={shortcut.icon}
                                        alt={shortcut.name}
                                        className="h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <span className="text-[11px] font-semibold text-text-primary uppercase">
                                        {shortcut.name.charAt(0)}
                                    </span>
                                )}
                            </button>

                            {/* Quick Edit Pin */}
                            <button
                                onClick={() => openEditor(index)}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    borderColor: "var(--glass-border-hover)",
                                }}
                                className="absolute -right-1 -top-1 hidden h-4.5 w-4.5 items-center justify-center rounded-full border-[0.5px] text-text-primary backdrop-blur-md transition-transform duration-200 hover:scale-110 group-hover:flex cursor-pointer"
                                title="Edit shortcut"
                            >
                                <FiEdit2 size={9} />
                            </button>
                        </div>
                    ))}

                    {/* Add Shortcut Action */}
                    {shortcuts.length < MAX_SHORTCUTS && (
                        <button
                            onClick={() => openEditor()}
                            style={{
                                borderColor: "var(--glass-border)",
                            }}
                            className="flex h-11 w-11 items-center justify-center rounded-full border-[0.5px] border-dashed text-text-muted transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-white/30 hover:bg-white/5 hover:text-text-primary cursor-pointer"
                            title="Add shortcut"
                        >
                            <FiPlus size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Glassmorphic Modal Editor */}
            {showEditor && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        style={{
                            backgroundColor: "rgba(10, 14, 22, 0.65)",
                            borderColor: "var(--glass-border)",
                            backdropFilter: "var(--glass-blur)",
                        }}
                        className="w-full max-w-sm rounded-3xl border-[0.5px] p-6 text-text-primary shadow-2xl backdrop-blur-2xl transition-all"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-semibold tracking-tight text-text-primary">
                                {current.index !== null ? "Edit Shortcut" : "Add Shortcut"}
                            </h2>

                            <button
                                onClick={closeEditor}
                                className="rounded-full p-1 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary cursor-pointer"
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <input
                                placeholder="Shortcut Name"
                                value={current.name}
                                onChange={(e) =>
                                    setCurrent({ ...current, name: e.target.value })
                                }
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    borderColor: "var(--glass-border)",
                                }}
                                className="w-full rounded-2xl border-[0.5px] px-4 py-2 text-xs text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-white/30"
                            />

                            <input
                                placeholder="Website URL (e.g. github.com)"
                                value={current.url}
                                onChange={(e) =>
                                    setCurrent({ ...current, url: e.target.value })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                    if (e.key === "Escape") closeEditor();
                                }}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    borderColor: "var(--glass-border)",
                                }}
                                className="w-full rounded-2xl border-[0.5px] px-4 py-2 text-xs text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-white/30"
                            />
                        </div>

                        {error && (
                            <p className="mt-3 text-xs font-medium text-danger">{error}</p>
                        )}

                        <div className="mt-6 flex items-center justify-between">
                            {current.index !== null ? (
                                <button
                                    onClick={() => deleteShortcut(current.index)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-danger transition-colors hover:opacity-80 cursor-pointer"
                                >
                                    <FiTrash2 size={13} />
                                    Delete
                                </button>
                            ) : (
                                <div />
                            )}

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={closeEditor}
                                    className="rounded-xl px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-primary cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        borderColor: "var(--glass-border-hover)",
                                    }}
                                    className="rounded-xl border-[0.5px] px-4 py-1.5 text-xs font-semibold text-text-primary transition-all duration-200 hover:bg-white/15 cursor-pointer"
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