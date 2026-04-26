import { useEffect, useState } from "react";
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2, FiX } from "react-icons/fi";

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
            (item, index) =>
                item.url === url && current.index !== index
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
            <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2">
                <div className="flex min-h-[340px] w-[72px] flex-col items-center gap-3 rounded-3xl border border-white/10 bg-black/25 py-4 backdrop-blur-xl shadow-2xl">
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            <button
                                onClick={() =>
                                    window.open(shortcut.url, "_blank", "noopener,noreferrer")
                                }
                                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 transition hover:scale-105 hover:bg-white/10"
                                title={shortcut.name}
                            >
                                {shortcut.icon ? (
                                    <img
                                        src={shortcut.icon}
                                        alt={shortcut.name}
                                        className="h-7 w-7 object-contain"
                                    />
                                ) : (
                                    <span className="text-[10px] text-white/80">
                                        {shortcut.name}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => openEditor(index)}
                                className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition group-hover:flex"
                                title="Edit shortcut"
                            >
                                <FiEdit2 size={11} />
                            </button>
                        </div>
                    ))}

                    {shortcuts.length < MAX_SHORTCUTS && (
                        <button
                            onClick={() => openEditor()}
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                            title="Add shortcut"
                        >
                            <FiPlus size={18} />
                        </button>
                    )}
                </div>
            </div>

            {showEditor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-6 text-white shadow-2xl backdrop-blur-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                {current.index !== null ? "Edit Shortcut" : "Add Shortcut"}
                            </h2>

                            <button
                                onClick={closeEditor}
                                className="text-white/60 transition hover:text-white"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <input
                            placeholder="Name"
                            value={current.name}
                            onChange={(e) =>
                                setCurrent({ ...current, name: e.target.value })
                            }
                            className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                        />

                        <input
                            placeholder="Website URL"
                            value={current.url}
                            onChange={(e) =>
                                setCurrent({ ...current, url: e.target.value })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") closeEditor();
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                        />

                        {error && (
                            <p className="mt-3 text-sm text-red-300">{error}</p>
                        )}

                        <div className="mt-6 flex items-center justify-between">
                            {current.index !== null ? (
                                <button
                                    onClick={() => deleteShortcut(current.index)}
                                    className="flex items-center gap-2 text-sm text-red-300 transition hover:text-red-200"
                                >
                                    <FiTrash2 size={15} />
                                    Delete
                                </button>
                            ) : (
                                <div />
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={closeEditor}
                                    className="px-4 py-2 text-sm text-white/60 transition hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="rounded-xl bg-white/15 px-5 py-2 text-sm transition hover:bg-white/25"
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
