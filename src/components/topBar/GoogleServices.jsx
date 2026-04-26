import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
    SiGmail,
    SiYoutube,
    SiGoogledrive,
    SiGooglemaps,
    SiGooglecalendar,
    SiGooglephotos,
    SiGoogledocs,
    SiGoogle,
} from "react-icons/si";

const SERVICES = [
    {
        name: "Google",
        icon: FcGoogle,
        url: "https://www.google.com",
    },
    {
        name: "Gmail",
        icon: SiGmail,
        url: "https://mail.google.com/mail/u/0/#inbox",
    },
    {
        name: "YouTube",
        icon: SiYoutube,
        url: "https://www.youtube.com/feed/subscriptions",
    },
    {
        name: "Drive",
        icon: SiGoogledrive,
        url: "https://drive.google.com/drive/my-drive",
    },
    {
        name: "Photos",
        icon: SiGooglephotos,
        url: "https://photos.google.com/library",
    },
    {
        name: "Docs",
        icon: SiGoogledocs,
        url: "https://docs.google.com/document/u/0/",
    },
    {
        name: "Calendar",
        icon: SiGooglecalendar,
        url: "https://calendar.google.com/calendar/u/0/r/week",
    },
    {
        name: "Maps",
        icon: SiGooglemaps,
        url: "https://maps.google.com",
    },
    {
        name: "Translate",
        icon: SiGoogle,
        url: "https://translate.google.com",
    },
    {
        name: "Meet",
        icon: SiGoogle,
        url: "https://meet.google.com",
    },
    {
        name: "Keep",
        icon: SiGoogle,
        url: "https://keep.google.com",
    },
    {
        name: "News",
        icon: SiGoogle,
        url: "https://news.google.com",
    },
    {
        name: "Gemini",
        icon: SiGoogle,
        url: "https://gemini.google.com",
    },
];

const SERVICE_COLORS = {
    Google: "#4285F4",
    Translate: "#4285F4",
    Meet: "#34A853",
    Keep: "#FABB05",
    News: "#1A73E8",
    Gemini: "#8E44AD",
    Gmail: "#EA4335",
    YouTube: "#FF0000",
    Drive: "#4285F4",
    Photos: "#DB4437",
    Docs: "#4285F4",
    Calendar: "#1A73E8",
    Maps: "#34A853",
};

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
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
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
                className={`
          flex h-10 w-10 items-center justify-center
          rounded-full border border-white/10
          backdrop-blur-xl transition-all
          ${open
                        ? "bg-black/65 ring-2 ring-white/20"
                        : "bg-black/45 hover:bg-black/60"
                    }
        `}
            >
                <FcGoogle size={20} />
            </button>

            {open && (
                <div
                    ref={panelRef}
                    role="menu"
                    aria-label="Google services"
                    className="absolute right-0 z-40 mt-3 w-72 rounded-3xl border border-white/15 bg-black/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                >
                    <div className="mb-3 text-center text-xs text-white/50">
                        Google Services
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {SERVICES.map((service) => {
                            const Icon = service.icon;
                            const active = lastUsed === service.name;

                            return (
                                <button
                                    key={service.name}
                                    onClick={() => openService(service)}
                                    title={service.name}
                                    className={`
                    group rounded-2xl border p-3
                    transition-all
                    ${active
                                            ? "border-white/30 bg-white/15"
                                            : "border-white/10 bg-white/5 hover:bg-white/12"
                                        }
                  `}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Icon
                                            className="text-xl transition-transform group-hover:scale-110"
                                            style={{
                                                color: SERVICE_COLORS[service.name],
                                                opacity: active ? 1 : 0.9,
                                            }}
                                        />

                                        <span className="text-[11px] text-white/75">
                                            {service.name}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="my-4 h-px bg-white/10" />

                    <button
                        onClick={openGoogleAccount}
                        className="w-full text-center text-sm text-white/60 transition hover:text-white"
                    >
                        Manage your Google Account
                    </button>
                </div>
            )}
        </div>
    );
}
