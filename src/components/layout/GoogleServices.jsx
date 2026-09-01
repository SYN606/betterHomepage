import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
    SiGmail,
    SiYoutube,
    SiGoogledrive,
    SiGooglephotos,
    SiGoogledocs,
    SiGooglecalendar,
} from "react-icons/si";

const SERVICES = [
    {
        name: "Gmail",
        icon: SiGmail,
        url: "https://mail.google.com/mail/u/0/#inbox",
        color: "#EA4335",
    },
    {
        name: "YouTube",
        icon: SiYoutube,
        url: "https://www.youtube.com/feed/subscriptions",
        color: "#FF0000",
    },
    {
        name: "Drive",
        icon: SiGoogledrive,
        url: "https://drive.google.com/drive/my-drive",
        color: "#4285F4",
    },
    {
        name: "Photos",
        icon: SiGooglephotos,
        url: "https://photos.google.com/library",
        color: "#DB4437",
    },
    {
        name: "Docs",
        icon: SiGoogledocs,
        url: "https://docs.google.com/document/u/0/",
        color: "#4285F4",
    },
    {
        name: "Calendar",
        icon: SiGooglecalendar,
        url: "https://calendar.google.com/calendar/u/0/r/week",
        color: "#1A73E8",
    },
];

export default function GoogleServices() {
    const [open, setOpen] = useState(false);
    const [lastUsed, setLastUsed] = useState(
        () => localStorage.getItem("google:lastService") || null
    );

    const panelRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const handleOutsideClick = (event) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const openService = (service) => {
        localStorage.setItem("google:lastService", service.name);
        setLastUsed(service.name);
        window.open(service.url, "_blank", "noopener,noreferrer");
        setOpen(false);
    };

    const openGoogleAccount = () => {
        window.open(
            "https://myaccount.google.com",
            "_blank",
            "noopener,noreferrer"
        );
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setOpen((prev) => !prev)}
                title="Google Services"
                aria-expanded={open}
                aria-haspopup="true"
                style={{
                    backgroundColor: open ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    borderColor: open ? "rgba(255, 255, 255, 0.3)" : "var(--glass-border)",
                    backdropFilter: "var(--glass-blur)",
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] text-text-primary transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10 cursor-pointer"
            >
                <FcGoogle size={18} />
            </button>

            {open && (
                <div
                    ref={panelRef}
                    role="menu"
                    aria-label="Google services"
                    style={{
                        backgroundColor: "rgba(10, 14, 22, 0.65)",
                        borderColor: "var(--glass-border)",
                        backdropFilter: "var(--glass-blur)",
                        boxShadow: "var(--shadow-glass)",
                    }}
                    className="absolute right-0 z-40 mt-3 w-64 rounded-3xl border-[0.5px] p-3.5 text-text-primary backdrop-blur-2xl transition-all"
                >
                    <div className="mb-2.5 text-center text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                        Google Workspace
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {SERVICES.map((service) => {
                            const Icon = service.icon;
                            const active = lastUsed === service.name;

                            return (
                                <button
                                    key={service.name}
                                    onClick={() => openService(service)}
                                    title={service.name}
                                    style={{
                                        backgroundColor: active ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.02)",
                                        borderColor: active ? "var(--glass-border-hover)" : "var(--glass-border)",
                                    }}
                                    className="group flex flex-col items-center justify-center rounded-2xl border-[0.5px] p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-white/30 hover:bg-white/10 cursor-pointer"
                                >
                                    <Icon
                                        className="text-xl transition-transform duration-200 group-hover:scale-110"
                                        style={{ color: service.color }}
                                    />
                                    <span className="mt-1.5 text-[10px] font-semibold text-text-secondary group-hover:text-text-primary">
                                        {service.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        style={{ borderColor: "var(--glass-border)" }}
                        className="my-3 border-t-[0.5px]"
                    />

                    <button
                        onClick={openGoogleAccount}
                        className="w-full rounded-xl py-1 text-center text-xs font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary cursor-pointer"
                    >
                        Manage Google Account
                    </button>
                </div>
            )}
        </div>
    );
}