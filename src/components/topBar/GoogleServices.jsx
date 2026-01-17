import { useEffect, useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import {
    SiGmail,
    SiYoutube,
    SiGoogledrive,
    SiGooglemaps,
    SiGooglecalendar,
    SiGooglephotos,
    SiGoogledocs
} from "react-icons/si";

/* ---------------- SERVICES ---------------- */

const SERVICES = [
    { name: "Gmail", icon: SiGmail, url: "https://mail.google.com/mail/u/0/#inbox" },
    { name: "YouTube", icon: SiYoutube, url: "https://www.youtube.com/feed/subscriptions" },
    { name: "Drive", icon: SiGoogledrive, url: "https://drive.google.com/drive/my-drive" },
    { name: "Photos", icon: SiGooglephotos, url: "https://photos.google.com/library" },
    { name: "Docs", icon: SiGoogledocs, url: "https://docs.google.com/document/u/0/" },
    { name: "Calendar", icon: SiGooglecalendar, url: "https://calendar.google.com/calendar/u/0/r/week" },
    { name: "Maps", icon: SiGooglemaps, url: "https://maps.google.com" }
];

/* ---------------- BRAND COLORS ---------------- */

const SERVICE_COLORS = {
    Gmail: "#EA4335",
    YouTube: "#FF0000",
    Drive: "#4285F4",
    Photos: "#DB4437",
    Docs: "#4285F4",
    Calendar: "#1A73E8",
    Maps: "#34A853"
};

/* ---------------- COMPONENT ---------------- */

export default function GoogleServices() {
    const [open, setOpen] = useState(false);
    const [lastUsed, setLastUsed] = useState(
        () => localStorage.getItem("google:lastService")
    );

    const panelRef = useRef(null);
    const buttonRef = useRef(null);

    /* Outside click */
    useEffect(() => {
        if (!open) return;

        const handler = (e) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    /* Keyboard shortcuts */
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "g" || e.key === "G") setOpen(v => !v);
            if (!open) return;

            if (e.key === "Escape") setOpen(false);

            const index = Number(e.key) - 1;
            if (SERVICES[index]) openService(SERVICES[index]);
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open]);

    const openService = (service) => {
        localStorage.setItem("google:lastService", service.name);
        window.open(service.url, "_blank", "noopener");
        setLastUsed(service.name);
        setOpen(false);
    };

    return (
        <div className="relative">
            {/* GOOGLE BUTTON */}
            <button
                ref={buttonRef}
                onClick={() => setOpen(v => !v)}
                title="Google services (G)"
                className={`
          w-10 h-10 rounded-full
          flex items-center justify-center
          border border-white/10
          backdrop-blur-xl
          transition-all
          ${open
                        ? "bg-black/65 ring-2 ring-white/20"
                        : "bg-black/45 hover:bg-black/60"}
        `}
            >
                <FcGoogle size={20} />
            </button>

            {/* PANEL */}
            {open && (
                <div
                    ref={panelRef}
                    role="menu"
                    aria-label="Google services"
                    className="
            absolute right-0 mt-3 w-72
            bg-black/80 backdrop-blur-2xl
            border border-white/15
            rounded-3xl
            p-4
            shadow-[0_20px_60px_rgba(0,0,0,0.7)]
            animate-scaleIn
            z-40
          "
                >
                    {/* SERVICES GRID */}
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
                    group h-14 rounded-xl
                    flex items-center justify-center
                    border transition
                    ${active
                                            ? "bg-white/15 border-white/30"
                                            : "bg-white/5 border-white/10 hover:bg-white/15"}
                  `}
                                >
                                    <Icon
                                        className="text-xl transition-transform group-hover:scale-110"
                                        style={{
                                            color: SERVICE_COLORS[service.name],
                                            opacity: active ? 1 : 0.85
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* DIVIDER */}
                    <div className="my-3 h-px bg-white/10" />

                    {/* ACCOUNT */}
                    <button
                        onClick={() => {
                            window.open("https://myaccount.google.com", "_blank", "noopener");
                            setOpen(false);
                        }}
                        className="
              w-full text-xs
              text-white/60 hover:text-white
              transition text-center
            "
                    >
                        Manage your Google Account
                    </button>
                </div>
            )}
        </div>
    );
}
