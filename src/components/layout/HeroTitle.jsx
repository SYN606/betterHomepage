import { createSignal, onCleanup, onMount, Show } from "solid-js";

const GREETINGS = {
  morning: [
    "Good Morning",
    "A fresh start",
    "New day, new focus",
    "Let’s begin",
    "Morning calm",
    "Time to get started",
    "Another day ahead",
    "Early focus",
    "Slow and steady",
    "Fresh perspectives",
  ],
  afternoon: [
    "Good Afternoon",
    "Stay focused",
    "Making progress",
    "Keep going",
    "Midday momentum",
    "Still time left",
    "Focused hours",
    "Keep the flow",
    "On track",
    "Steady pace",
  ],
  evening: [
    "Good Evening",
    "Time to slow down",
    "Wrapping up",
    "Evening calm",
    "Almost done",
    "Gentle pace",
    "End of the day",
    "Take it easy",
    "Soft focus",
    "Reflect & unwind",
  ],
  night: [
    "Quiet hours",
    "Focus mode",
    "Working late?",
    "Good Night",
    "Late hours",
    "Night focus",
    "Still here",
    "Silent time",
    "After hours",
    "Midnight thoughts",
  ],
};

export default function HeroTitle() {
  const [name, setName] = createSignal(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("heroName") || ""
      : ""
  );
  const [editing, setEditing] = createSignal(false);
  const [greeting, setGreeting] = createSignal("");
  const [time, setTime] = createSignal("");

  function getPeriod() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function getFormattedTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function updateGreeting(force = false) {
    const currentPeriod = getPeriod();
    const storageKey = `hero-greeting-${todayKey()}-${currentPeriod}`;

    let selected = localStorage.getItem(storageKey);

    if (force || !selected) {
      const options = GREETINGS[currentPeriod];
      selected = options[Math.floor(Math.random() * options.length)];
      localStorage.setItem(storageKey, selected);
    }

    setGreeting(selected);
  }

  function saveName(value) {
    setName(value);
    localStorage.setItem("heroName", value);
  }

  onMount(() => {
    setTime(getFormattedTime());
    updateGreeting(true);

    const clockInterval = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    const greetingInterval = setInterval(() => {
      updateGreeting(false);
    }, 15 * 60 * 1000);

    onCleanup(() => {
      clearInterval(clockInterval);
      clearInterval(greetingInterval);
    });
  });

  const getGreetingText = () => {
    const trimmed = name()?.trim();
    return trimmed ? `${greeting()}, ${trimmed}` : greeting();
  };

  return (
    <section class="flex w-full flex-col items-center justify-center gap-3 px-4 text-center select-none">
      {/* Dynamic Digital Clock - Fine-grained update touches only this text node */}
      <div
        style={{ "font-family": "var(--font-mono)" }}
        class="text-xs md:text-sm font-semibold tracking-[0.25em] text-text-muted uppercase drop-shadow-md"
      >
        {time()}
      </div>

      {/* Liquid Glass Greeting Box / Name Input */}
      <Show
        when={editing()}
        fallback={
          <div
            onClick={() => setEditing(true)}
            title="Click to set or change your name"
            style={{
              "background-color": "transparent",
              "border-color": "var(--glass-border)",
              "backdrop-filter": "var(--glass-blur)",
              "font-family": "var(--font-display)",
            }}
            class="w-full max-w-[640px] cursor-pointer rounded-full border-[0.5px] px-8 py-3.5 text-center text-2xl md:text-3xl font-semibold text-text-primary transition-all duration-300 hover:scale-[1.01] hover:border-white/30 hover:bg-white/5"
          >
            {getGreetingText()}
          </div>
        }
      >
        <input
          autofocus
          value={name()}
          placeholder="Enter your name"
          onInput={(e) => saveName(e.currentTarget.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              setEditing(false);
            }
          }}
          style={{
            "background-color": "rgba(255, 255, 255, 0.03)",
            "border-color": "var(--glass-border-hover)",
            "backdrop-filter": "var(--glass-blur)",
            "font-family": "var(--font-display)",
          }}
          class="w-full max-w-[640px] rounded-full border-[0.5px] px-8 py-3.5 text-center text-2xl md:text-3xl font-semibold text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 focus:border-white/30"
        />
      </Show>

      {/* Subtitle Motivator */}
      <p class="max-w-xl text-xs md:text-sm font-normal text-text-secondary leading-relaxed drop-shadow-sm">
        Stay focused. Small progress still moves you forward.
      </p>
    </section>
  );
}