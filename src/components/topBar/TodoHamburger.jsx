import { useState, useEffect, useRef } from "react";
import { FiMenu, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";

export default function TodoHamburger() {
    const [open, setOpen] = useState(false);
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [armedDelete, setArmedDelete] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    const inputRef = useRef(null);

    /* Load */
    useEffect(() => {
        const saved = localStorage.getItem("todos");
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    /* Save */
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    /* Autofocus input */
    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
            setSelectedIndex(-1);
        }
    }, [open]);

    /* Outside click */
    useEffect(() => {
        if (!open) return;

        const handler = (e) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target) &&
                input.trim() === ""
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, input]);

    /* Keyboard controls */
    useEffect(() => {
        const handler = (e) => {
            const isTyping =
                document.activeElement === inputRef.current ||
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA";

            /* Global toggle */
            if (!isTyping && (e.key === "t" || e.key === "T")) {
                setOpen(v => !v);
            }

            if (!open) return;

            if (e.key === "Escape") {
                setOpen(false);
                return;
            }

            if (isTyping) return;

            /* Navigation */
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, todos.length - 1));
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            }

            const current = todos[selectedIndex];
            if (!current) return;

            /* Toggle done */
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                toggleTodo(current.id);
            }

            /* Delete */
            if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                deleteTodo(current.id);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, todos, selectedIndex, input]);

    const addTodo = () => {
        if (!input.trim()) return;
        setTodos([{ id: Date.now(), text: input.trim(), done: false }, ...todos]);
        setInput("");
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTodo = (id) => {
        if (armedDelete === id) {
            setTodos(todos.filter(t => t.id !== id));
            setArmedDelete(null);
        } else {
            setArmedDelete(id);
            setTimeout(() => setArmedDelete(null), 2000);
        }
    };

    return (
        <div className="relative">
            {/* BUTTON */}
            <button
                ref={buttonRef}
                onClick={() => setOpen(v => !v)}
                title="Quick Todo (T)"
                className={`
          w-11 h-11 rounded-2xl
          backdrop-blur-xl
          border border-white/10
          flex items-center justify-center
          transition-all
          ${open
                        ? "bg-black/60 rotate-90 shadow-[0_0_14px_rgba(0,0,0,0.8)]"
                        : "bg-black/45 hover:bg-black/60"
                    }
        `}
            >
                <FiMenu className="text-white/85" size={20} />
            </button>

            {/* PANEL */}
            {open && (
                <div
                    ref={panelRef}
                    className="
            absolute right-0 mt-4 w-72
            bg-black/60 backdrop-blur-2xl
            border border-white/10
            rounded-3xl p-4
            text-white/85
            shadow-[0_12px_40px_rgba(0,0,0,0.7)]
            animate-scaleIn z-40
          "
                >
                    <h3 className="text-sm font-semibold mb-3 text-white/70">
                        Quick Todo
                    </h3>

                    {/* INPUT */}
                    <div className="flex gap-2 mb-3">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                            placeholder="Type and press Enter…"
                            className="
                flex-1 px-3 py-2 rounded-xl
                bg-black/40 border border-white/10
                outline-none text-sm
                text-white/90 placeholder:text-white/40
              "
                        />
                        <button
                            onClick={addTodo}
                            className="px-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                        >
                            <FiPlus />
                        </button>
                    </div>

                    {/* LIST */}
                    <div className="relative max-h-56 overflow-y-auto flex flex-col gap-2">
                        {todos.length === 0 && (
                            <p className="text-white/40 text-sm text-center py-6">
                                Add your first task ☝
                            </p>
                        )}

                        {todos.map((todo, i) => (
                            <div
                                key={todo.id}
                                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl
                  border transition
                  ${i === selectedIndex ? "ring-2 ring-white/30" : ""}
                  ${todo.done
                                        ? "bg-green-500/15 border-green-500/30"
                                        : "bg-white/5 border-white/10"
                                    }
                `}
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center"
                                >
                                    {todo.done && <FiCheck size={14} />}
                                </button>

                                <span className={`flex-1 text-sm ${todo.done ? "line-through text-white/40" : ""}`}>
                                    {todo.text}
                                </span>

                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className={`${armedDelete === todo.id
                                        ? "text-red-400"
                                        : "text-white/40 hover:text-red-400"
                                        } transition`}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}

                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-black/70 to-transparent rounded-b-lg" />
                    </div>

                    <p className="mt-2 text-[10px] text-white/40 text-center">
                        T → toggle • ↑↓ navigate • Space → done • Del → delete • Esc → close
                    </p>
                </div>
            )}
        </div>
    );
}
