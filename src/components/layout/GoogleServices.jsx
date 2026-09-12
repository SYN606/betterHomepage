import { createSignal, onCleanup, onMount, Show, For } from "solid-js";
import {
  CalendarIcon,
  DocsIcon,
  DriveIcon,
  GmailIcon,
  GoogleColorIcon,
  PhotosIcon,
  YoutubeIcon,
} from "../common/Icons";

const SERVICES = [
  {
    name: "Gmail",
    icon: GmailIcon,
    url: "https://mail.google.com/mail/u/0/#inbox",
    color: "#EA4335",
  },
  {
    name: "YouTube",
    icon: YoutubeIcon,
    url: "https://www.youtube.com/feed/subscriptions",
    color: "#FF0000",
  },
  {
    name: "Drive",
    icon: DriveIcon,
    url: "https://drive.google.com/drive/my-drive",
    color: "#4285F4",
  },
  {
    name: "Photos",
    icon: PhotosIcon,
    url: "https://photos.google.com/library",
    color: "#DB4437",
  },
  {
    name: "Docs",
    icon: DocsIcon,
    url: "https://docs.google.com/document/u/0/",
    color: "#4285F4",
  },
  {
    name: "Calendar",
    icon: CalendarIcon,
    url: "https://calendar.google.com/calendar/u/0/r/week",
    color: "#1A73E8",
  },
];

export default function GoogleServices() {
  const [open, setOpen] = createSignal(false);
  const [lastUsed, setLastUsed] = createSignal(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("google:lastService") || null
      : null
  );

  let panelRef;
  let buttonRef;

  onMount(() => {
    const handleOutsideClick = (event) => {
      if (
        open() &&
        panelRef &&
        !panelRef.contains(event.target) &&
        buttonRef &&
        !buttonRef.contains(event.target)
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

    onCleanup(() => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

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
    <div class="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        title="Google Services"
        aria-expanded={open()}
        aria-haspopup="true"
        style={{
          "background-color": open()
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.03)",
          "border-color": open()
            ? "rgba(255, 255, 255, 0.3)"
            : "var(--glass-border)",
          "backdrop-filter": "var(--glass-blur)",
        }}
        class="flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] text-text-primary transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/10 cursor-pointer"
      >
        <GoogleColorIcon class="w-4.5 h-4.5" />
      </button>

      <Show when={open()}>
        <div
          ref={panelRef}
          role="menu"
          aria-label="Google services"
          style={{
            "background-color": "rgba(10, 14, 22, 0.65)",
            "border-color": "var(--glass-border)",
            "backdrop-filter": "var(--glass-blur)",
            "box-shadow": "var(--shadow-glass)",
          }}
          class="absolute right-0 z-40 mt-3 w-64 rounded-3xl border-[0.5px] p-3.5 text-text-primary backdrop-blur-2xl transition-all"
        >
          <div class="mb-2.5 text-center text-[11px] font-semibold tracking-wider text-text-muted uppercase">
            Google Workspace
          </div>

          <div class="grid grid-cols-3 gap-2">
            <For each={SERVICES}>
              {(service) => {
                const Icon = service.icon;
                const isItemActive = () => lastUsed() === service.name;

                return (
                  <button
                    onClick={() => openService(service)}
                    title={service.name}
                    style={{
                      "background-color": isItemActive()
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                      "border-color": isItemActive()
                        ? "var(--glass-border-hover)"
                        : "var(--glass-border)",
                    }}
                    class="group flex flex-col items-center justify-center rounded-2xl border-[0.5px] p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-white/30 hover:bg-white/10 cursor-pointer"
                  >
                    <Icon
                      class="text-xl transition-transform duration-200 group-hover:scale-110"
                      style={{ color: service.color }}
                    />
                    <span class="mt-1.5 text-[10px] font-semibold text-text-secondary group-hover:text-text-primary">
                      {service.name}
                    </span>
                  </button>
                );
              }}
            </For>
          </div>

          <div
            style={{ "border-color": "var(--glass-border)" }}
            class="my-3 border-t-[0.5px]"
          />

          <button
            onClick={openGoogleAccount}
            class="w-full rounded-xl py-1 text-center text-xs font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary cursor-pointer"
          >
            Manage Google Account
          </button>
        </div>
      </Show>
    </div>
  );
}