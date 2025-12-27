import { useState, useEffect, useRef } from "react";
import { FiMenu, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";

export default function TodoHamburger() {
    const [open, setOpen] = useState(false);
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const panelRef = useRef(null);

    /* Load todos */
    useEffect(() => {
        const saved = localStorage.getItem("todos");
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    /* Save todos */
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    /* Close on outside click */
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const addTodo = () => {
        if (!input.trim()) return;
        setTodos([
            ...todos,
            { id: Date.now(), text: input.trim(), done: false }
        ]);
        setInput("");
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <>
            {/* HAMBURGER BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                title="Todo"
                className="
                    absolute top-6 right-6 z-30
                    w-11 h-11
                    rounded-2xl
                    bg-black/40
                    backdrop-blur-xl
                    border border-white/15
                    text-white
                    flex items-center justify-center
                    hover:bg-black/60
                    transition
                "
            >
                <FiMenu size={20} />
            </button>

            {/* TODO PANEL */}
            {open && (
                <div
                    ref={panelRef}
                    className="
                        absolute top-20 right-6 z-40
                        w-80
                        bg-black/70
                        backdrop-blur-2xl
                        border border-white/10
                        rounded-3xl
                        p-4
                        text-white
                        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                        animate-scaleIn
                    "
                >
                    <h3 className="text-lg font-semibold mb-3">
                        Todo
                    </h3>

                    {/* INPUT */}
                    <div className="flex gap-2 mb-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                            placeholder="Add a task"
                            className="
                                flex-1
                                px-3 py-2
                                rounded-xl
                                bg-white/10
                                border border-white/15
                                outline-none
                                text-white
                            "
                        />
                        <button
                            onClick={addTodo}
                            className="
                                px-3
                                rounded-xl
                                bg-white/20
                                hover:bg-white/30
                                transition
                            "
                        >
                            <FiPlus />
                        </button>
                    </div>

                    {/* LIST */}
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {todos.length === 0 && (
                            <p className="text-white/50 text-sm">
                                No tasks yet
                            </p>
                        )}

                        {todos.map(todo => (
                            <div
                                key={todo.id}
                                className="
                                    flex items-center gap-2
                                    px-3 py-2
                                    rounded-xl
                                    bg-white/5
                                    border border-white/10
                                "
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`
                                        w-6 h-6 flex items-center justify-center
                                        rounded-lg
                                        ${todo.done ? "bg-green-500/30" : "bg-white/10"}
                                    `}
                                >
                                    {todo.done && <FiCheck size={14} />}
                                </button>

                                <span
                                    className={`
                                        flex-1 text-sm
                                        ${todo.done ? "line-through text-white/40" : ""}
                                    `}
                                >
                                    {todo.text}
                                </span>

                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-white/50 hover:text-red-400"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
